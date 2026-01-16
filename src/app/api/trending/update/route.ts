import { NextRequest, NextResponse } from 'next/server';
import { collection, query, where, getDocs, orderBy, Timestamp, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { subHours, format } from 'date-fns';

interface TrendingItem {
    id: string;
    type: 'event' | 'tour';
    name: string;
    image: string;
    score: number;
    views: number;
    purchases: number;
}

/**
 * Trending Algorithm:
 * Score = (views × 0.3) + (purchases × 0.5) + (recency × 0.2)
 * 
 * Updates every 85 hours (called by cron job)
 */
export async function GET(req: NextRequest) {
    try {
        const now = new Date();
        const cutoffTime = subHours(now, 85); // Last 85 hours for trending

        // 1. Get event views in the timeframe
        const viewsQuery = query(
            collection(firestore, 'analytics_event_views'),
            where('timestamp', '>=', Timestamp.fromDate(cutoffTime)),
            orderBy('timestamp', 'desc')
        );
        const viewsSnap = await getDocs(viewsQuery);

        // Count views per event/tour
        const viewCounts: Record<string, { type: 'event' | 'tour'; views: number; latestView: Date }> = {};

        viewsSnap.docs.forEach(doc => {
            const data = doc.data();
            const eventId = data.eventId;
            const tourId = data.tourId;
            const timestamp = data.timestamp?.toDate?.() || new Date();

            if (eventId) {
                if (!viewCounts[eventId]) {
                    viewCounts[eventId] = { type: 'event', views: 0, latestView: timestamp };
                }
                viewCounts[eventId].views++;
                if (timestamp > viewCounts[eventId].latestView) {
                    viewCounts[eventId].latestView = timestamp;
                }
            }

            if (tourId) {
                if (!viewCounts[tourId]) {
                    viewCounts[tourId] = { type: 'tour', views: 0, latestView: timestamp };
                }
                viewCounts[tourId].views++;
                if (timestamp > viewCounts[tourId].latestView) {
                    viewCounts[tourId].latestView = timestamp;
                }
            }
        });

        // 2. Get purchases in the timeframe (from orders)
        const ordersQuery = query(
            collection(firestore, 'orders'),
            where('createdAt', '>=', Timestamp.fromDate(cutoffTime)),
            where('status', '==', 'paid')
        );
        const ordersSnap = await getDocs(ordersQuery);

        const purchaseCounts: Record<string, number> = {};

        ordersSnap.docs.forEach(doc => {
            const data = doc.data();
            if (data.items && Array.isArray(data.items)) {
                data.items.forEach((item: any) => {
                    // Extract base event ID from composite ID like "event-id-tier-id"
                    const baseId = item.id?.split('-')[0] || item.id;
                    if (baseId) {
                        purchaseCounts[baseId] = (purchaseCounts[baseId] || 0) + (item.quantity || 1);
                    }
                });
            }
        });

        // 3. Fetch event/tour details for items with views
        const allIds = Object.keys(viewCounts);
        const trendingItems: TrendingItem[] = [];

        for (const id of allIds) {
            const item = viewCounts[id];
            let name = '';
            let image = '';

            try {
                if (item.type === 'event') {
                    const eventDoc = await getDocs(query(collection(firestore, 'events'), where('__name__', '==', id)));
                    if (!eventDoc.empty) {
                        const eventData = eventDoc.docs[0].data();
                        name = eventData.title || 'Unknown Event';
                        image = eventData.imageUrl || '';
                    }
                } else {
                    const tourDoc = await getDocs(query(collection(firestore, 'tours'), where('__name__', '==', id)));
                    if (!tourDoc.empty) {
                        const tourData = tourDoc.docs[0].data();
                        name = tourData.title || 'Unknown Tour';
                        image = tourData.imageUrl || '';
                    }
                }
            } catch (e) {
                console.error(`Error fetching ${item.type} ${id}:`, e);
            }

            if (!name) continue; // Skip if we couldn't find the item

            const purchases = purchaseCounts[id] || 0;
            const views = item.views;

            // Recency score: how recent is the latest view (0-1 scale)
            const hoursAgo = (now.getTime() - item.latestView.getTime()) / (1000 * 60 * 60);
            const recencyScore = Math.max(0, 1 - (hoursAgo / 85));

            // Calculate trending score
            const score = (views * 0.3) + (purchases * 0.5) + (recencyScore * 10 * 0.2);

            trendingItems.push({
                id,
                type: item.type,
                name,
                image,
                score,
                views,
                purchases,
            });
        }

        // 4. Sort by score and take top 10
        trendingItems.sort((a, b) => b.score - a.score);
        const topTrending = trendingItems.slice(0, 10);

        // 5. Cache the results
        const cacheRef = doc(firestore, 'trending_cache', 'homepage');
        await setDoc(cacheRef, {
            items: topTrending,
            lastUpdated: serverTimestamp(),
            nextUpdate: Timestamp.fromDate(new Date(now.getTime() + (85 * 60 * 60 * 1000))),
            totalAnalyzed: allIds.length,
        });

        return NextResponse.json({
            success: true,
            trending: topTrending,
            totalAnalyzed: allIds.length,
            message: 'Trending cache updated successfully',
        });
    } catch (error: any) {
        console.error('Trending Update Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
