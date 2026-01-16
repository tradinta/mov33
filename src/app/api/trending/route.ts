import { NextRequest, NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

/**
 * Get cached trending items for homepage
 * Falls back to fetching live if cache expired
 */
export async function GET(req: NextRequest) {
    try {
        const cacheRef = doc(firestore, 'trending_cache', 'homepage');
        const cacheSnap = await getDoc(cacheRef);

        if (cacheSnap.exists()) {
            const data = cacheSnap.data();
            return NextResponse.json({
                success: true,
                trending: data.items || [],
                lastUpdated: data.lastUpdated?.toDate?.() || null,
                cached: true,
            });
        }

        // No cache exists yet - return empty
        return NextResponse.json({
            success: true,
            trending: [],
            lastUpdated: null,
            cached: false,
            message: 'No trending data available yet. Run /api/trending/update first.',
        });
    } catch (error: any) {
        console.error('Trending Fetch Error:', error);
        return NextResponse.json(
            { error: error.message || 'Internal Server Error' },
            { status: 500 }
        );
    }
}
