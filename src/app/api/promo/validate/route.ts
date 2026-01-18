import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { Promocode } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        if (!adminFirestore) {
            return NextResponse.json({ error: 'Firestore not initialized' }, { status: 500 });
        }

        const { code } = await req.json();

        if (!code) {
            return NextResponse.json({ error: 'Promo code is required' }, { status: 400 });
        }

        const promoSnap = await adminFirestore.collection('promocodes')
            .where('code', '==', code.toUpperCase())
            .where('active', '==', true)
            .limit(1)
            .get();

        if (promoSnap.empty) {
            return NextResponse.json({ error: 'Invalid or inactive promo code' }, { status: 404 });
        }

        const promoData = { id: promoSnap.docs[0].id, ...promoSnap.docs[0].data() } as Promocode;

        // Check usage limits
        if (promoData.maxUsage && promoData.usageCount >= promoData.maxUsage) {
            return NextResponse.json({ error: 'Promo code usage limit exceeded' }, { status: 400 });
        }

        // Only return necessary info
        return NextResponse.json({
            success: true,
            id: promoData.id,
            code: promoData.code,
            discountType: promoData.discountType,
            discountValue: promoData.discountValue
        });

    } catch (error: any) {
        console.error('Promo Validation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
