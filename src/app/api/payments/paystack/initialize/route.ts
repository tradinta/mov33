import { NextRequest, NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';
import { adminFirestore } from '@/lib/firebase-admin';

export async function POST(req: NextRequest) {
    try {
        const { email, reference, orderId, metadata } = await req.json();

        if (!email || !orderId || !reference) {
            return NextResponse.json(
                { error: 'Missing required fields: email, orderId, reference' },
                { status: 400 }
            );
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

        // Construct callback URL
        const origin = req.headers.get('origin') || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:9002';
        const callbackUrl = `${origin}/order-success?ref=${reference}&gateway=paystack`;

        const result = await initializePaystackTransaction(
            email,
            amount,
            reference,
            callbackUrl,
            {
                orderId,
                ...metadata,
            }
        );

        if (result.status && result.data) {
            // Update order with paystack reference
            await adminFirestore.collection('orders').doc(orderId).update({
                paystackReference: reference,
                paymentGateway: 'paystack'
            });

            return NextResponse.json({
                success: true,
                authorizationUrl: result.data.authorization_url,
                accessCode: result.data.access_code,
                reference: result.data.reference,
            });
        } else {
            return NextResponse.json(
                {
                    success: false,
                    error: result.message || 'Failed to initialize Paystack transaction',
                },
                { status: 500 }
            );
        }
    } catch (error: any) {
        console.error('Paystack Initialize Route Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
