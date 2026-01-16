'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { EventCard, EventCardSkeleton } from '@/components/events/event-card';
import { Archive, CalendarX } from 'lucide-react';
import { Event } from '@/lib/types';

export default function ArchivePage() {
    const [pastEvents, setPastEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPastEvents = async () => {
            try {
                const now = Timestamp.now();
                const q = query(
                    collection(firestore, 'events'),
                    where('date', '<', now),
                    orderBy('date', 'desc')
                );
                const snap = await getDocs(q);
                const events = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
                setPastEvents(events);
            } catch (error) {
                console.error("Error fetching past events:", error);
                // Fallback: fetch all events and filter client-side
                try {
                    const allSnap = await getDocs(collection(firestore, 'events'));
                    const allEvents = allSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
                    const filtered = allEvents.filter(e => {
                        const eventDate = e.date?.toDate ? e.date.toDate() : new Date(e.date);
                        return eventDate < new Date();
                    });
                    setPastEvents(filtered);
                } catch (e) {
                    console.error("Fallback also failed:", e);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchPastEvents();
    }, []);

    return (
        <div className="bg-background dark:bg-obsidian min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-b from-obsidian to-background border-b border-white/5">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
                    <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Archive className="h-10 w-10 text-gold" />
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black uppercase italic tracking-tighter text-white">
                        Event <span className="text-gold">Archive</span>
                    </h1>
                    <p className="mt-4 text-lg text-white/40 max-w-2xl mx-auto font-poppins">
                        Relive the unforgettable moments we've shared. Browse past events and discover what you missed.
                    </p>
                </div>
            </section>

            {/* Events Grid */}
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {[...Array(8)].map((_, i) => <EventCardSkeleton key={i} />)}
                    </div>
                ) : pastEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {pastEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="h-20 w-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                            <CalendarX className="h-10 w-10 text-white/20" />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic text-white mb-2">No Past Events</h3>
                        <p className="text-white/40 max-w-md">
                            There are no events in the archive yet. Check back after some events have concluded.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
