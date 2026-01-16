'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { EventCard, EventCardSkeleton } from "./event-card";
import { Event } from "@/lib/types";
import { EventFilters } from './event-filter';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { FilterX, Sparkles } from 'lucide-react';

interface EventGridProps {
  filters: EventFilters;
}

export function EventGrid({ filters }: EventGridProps) {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // We start with a base query for approved events
        let q = query(
          collection(firestore, 'events'),
          where('moderationStatus', '==', 'approved'),
          orderBy('date', 'asc')
        );

        // If a category is selected, we filter by it in Firestore if possible
        // But for multiple dynamic filters, client-side is often more flexible 
        // unless we have thousands of events.
        if (filters.category && filters.category !== "all") {
          q = query(q, where('tags', 'array-contains', filters.category));
        }

        const snap = await getDocs(q);
        const fetchedEvents = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, [filters.category]); // Re-fetch only when category change, others can be client-side for speed

  // Client-side filtering for high interactivity
  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      // Date Filter
      if (filters.date) {
        const eDate = event.date?.toDate ? event.date.toDate() : new Date();
        const fDate = filters.date;
        if (eDate.toDateString() !== fDate.toDateString()) return false;
      }

      // County Filter
      if (filters.county && filters.county !== "all") {
        if ((event.location || '').toLowerCase().indexOf(filters.county.toLowerCase()) === -1) return false;
      }

      // Price Filter
      if ((event.price || 0) < filters.priceRange[0] || (event.price || 0) > filters.priceRange[1]) return false;

      // Search Query Filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase();
        return (
          (event.title || '').toLowerCase().includes(query) ||
          (event.description || '').toLowerCase().includes(query) ||
          (event.location || '').toLowerCase().includes(query)
        );
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === "price_asc") return a.price - b.price;
      if (filters.sortBy === "price_desc") return b.price - a.price;
      if (filters.sortBy === "date_asc") {
        const da = a.date?.toDate ? a.date.toDate().getTime() : 0;
        const db = b.date?.toDate ? b.date.toDate().getTime() : 0;
        return da - db;
      }
      return 0; // Default (Recommended/Date)
    });
  }, [events, filters]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, i) => (
          <EventCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (filteredEvents.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-32 space-y-6 text-center"
      >
        <div className="relative">
          <FilterX className="h-16 w-16 text-muted-foreground/20" />
          <div className="absolute -top-1 -right-1">
            <Sparkles className="h-6 w-6 text-gold animate-pulse" />
          </div>
        </div>
        <div className="space-y-2">
          <h3 className="font-headline text-2xl font-black uppercase italic tracking-tighter text-white">No matches found</h3>
          <p className="text-muted-foreground font-poppins text-sm max-w-xs">
            We couldn't find any events matching your current filters. Try expanding your search.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="rounded-xl border-white/10 hover:bg-white/5 font-black uppercase text-[10px] tracking-widest px-8"
        >
          Clear All Search
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <AnimatePresence mode="popLayout">
        {filteredEvents.map((event, index) => (
          <motion.div
            key={event.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <EventCard event={event} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
