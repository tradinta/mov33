'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Tour } from '@/lib/types';
import Link from 'next/link';
import { TourDetailHero } from '@/components/tours/tour-detail-hero';
import { TourBookingCard } from '@/components/tours/tour-booking-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Check, Star, X, Loader2, ChevronRight, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventViewTracker } from '@/components/analytics/event-view-tracker';

type TourDetailsClientProps = {
    tourId: string;
};

export default function TourDetailsClient({ tourId }: TourDetailsClientProps) {
    const [tour, setTour] = useState<Tour | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchTour = async () => {
            try {
                const docRef = doc(firestore, 'tours', tourId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setTour({ id: docSnap.id, ...docSnap.data() } as Tour);
                } else {
                    setTour(null);
                }
            } catch (error) {
                console.error("Error fetching tour:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTour();
    }, [tourId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4 bg-obsidian text-white">
                <Loader2 className="h-10 w-10 animate-spin text-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gold animate-pulse">Loading Expedition Details...</p>
            </div>
        );
    }

    if (!tour) {
        notFound();
    }

    return (
        <div className="bg-obsidian min-h-screen text-white pt-20">
            <EventViewTracker tourId={tour.id} organizerId={tour.organizerId} />
            <TourDetailHero tour={tour} />

            {/* Main Grid Layout */}
            <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-16 px-4 md:px-12 py-16">
                {/* Left Column: Tour Info */}
                <main className="space-y-20">
                    <section id="about" className="space-y-6">
                        <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                            <div className="h-1 w-6 bg-gold rounded-full" />
                            About the Expedition
                        </h2>
                        <div className="prose prose-invert max-w-none text-white/60 font-poppins leading-relaxed text-lg">
                            <p>{tour.description}</p>
                        </div>
                    </section>

                    <section id="highlights" className="space-y-10">
                        <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                            <div className="h-1 w-6 bg-gold rounded-full" />
                            Expedition Highlights
                        </h2>
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                            {tour.highlights?.map((highlight, index) => (
                                <li key={index} className="flex items-start gap-5 group">
                                    <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-2xl bg-gold/10 text-gold group-hover:bg-gold group-hover:text-obsidian transition-all duration-300">
                                        <Star className="h-5 w-5 fill-current" />
                                    </div>
                                    <div>
                                        <span className="text-white/80 font-bold text-lg italic tracking-tight group-hover:text-gold transition-colors">{highlight}</span>
                                        <p className="text-xs text-white/40 font-poppins mt-1">Key feature of this discovery</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </section>

                    <section id="inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-white/5 p-10 rounded-[3rem] border border-white/5 relative overflow-hidden">
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-widest text-kenyan-green flex items-center gap-3 italic">
                                <Check className="h-6 w-6" /> What's Included
                            </h3>
                            <ul className="space-y-4">
                                {tour.includes?.map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white/60 font-poppins">
                                        <div className="h-2 w-2 rounded-full bg-kenyan-green/40" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-6 relative z-10">
                            <h3 className="text-xl font-black uppercase tracking-widest text-red-400 flex items-center gap-3 italic">
                                <X className="h-6 w-6" /> What's Not Included
                            </h3>
                            <ul className="space-y-4">
                                {tour.notIncludes?.map((item, i) => (
                                    <li key={i} className="flex items-center gap-4 text-white/40 font-poppins">
                                        <div className="h-2 w-2 rounded-full bg-red-400/20" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="absolute top-0 right-0 h-40 w-40 bg-kenyan-green/5 blur-[80px] rounded-full" />
                    </section>

                    <section id="organizer" className="space-y-8">
                        <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                            <div className="h-1 w-6 bg-gold rounded-full" />
                            The Expedition Curator
                        </h2>
                        <Link href={`/organizers/${tour.organizerId}`} className="block group">
                            <Card className="bg-white/5 border border-white/5 p-10 rounded-[3rem] transition-all group-hover:border-gold/30">
                                <div className="flex items-center gap-8">
                                    <Avatar className="h-24 w-24 border-2 border-white/10 group-hover:border-gold/50 transition-all duration-500">
                                        <AvatarImage src={tour.organizerLogoUrl} alt={tour.organizerName} />
                                        <AvatarFallback className="bg-white/5 font-black text-gold text-2xl">{tour.organizerName?.[0] || 'O'}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <h3 className="font-black text-3xl uppercase italic tracking-tighter text-white group-hover:text-gold transition-colors">{tour.organizerName || 'Official Partner'}</h3>
                                        <p className="text-white/40 font-poppins mt-2">Certified Mov33 Expedition Curator and Local Expert.</p>
                                        <div className="mt-6 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold opacity-60 group-hover:opacity-100 italic">
                                            View Operator Profile <ChevronRight className="h-3 w-3" />
                                        </div>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    </section>

                </main>

                {/* Right Column: Booking */}
                <aside>
                    <div className="sticky top-32 space-y-8">
                        <TourBookingCard tour={tour} />

                        <Card className="bg-gold/5 border border-gold/10 p-8 rounded-[2.5rem]">
                            <h4 className="font-black uppercase italic tracking-tighter text-gold mb-3">Instant Confirmation</h4>
                            <p className="text-white/40 text-xs font-poppins leading-relaxed">Book with confidence. Your booking is instantly processed and secured via real-time synchronization.</p>
                        </Card>
                    </div>
                </aside>
            </div>
        </div>
    );
}
