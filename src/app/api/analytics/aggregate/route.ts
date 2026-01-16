import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { subDays, format, startOfDay, endOfDay } from 'date-fns';

interface DailyAggregate {
    date: string;
    totalRevenue: number;
    totalOrders: number;
    totalTicketsSold: number;
    avgOrderValue: number;
    topEvents: { id: string; name: string; revenue: number; tickets: number }[];
    topOrganizers: { id: string; revenue: number }[];
    paymentMethods: { mpesa: number; card: number };
}

/**
 * Aggregates daily analytics data from orders
 * Stores in analytics_aggregates collection for fast retrieval
 */
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const daysBack = parseInt(searchParams.get('days') || '30');

        const aggregates: DailyAggregate[] = [];

        for (let i = 0; i < daysBack; i++) {
            const targetDate = subDays(new Date(), i);
            const dayStart = startOfDay(targetDate);
            const dayEnd = endOfDay(targetDate);
            const dateKey = format(targetDate, 'yyyy-MM-dd');

            // Query paid orders for this day
            const ordersQuery = query(
                collection(firestore, 'orders'),
                where('status', '==', 'paid'),
                where('createdAt', '>=', Timestamp.fromDate(dayStart)),
                where('createdAt', '<=', Timestamp.fromDate(dayEnd))
            );

            const ordersSnap = await getDocs(ordersQuery);

            let totalRevenue = 0;
            let totalOrders = 0;
            let totalTicketsSold = 0;
            const eventRevenue: Record<string, { name: string; revenue: number; tickets: number }> = {};
            const organizerRevenue: Record<string, number> = {};
            const paymentMethods = { mpesa: 0, card: 0 };

            ordersSnap.docs.forEach(doc => {
                const data = doc.data();
                totalOrders++;
                totalRevenue += data.total || 0;

                // Payment method tracking
                if (data.paymentGateway === 'mpesa') {
                    paymentMethods.mpesa += data.total || 0;
                } else {
                    paymentMethods.card += data.total || 0;
                }

                // Event & ticket breakdown
                if (data.items && Array.isArray(data.items)) {
                    data.items.forEach((item: any) => {
                        const baseId = item.id?.split('-')[0] || item.id;
                        const qty = item.quantity || 1;
                        const itemRevenue = (item.price || 0) * qty;
                        totalTicketsSold += qty;

                        if (!eventRevenue[baseId]) {
                            eventRevenue[baseId] = { name: item.name || 'Unknown', revenue: 0, tickets: 0 };
                        }
                        eventRevenue[baseId].revenue += itemRevenue;
                        eventRevenue[baseId].tickets += qty;
                    });
                }

                // Organizer tracking (if available)
                if (data.organizerId) {
                    organizerRevenue[data.organizerId] = (organizerRevenue[data.organizerId] || 0) + (data.total || 0);
                }
            });

            // Sort and get top 5 events
            const topEvents = Object.entries(eventRevenue)
                .map(([id, data]) => ({ id, ...data }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            // Sort and get top 5 organizers
            const topOrganizers = Object.entries(organizerRevenue)
                .map(([id, revenue]) => ({ id, revenue }))
                .sort((a, b) => b.revenue - a.revenue)
                .slice(0, 5);

            const dailyData: DailyAggregate = {
                date: dateKey,
                totalRevenue,
                totalOrders,
                totalTicketsSold,
                avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
                topEvents,
                topOrganizers,
                paymentMethods,
            };

            aggregates.push(dailyData);

            // Store in Firestore for future retrieval
            await setDoc(doc(firestore, 'analytics_aggregates', `daily_${dateKey}`), {
                ...dailyData,
                type: 'daily',
                timestamp: serverTimestamp(),
            });
        }

        // Calculate totals
        const totals = aggregates.reduce((acc, day) => ({
            totalRevenue: acc.totalRevenue + day.totalRevenue,
            totalOrders: acc.totalOrders + day.totalOrders,
            totalTicketsSold: acc.totalTicketsSold + day.totalTicketsSold,
            mpesaRevenue: acc.mpesaRevenue + day.paymentMethods.mpesa,
            cardRevenue: acc.cardRevenue + day.paymentMethods.card,
        }), { totalRevenue: 0, totalOrders: 0, totalTicketsSold: 0, mpesaRevenue: 0, cardRevenue: 0 });

        return NextResponse.json({
            success: true,
            period: `${daysBack} days`,
            totals: {
                ...totals,
                avgOrderValue: totals.totalOrders > 0 ? totals.totalRevenue / totals.totalOrders : 0,
            },
            dailyData: aggregates,
            message: 'Analytics aggregation complete',
        });
    } catch (error: any) {
        console.error('Analytics Aggregation Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
