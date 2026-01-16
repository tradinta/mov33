'use client';

import { useEffect, useRef } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useAuth } from '@/context/auth-context';

interface EventViewTrackerProps {
    eventId?: string;
    tourId?: string;
    organizerId?: string;
}

// Generate or retrieve session ID
function getSessionId(): string {
    if (typeof window === 'undefined') return 'server';

    let sessionId = sessionStorage.getItem('mov33_session');
    if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        sessionStorage.setItem('mov33_session', sessionId);
    }
    return sessionId;
}

/**
 * Tracks views on event and tour detail pages
 * Records to analytics_event_views collection for trending and performance metrics
 */
export function EventViewTracker({ eventId, tourId, organizerId }: EventViewTrackerProps) {
    const { profile } = useAuth();
    const hasTracked = useRef(false);

    useEffect(() => {
        // Prevent double tracking in React strict mode
        if (hasTracked.current) return;
        if (!eventId && !tourId) return;

        const trackView = async () => {
            try {
                hasTracked.current = true;

                await addDoc(collection(firestore, 'analytics_event_views'), {
                    eventId: eventId || null,
                    tourId: tourId || null,
                    organizerId: organizerId || null,
                    userId: profile?.uid || null,
                    sessionId: getSessionId(),
                    timestamp: serverTimestamp(),
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    referrer: typeof document !== 'undefined' ? document.referrer : '',
                });
            } catch (error) {
                console.error('Event view tracking error:', error);
            }
        };

        trackView();
    }, [eventId, tourId, organizerId, profile?.uid]);

    return null;
}
