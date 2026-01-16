/**
 * M-Pesa Daraja API Utility
 * Handles Authentication, STK Push, and B2C Payouts
 */

const CONSUMER_KEY = process.env.MPESA_CONSUMER_KEY;
const CONSUMER_SECRET = process.env.MPESA_CONSUMER_SECRET;
const SHORTCODE = process.env.MPESA_SHORTCODE;
const PASSKEY = process.env.MPESA_PASSKEY;
const ENV = process.env.NODE_ENV === 'production' ? 'api' : 'sandbox';

const BASE_URL = `https://${ENV}.safaricom.co.ke`;

export async function getAccessToken() {
    const auth = Buffer.from(`${CONSUMER_KEY}:${CONSUMER_SECRET}`).toString('base64');

    try {
        const response = await fetch(`${BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        });

        const data = await response.json();
        return data.access_token;
    } catch (error) {
        console.error("Error getting M-Pesa access token:", error);
        throw error;
    }
}

export async function initiateStkPush(phoneNumber: string, amount: number, reference: string) {
    const accessToken = await getAccessToken();
    const timestamp = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const password = Buffer.from(`${SHORTCODE}${PASSKEY}${timestamp}`).toString('base64');

    // Normalize phone number to 254XXXXXXXXX
    const formattedPhone = phoneNumber.replace('+', '').replace(/^0/, '254');

    const body = {
        BusinessShortCode: SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: "CustomerPayBillOnline",
        Amount: Math.round(amount),
        PartyA: formattedPhone,
        PartyB: SHORTCODE,
        PhoneNumber: formattedPhone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: reference,
        TransactionDesc: `Payment for ${reference}`
    };

    try {
        const response = await fetch(`${BASE_URL}/mpesa/stkpush/v1/processrequest`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    } catch (error) {
        console.error("M-Pesa STK Push Error:", error);
        throw error;
    }
}

export async function initiateB2CPayout(phoneNumber: string, amount: number, remarks: string) {
    const accessToken = await getAccessToken();

    // Normalize phone number
    const formattedPhone = phoneNumber.replace('+', '').replace(/^0/, '254');

    const body = {
        OriginatorConversationID: btoa(new Date().getTime().toString()),
        InitiatorName: process.env.MPESA_INITIATOR_NAME,
        SecurityCredential: process.env.MPESA_SECURITY_CREDENTIAL,
        CommandID: "BusinessPayment",
        Amount: Math.round(amount),
        PartyA: SHORTCODE,
        PartyB: formattedPhone,
        Remarks: remarks,
        QueueTimeOutURL: `${process.env.MPESA_CALLBACK_URL}/timeout`,
        ResultURL: `${process.env.MPESA_CALLBACK_URL}/result`,
        Occasion: "Payout"
    };

    try {
        const response = await fetch(`${BASE_URL}/mpesa/b2c/v1/paymentrequest`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        return await response.json();
    } catch (error) {
        console.error("M-Pesa B2C Error:", error);
        throw error;
    }
}
