'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebase';

export function useMarketingConfig() {
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Guard against non-browser environments
        if (typeof window === 'undefined') {
            setLoading(false);
            return;
        }

        // Ensure firestore is available
        if (!firestore) {
            console.warn("Firestore not initialized for useMarketingConfig");
            setLoading(false);
            return;
        }

        const docRef = doc(firestore, 'marketing_config', 'global');

        // Use onSnapshot for real-time updates without page refresh
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setConfig(docSnap.data());
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching marketing config:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    return { config, loading };
}
