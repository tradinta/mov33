'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { TourCard, TourCardSkeleton } from "./tour-card";
import { Tour } from "@/lib/types";
import { TourFilters } from './tour-filter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Compass, Sparkles, Map } from 'lucide-react';

interface ToursGridProps {
    filters: TourFilters;
}

export function ToursGrid({ filters }: ToursGridProps) {
    const [tours, setTours] = useState<Tour[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTours = async () => {
            setLoading(true);
            try {
                let q = query(
                    collection(firestore, 'tours'),
                    where('moderationStatus', '==', 'approved'),
                    orderBy('createdAt', 'desc')
                );

                // Targeted fetch if destination is set
                if (filters.destination && filters.destination !== "all") {
                    q = query(q, where('destination', '==', filters.destination));
                }

                const snap = await getDocs(q);
                const fetchedTours = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Tour));
                setTours(fetchedTours);
            } catch (error) {
                console.error("Error fetching tours:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, [filters.destination]);

    const filteredTours = useMemo(() => {
        return tours.filter(tour => {
            // Price Range
            if (tour.price < filters.priceRange[0] || tour.price > filters.priceRange[1]) return false;

            // Duration Filter
            if (filters.duration !== "any") {
                if (filters.duration === "7+" && !tour.duration.includes('Week') && !tour.duration.includes('7')) return false;
                if (!tour.duration.toLowerCase().includes(filters.duration.toLowerCase())) return false;
            }

            // Private Only
            if (filters.privateOnly && !tour.privateBooking) return false;

            // Search Query Filter
            if (filters.searchQuery) {
                const query = filters.searchQuery.toLowerCase();
                return (
                    tour.name.toLowerCase().includes(query) ||
                    tour.description.toLowerCase().includes(query) ||
                    tour.destination.toLowerCase().includes(query)
                );
            }

            return true;
        });
    }, [tours, filters]);

    if (loading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {Array.from({ length: 8 }).map((_, i) => (
                    <TourCardSkeleton key={i} />
                ))}
            </div>
        );
    }

    if (filteredTours.length === 0) {
        return (
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center py-32 space-y-6 text-center"
            >
                <div className="relative">
                    <Compass className="h-16 w-16 text-muted-foreground/20" />
                    <div className="absolute -top-1 -right-1">
                        <Map className="h-6 w-6 text-gold animate-pulse" />
                    </div>
                </div>
                <div className="space-y-2">
                    <h3 className="font-headline text-2xl font-black uppercase italic tracking-tighter text-white">No Expeditions Found</h3>
                    <p className="text-muted-foreground font-poppins text-sm max-w-xs">
                        We couldn't find any tours matching your current preferences. Try adjusting your filters.
                    </p>
                </div>
                <Button
                    variant="outline"
                    onClick={() => window.location.reload()}
                    className="rounded-xl border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest px-8 h-12"
                >
                    Clear Preferences
                </Button>
            </motion.div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence mode="popLayout">
                {filteredTours.map((tour, index) => (
                    <motion.div
                        key={tour.id}
                        layout
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                        <TourCard tour={tour} />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
