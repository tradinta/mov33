import { NextRequest, NextResponse } from 'next/server';
import { initiateB2CPayout } from '@/lib/mpesa';
import { firestore } from '@/firebase';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Admin processing of a payout request
export async function POST(req: NextRequest) {
    try {
        const { payoutId } = await req.json();

        if (!payoutId) {
            return NextResponse.json({ error: 'Missing payoutId' }, { status: 400 });
        }

        // 1. Fetch payout document
        const payoutRef = doc(firestore, 'payouts', payoutId);
        const payoutSnap = await getDoc(payoutRef);

        if (!payoutSnap.exists()) {
            return NextResponse.json({ error: 'Payout request not found' }, { status: 404 });
        }

        const payoutData = payoutSnap.data();

        if (payoutData.status !== 'pending') {
            return NextResponse.json({ error: 'Payout already processed or cancelled' }, { status: 400 });
        }

        // 2. Initiate B2C Payout
        const result = await initiateB2CPayout(
            payoutData.phone,
            payoutData.amount,
            `Payout for ${payoutId}`
        );

        if (result.ConversationID) {
            // Update status to processing
            await updateDoc(payoutRef, {
                status: 'processing',
                conversationId: result.ConversationID,
                originatorConversationId: result.OriginatorConversationID,
                updatedAt: serverTimestamp()
            });

            return NextResponse.json({ success: true, message: 'Payout initiated successfully' });
        } else {
            return NextResponse.json({
                success: false,
                error: result.errorMessage || 'M-Pesa B2C initiation failed'
            }, { status: 500 });
        }

    } catch (error: any) {
        console.error('B2C Payout Route Error:', error);
        return NextResponse.json({
            error: error.message || 'Internal Server Error'
        }, { status: 500 });
    }
}
