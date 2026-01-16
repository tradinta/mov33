import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';

interface RouteParams {
    params: Promise<{ checkoutId: string }>;
}

/**
 * Unified order status polling endpoint
 * Works for both M-Pesa (checkoutRequestId) and Paystack (reference)
 */
export async function GET(req: NextRequest, { params }: RouteParams) {
    try {
        const { checkoutId } = await params;

        if (!checkoutId) {
            return NextResponse.json({ error: 'Missing checkout ID' }, { status: 400 });
        }

        // Try to find order by M-Pesa checkoutRequestId
        let q = query(
            collection(firestore, 'orders'),
            where('checkoutRequestId', '==', checkoutId)
        );
        let snap = await getDocs(q);

        // If not found, try Paystack reference
        if (snap.empty) {
            q = query(
                collection(firestore, 'orders'),
                where('paystackReference', '==', checkoutId)
            );
            snap = await getDocs(q);
        }

        if (snap.empty) {
            return NextResponse.json({
                found: false,
                status: 'not_found',
                message: 'Order not found',
            });
        }

        const orderDoc = snap.docs[0];
        const orderData = orderDoc.data();

        return NextResponse.json({
            found: true,
            orderId: orderDoc.id,
            status: orderData.status,
            paidAt: orderData.paidAt || null,
            receiptNumber: orderData.mpesaReceiptNumber || orderData.paystackReceiptNumber || null,
            paymentGateway: orderData.paymentGateway || (orderData.checkoutRequestId ? 'mpesa' : 'paystack'),
        });
    } catch (error: any) {
        console.error('Order Status Check Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
