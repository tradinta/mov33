"use client";

import React, { useEffect, useState } from "react";
import { collection, query, where, limit, getDocs, orderBy } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Event } from "@/lib/types";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Loader2, Award, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export function TrendingEvents() {
    const [events, setEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrending = async () => {
            try {
                // Fetch events marked as featured or trending, ordered by date
                const q = query(
                    collection(firestore, "events"),
                    where("status", "==", "published"),
                    orderBy("date", "asc"),
                    limit(3)
                );
                const querySnapshot = await getDocs(q);
                const fetchedEvents = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Event[];
                setEvents(fetchedEvents);
            } catch (error) {
                console.error("Error fetching trending events:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTrending();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Curating Trends...</p>
            </div>
        );
    }

    if (events.length === 0) return null;

    const mainEvent = events[0];
    const sideEvents = events.slice(1);

    return (
        <section className="space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <Zap className="h-4 w-4 text-gold fill-gold" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Live Pulse</span>
                    </div>
                    <h2 className="font-headline text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
                        Now <span className="text-gold">Trending</span>
                    </h2>
                </div>
                <p className="text-white/40 font-poppins max-w-xs text-sm">
                    Explore the most anticipated experiences happening across the city this week.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                {/* Main Event */}
                <div className="lg:col-span-8">
                    <Card className="group overflow-hidden rounded-[3rem] bg-white/5 border-white/5 shadow-2xl transition-all duration-500 hover:border-gold/30 relative h-[500px] md:h-[600px]">
                        <CardContent className="p-0 h-full">
                            <Link href={`/events/${mainEvent.id}`} className="block h-full">
                                <div className="relative h-full w-full overflow-hidden">
                                    <Image
                                        src={mainEvent.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                        alt={mainEvent.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                        priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-10 md:p-14 space-y-6 text-white w-full">
                                    <div className="flex flex-wrap items-center gap-4">
                                        <div className="px-4 py-1.5 bg-gold text-obsidian rounded-full font-black text-[10px] uppercase tracking-widest italic">
                                            {format(mainEvent.date.toDate(), 'MMM d')}
                                        </div>
                                        <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-tight">
                                            <MapPin className="h-4 w-4 text-gold" />
                                            {mainEvent.venue}
                                        </div>
                                    </div>
                                    <h3 className="font-headline text-4xl md:text-6xl font-black text-white group-hover:text-gold transition-colors leading-[0.9] italic tracking-tighter uppercase">
                                        {mainEvent.title}
                                    </h3>
                                    <p className="text-white/60 font-poppins line-clamp-2 max-w-xl text-sm leading-relaxed">
                                        {mainEvent.description}
                                    </p>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Side Events */}
                <div className="lg:col-span-4 grid grid-cols-1 gap-8">
                    {sideEvents.length > 0 ? sideEvents.map(event => (
                        <Card key={event.id} className="group overflow-hidden rounded-[2.5rem] bg-white/5 border-white/5 transition-all duration-500 hover:border-gold/30 relative h-full">
                            <CardContent className="p-0 h-full">
                                <Link href={`/events/${event.id}`} className="block h-full">
                                    <div className="flex flex-col h-full">
                                        <div className="relative aspect-[16/10] w-full overflow-hidden">
                                            <Image
                                                src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                                alt={event.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/80 to-transparent" />
                                            <div className="absolute bottom-4 left-6">
                                                <div className="text-gold font-black italic tracking-tighter text-lg uppercase">
                                                    {format(event.date.toDate(), 'MMM d')}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-8 space-y-3 flex-1 flex flex-col justify-center">
                                            <h3 className="font-headline text-2xl font-black text-white group-hover:text-gold transition-colors leading-tight italic tracking-tighter uppercase">
                                                {event.title}
                                            </h3>
                                            <div className="flex items-center text-[10px] font-black uppercase tracking-widest text-white/30 gap-1.5">
                                                <MapPin className="h-3 w-3 text-gold/50" />
                                                <span>{event.location}</span>
                                            </div>
                                            <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white/30">Discovery Price</span>
                                                <span className="text-lg font-black italic tracking-tighter text-gold">
                                                    KES {event.price.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </CardContent>
                        </Card>
                    )) : (
                        <div className="h-full flex flex-col items-center justify-center border border-dashed border-white/10 rounded-[2.5rem] p-8 text-center bg-white/[0.02]">
                            <Award className="h-10 w-10 text-white/10 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest text-white/20 italic">More Discoveries Incoming</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
