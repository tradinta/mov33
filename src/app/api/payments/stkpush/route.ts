import { NextRequest, NextResponse } from 'next/server';
import { initiateStkPush } from '@/lib/mpesa';
import { adminFirestore } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { phoneNumber, orderId, reference } = await req.json();

        if (!phoneNumber || !orderId || !reference) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        if (!adminFirestore) {
            return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
        }

        // Fetch order to get verified amount
        const orderDoc = await adminFirestore.collection('orders').doc(orderId).get();
        if (!orderDoc.exists) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        const orderData = orderDoc.data();
        const amount = Math.round(orderData?.total || 0);

        if (amount <= 0) {
            return NextResponse.json({ error: 'Invalid order amount' }, { status: 400 });
        }

        const result = await initiateStkPush(phoneNumber, amount, reference);

        if (result.ResponseCode === '0') {
            // Update order with checkoutRequestId for polling
            await adminFirestore.collection('orders').doc(orderId).update({
                checkoutRequestId: result.CheckoutRequestID,
                paymentGateway: 'mpesa'
            });

            return NextResponse.json({
                success: true,
                merchantRequestId: result.MerchantRequestID,
                checkoutRequestId: result.CheckoutRequestID,
                message: result.CustomerMessage
            });
        } else {
            return NextResponse.json({
                success: false,
                error: result.errorMessage || 'M-Pesa request failed'
            }, { status: 500 });
        }
    } catch (error: any) {
        console.error('STK Push Route Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
