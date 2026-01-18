import { NextRequest, NextResponse } from 'next/server';
import { adminFirestore } from '@/lib/firebase-admin';
import { Event, Promocode } from '@/lib/types';
import { serverTimestamp } from 'firebase/firestore';

const ADD_ON_PRICES = {
    parking: 500,
    tshirt: 2500,
};

export async function POST(req: NextRequest) {
    try {
        if (!adminFirestore) {
            return NextResponse.json({ error: 'Firestore is not initialized' }, { status: 500 });
        }

        const body = await req.json();
        const {
            contactName,
            contactEmail,
            contactPhone,
            cartItems,
            ticketHolders,
            addOns,
            promoCode
        } = body;

        if (!contactName || !contactEmail || !contactPhone || !cartItems || cartItems.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // 1. Verify Prices and Calculate Subtotal
        let subtotal = 0;
        const verifiedItems = [];

        for (const item of cartItems) {
            // item.id is actually the composite ID eventId-tierName
            // We need to parse it or pass both eventId and tier name
            // Looking at CartContext: generateItemId(itemToAdd.id, itemToAdd.variant)
            // item.id here is the original event.id before generateItemId? 
            // No, the cart stores them with the generated ID.

            // Let's assume the client sends the original eventId and tierName separately for clarity
            // Or we parse the composite ID. 
            // Actually, let's adjust the client to send what we need.

            // For now, let's assume item contains eventId and tierName
            const eventId = item.eventId || item.id.split('-')[0];
            const tierName = item.variant?.name;

            const eventDoc = await adminFirestore.collection('events').doc(eventId).get();
            if (!eventDoc.exists) {
                return NextResponse.json({ error: `Event not found: ${eventId}` }, { status: 404 });
            }

            const eventData = eventDoc.data() as Event;
            const tier = eventData.ticketTiers?.find(t => t.tier === tierName);

            if (!tier) {
                return NextResponse.json({ error: `Ticket tier not found: ${tierName}` }, { status: 404 });
            }

            // Check for early bird
            let price = tier.price;
            if (tier.earlyBirdPrice && tier.earlyBirdDeadline) {
                const deadline = tier.earlyBirdDeadline.toDate();
                if (new Date() < deadline) {
                    price = tier.earlyBirdPrice;
                }
            }

            subtotal += price * item.quantity;
            verifiedItems.push({
                ...item,
                price, // Use server-verified price
                eventId,
                eventName: eventData.title,
                tierName
            });
        }

        // 2. Calculate Add-ons
        let addOnTotal = 0;
        if (addOns) {
            if (addOns.parking) addOnTotal += ADD_ON_PRICES.parking;
            if (addOns.tshirt) addOnTotal += ADD_ON_PRICES.tshirt;
        }

        const totalBeforeDiscount = subtotal + addOnTotal;

        // 3. Apply Promo Code
        let discountAmount = 0;
        let appliedPromo = null;

        if (promoCode) {
            const promoSnap = await adminFirestore.collection('promocodes')
                .where('code', '==', promoCode.toUpperCase())
                .where('active', '==', true)
                .limit(1)
                .get();

            if (!promoSnap.empty) {
                const promoData = { id: promoSnap.docs[0].id, ...promoSnap.docs[0].data() } as Promocode;

                // Check usage limits if applicable
                if (promoData.maxUsage && promoData.usageCount >= promoData.maxUsage) {
                    // Promo expired, ignore it or return error?
                    // Let's return error to inform user
                    return NextResponse.json({ error: 'Promo code usage limit exceeded' }, { status: 400 });
                }

                if (promoData.discountType === 'percentage') {
                    discountAmount = totalBeforeDiscount * (promoData.discountValue / 100);
                } else {
                    discountAmount = promoData.discountValue;
                }
                appliedPromo = promoData;
            } else {
                return NextResponse.json({ error: 'Invalid or inactive promo code' }, { status: 400 });
            }
        }

        const finalTotal = Math.max(0, totalBeforeDiscount - discountAmount);

        // 4. Create Order
        const orderData = {
            contactName,
            contactEmail,
            contactPhone,
            items: verifiedItems,
            ticketHolders,
            subtotal,
            addOnTotal,
            discountAmount,
            total: finalTotal,
            status: 'pending',
            promoCode: appliedPromo?.code || null,
            promocodeId: appliedPromo?.id || null,
            influencerId: appliedPromo?.influencerId || null,
            createdAt: new Date(), // Using JS Date for server-side
            updatedAt: new Date()
        };

        const orderRef = await adminFirestore.collection('orders').add(orderData);

        return NextResponse.json({
            success: true,
            orderId: orderRef.id,
            total: finalTotal
        });

    } catch (error: any) {
        console.error('Order Creation Error:', error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
