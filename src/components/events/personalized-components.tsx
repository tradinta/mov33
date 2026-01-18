'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, limit, documentId } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Event } from '@/lib/types';
import { EventCard } from './event-card';
import { History, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMarketingConfig } from '@/hooks/use-marketing-config';

export function RecentlyViewedList() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRecent = async () => {
            const ids = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
            if (ids.length === 0) {
                setLoading(false);
                return;
            }

            try {
                const q = query(
                    collection(firestore, 'events'),
                    where(documentId(), 'in', ids),
                    limit(5)
                );
                const snap = await getDocs(q);
                const fetched = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
                // Sort to match the order in ids array
                const sorted = ids.map((id: string) => fetched.find(e => e.id === id)).filter(Boolean);
                setEvents(sorted);
            } catch (error) {
                console.error("Error fetching recent events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRecent();
    }, []);

    if (loading || events.length === 0) return null;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <History className="h-4 w-4 text-gold" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white/80">Continue Exploring</h3>
            </div>
            <div className="space-y-4">
                {events.map((event, idx) => (
                    <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <EventCard event={event} />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export function WelcomeBackBanner() {
    const { config, loading } = useMarketingConfig();
    const [name, setName] = useState<string | null>(null);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        const profile = JSON.parse(localStorage.getItem('user-profile') || '{}');
        if (profile.displayName) {
            setName(profile.displayName.split(' ')[0]);
        }

        const dismissed = localStorage.getItem('welcome_banner_dismissed');
        if (dismissed === 'true') {
            setIsDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        setIsDismissed(true);
        localStorage.setItem('welcome_banner_dismissed', 'true');
    };

    if (loading || !config?.welcomeBanner?.enabled || !name || isDismissed) return null;

    return (
        <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-gold/10 border-b border-gold/20 overflow-hidden"
        >
            <div className="container mx-auto px-8 py-4 flex items-center justify-between font-poppins">
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center text-gold">
                        <Sparkles className="h-5 w-5" />
                    </div>
                    <div>
                        <p className="text-sm font-black uppercase italic tracking-tight text-white">Welcome back, {name}!</p>
                        <p className="text-[10px] text-gold/60 font-medium uppercase tracking-widest leading-none mt-1">
                            {config?.welcomeBanner?.message || "We've curated some new vibes for you."}
                        </p>
                    </div>
                </div>
                <button
                    onClick={handleDismiss}
                    className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                >
                    Dismiss
                </button>
            </div>
        </motion.div>
    );
}
