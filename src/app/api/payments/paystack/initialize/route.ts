import { NextRequest, NextResponse } from 'next/server';
import { initializePaystackTransaction } from '@/lib/paystack';

export async function POST(req: NextRequest) {
    try {
        const { email, amount, reference, orderId, metadata } = await req.json();

        if (!email || !amount || !reference) {
            return NextResponse.json(
                { error: 'Missing required fields: email, amount, reference' },
                { status: 400 }
            );
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
