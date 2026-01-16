'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useAuth } from '@/context/auth-context';

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

export function AnalyticsTracker() {
    const pathname = usePathname();
    const { profile } = useAuth();
    const lastTrackedPath = useRef<string | null>(null);

    useEffect(() => {
        // Only track if pathname changed (prevents duplicate tracking)
        if (lastTrackedPath.current === pathname) return;
        lastTrackedPath.current = pathname;

        const trackPageView = async () => {
            try {
                await addDoc(collection(firestore, 'analytics_pageviews'), {
                    path: pathname,
                    timestamp: serverTimestamp(),
                    userId: profile?.uid || null,
                    userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
                    referrer: typeof document !== 'undefined' ? document.referrer : '',
                    screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
                    screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
                    language: typeof navigator !== 'undefined' ? navigator.language : '',
                    sessionId: getSessionId(),
                });
            } catch (error) {
                // Silently fail - analytics shouldn't break the app
                console.error('Analytics tracking error:', error);
            }
        };

        trackPageView();
    }, [pathname]); // Only depend on pathname, not profile

    return null;
}

