/**
 * Paystack Payment Gateway Utility
 * Handles transaction initialization, verification, and webhook processing
 */

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;
const BASE_URL = 'https://api.paystack.co';

interface PaystackInitializeResponse {
    status: boolean;
    message: string;
    data?: {
        authorization_url: string;
        access_code: string;
        reference: string;
    };
}

interface PaystackVerifyResponse {
    status: boolean;
    message: string;
    data?: {
        id: number;
        status: 'success' | 'failed' | 'abandoned' | 'pending';
        reference: string;
        amount: number;
        gateway_response: string;
        paid_at: string;
        channel: string;
        currency: string;
        customer: {
            email: string;
            customer_code: string;
        };
        metadata?: Record<string, any>;
    };
}

/**
 * Initialize a Paystack transaction
 * Returns authorization URL for redirect or inline popup
 */
export async function initializePaystackTransaction(
    email: string,
    amount: number, // Amount in KES (will be converted to kobo)
    reference: string,
    callbackUrl: string,
    metadata?: Record<string, any>
): Promise<PaystackInitializeResponse> {
    if (!PAYSTACK_SECRET) {
        throw new Error('Paystack secret key not configured');
    }

    try {
        const response = await fetch(`${BASE_URL}/transaction/initialize`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                amount: Math.round(amount * 100), // Convert to kobo (smallest unit)
                reference,
                callback_url: callbackUrl,
                currency: 'KES',
                channels: ['card', 'bank', 'ussd', 'mobile_money'],
                metadata: {
                    ...metadata,
                    custom_fields: [
                        {
                            display_name: 'Order Reference',
                            variable_name: 'order_reference',
                            value: reference,
                        },
                    ],
                },
            }),
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Paystack Initialize Error:', error);
        throw error;
    }
}

/**
 * Verify a Paystack transaction by reference
 */
export async function verifyPaystackTransaction(
    reference: string
): Promise<PaystackVerifyResponse> {
    if (!PAYSTACK_SECRET) {
        throw new Error('Paystack secret key not configured');
    }

    try {
        const response = await fetch(`${BASE_URL}/transaction/verify/${reference}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${PAYSTACK_SECRET}`,
            },
        });

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Paystack Verify Error:', error);
        throw error;
    }
}

/**
 * Validate Paystack webhook signature
 */
export function validatePaystackWebhook(
    signature: string,
    body: string
): boolean {
    if (!PAYSTACK_SECRET) return false;

    const crypto = require('crypto');
    const hash = crypto
        .createHmac('sha512', PAYSTACK_SECRET)
        .update(body)
        .digest('hex');

    return hash === signature;
}
