import { NextRequest, NextResponse } from 'next/server';
import { initiateStkPush } from '@/lib/mpesa';

export async function POST(req: NextRequest) {
    try {
        const { phoneNumber, amount, reference } = await req.json();

        if (!phoneNumber || !amount || !reference) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await initiateStkPush(phoneNumber, amount, reference);

        if (result.ResponseCode === '0') {
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
