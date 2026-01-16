import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, query, where, getDocs, updateDoc, doc, increment, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { TicketRecord } from '@/lib/types';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        console.log('M-Pesa Callback Received:', JSON.stringify(body, null, 2));

        const stkCallback = body.Body.stkCallback;
        const checkoutRequestId = stkCallback.CheckoutRequestID;
        const merchantRequestId = stkCallback.MerchantRequestID;
        const resultCode = stkCallback.ResultCode;

        // Log the result in a payments collection for auditing
        await addDoc(collection(firestore, 'mpesa_logs'), {
            checkoutRequestId,
            merchantRequestId,
            resultCode,
            resultDesc: stkCallback.ResultDesc,
            fullBody: body,
            timestamp: new Date().toISOString()
        });

        if (resultCode === 0) {
            // Success! Update the corresponding order/ticket
            // NOTE: You'll need to link this checkoutRequestId to an orderId when initiating the push
            const q = query(collection(firestore, 'orders'), where('checkoutRequestId', '==', checkoutRequestId));
            const snap = await getDocs(q);

            if (!snap.empty) {
                const orderDoc = snap.docs[0];
                const orderData = orderDoc.data();

                await updateDoc(doc(firestore, 'orders', orderDoc.id), {
                    status: 'paid',
                    mpesaReceiptNumber: stkCallback.CallbackMetadata.Item.find((i: any) => i.Name === 'MpesaReceiptNumber')?.Value,
                    paidAt: new Date().toISOString()
                });

                // 3. Generate Secure Tickets for each attendee
                if (orderData.items && orderData.ticketHolders) {
                    const ticketsCollection = collection(firestore, 'tickets');
                    const ticketPromises = orderData.items.flatMap((item: any, itemIndex: number) => {
                        // Assuming each item in cart is for a set of attendees
                        // For simplicity, we match the index of ticketHolders
                        // In a more robust system, we'd map this exactly
                        return Array.from({ length: item.quantity }).map(async (_, qIndex) => {
                            const holderIndex = (itemIndex * item.quantity) + qIndex;
                            const holder = orderData.ticketHolders[holderIndex] || { fullName: orderData.contactName, email: orderData.contactEmail };

                            const ticketData: Omit<TicketRecord, 'id'> = {
                                orderId: orderDoc.id,
                                eventId: item.id.split('-')[0], // Extracting base event ID
                                eventName: item.name,
                                eventDate: orderData.eventDate || serverTimestamp(), // Ensure eventDate is passed in order
                                eventLocation: orderData.eventLocation || 'Venue',
                                userId: orderData.userId || 'guest',
                                userName: holder.fullName,
                                userEmail: holder.email,
                                ticketType: item.variant.name,
                                price: item.price,
                                qrCode: uuidv4(), // Secure unique ID for QR
                                checkedIn: false,
                                organizerId: orderData.organizerId || 'system',
                                createdAt: serverTimestamp() as any
                            };

                            return addDoc(ticketsCollection, ticketData);
                        });
                    });

                    await Promise.all(ticketPromises);
                }
            }
        }

        return NextResponse.json({ ResultCode: 0, ResultDesc: 'Success' });
    } catch (error) {
        console.error('M-Pesa Callback Error:', error);
        // Safaricom expects a success response even if the internal processing fails, 
        // to stop it from retrying uselessly, or you can signal an error.
        return NextResponse.json({ ResultCode: 1, ResultDesc: 'Internal Error' });
    }
}
