import { NextRequest, NextResponse } from 'next/server';
import { verifyPaystackTransaction } from '@/lib/paystack';
import { collection, query, where, getDocs, updateDoc, doc, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { v4 as uuidv4 } from 'uuid';
import { TicketRecord } from '@/lib/types';

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const reference = searchParams.get('reference');

        if (!reference) {
            return NextResponse.json(
                { error: 'Missing reference parameter' },
                { status: 400 }
            );
        }

        const result = await verifyPaystackTransaction(reference);

        if (!result.status || !result.data) {
            return NextResponse.json({
                success: false,
                status: 'unknown',
                message: result.message,
            });
        }

        const { status, gateway_response, paid_at, channel } = result.data;

        // If payment is successful, update the order
        if (status === 'success') {
            const q = query(
                collection(firestore, 'orders'),
                where('paystackReference', '==', reference)
            );
            const snap = await getDocs(q);

            if (!snap.empty) {
                const orderDoc = snap.docs[0];
                const orderData = orderDoc.data();

                // Only process if not already processed
                if (orderData.status !== 'paid') {
                    await updateDoc(doc(firestore, 'orders', orderDoc.id), {
                        status: 'paid',
                        paystackReceiptNumber: reference,
                        paymentChannel: channel,
                        paidAt: paid_at,
                    });

                    // Generate tickets
                    if (orderData.items && orderData.ticketHolders) {
                        const ticketsCollection = collection(firestore, 'tickets');
                        const ticketPromises = orderData.items.flatMap((item: any, itemIndex: number) => {
                            return Array.from({ length: item.quantity }).map(async (_, qIndex) => {
                                const holderIndex = (itemIndex * item.quantity) + qIndex;
                                const holder = orderData.ticketHolders[holderIndex] || {
                                    fullName: orderData.contactName,
                                    email: orderData.contactEmail,
                                };

                                const ticketData: Omit<TicketRecord, 'id'> = {
                                    orderId: orderDoc.id,
                                    eventId: item.id.split('-')[0],
                                    eventName: item.name,
                                    eventDate: orderData.eventDate || serverTimestamp(),
                                    eventLocation: orderData.eventLocation || 'Venue',
                                    userId: orderData.userId || 'guest',
                                    userName: holder.fullName,
                                    userEmail: holder.email,
                                    ticketType: item.variant?.name || 'General',
                                    price: item.price,
                                    qrCode: uuidv4(),
                                    checkedIn: false,
                                    organizerId: orderData.organizerId || 'system',
                                    createdAt: serverTimestamp() as any,
                                };

                                return addDoc(ticketsCollection, ticketData);
                            });
                        });

                        await Promise.all(ticketPromises);
                    }
                }
            }
        }

        return NextResponse.json({
            success: true,
            status,
            gatewayResponse: gateway_response,
            paidAt: paid_at,
            channel,
        });
    } catch (error: any) {
        console.error('Paystack Verify Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
