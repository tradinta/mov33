
'use client';
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { EventFilter, EventFilters } from "@/components/events/event-filter";
import { EventGrid } from "@/components/events/event-grid";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, MapPin, Calendar as CalendarIcon, FilterX } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { FeaturedEventsCarousel } from '@/components/events/featured-events-carousel';
import { EventSearch } from '@/components/events/event-search';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { WelcomePopup } from '@/components/onboarding/welcome-popup';

const slogans = [
  { title: 'Discover', highlight: 'Events' },
  { title: 'Experience', highlight: 'More' },
  { title: 'Find Your', highlight: 'Vibe' },
];

export default function EventsPage() {
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [activeFilters, setActiveFilters] = useState<EventFilters>({
    date: undefined,
    category: "",
    county: "",
    priceRange: [0, 100000],
    sortBy: "recommended",
    searchQuery: ""
  });

  // Auto-rotate slogans
  useEffect(() => {
    const interval = setInterval(() => {
      setSloganIndex((prev) => (prev + 1) % slogans.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleFilterChange = (filters: EventFilters) => {
    setActiveFilters(filters);
  };

  const hasActiveFilters = activeFilters.category || activeFilters.county || activeFilters.date;

  return (
    <div className="bg-background dark:bg-obsidian min-h-screen transition-colors duration-300">
      <WelcomePopup />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header Section with Rotating Slogans */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-1 w-12 bg-gold rounded-full" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gold/60">Experience More</span>
            </div>
            <div className="h-[80px] md:h-[100px] overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.h1
                  key={sloganIndex}
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                  className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic text-foreground dark:text-white leading-none"
                >
                  {slogans[sloganIndex].title} <span className="text-gold">{slogans[sloganIndex].highlight}</span>
                </motion.h1>
              </AnimatePresence>
            </div>
            <p className="text-muted-foreground font-poppins max-w-lg text-sm md:text-base">
              From underground warehouse parties to premium tech summits. Your journey starts here.
            </p>
          </div>

          <div className="w-full md:w-96">
            <EventSearch onSearch={(q) => setActiveFilters(prev => ({ ...prev, searchQuery: q }))} />
          </div>
        </motion.div>


        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <EventFilter onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content Column */}
          <main className="lg:col-span-3 space-y-12">
            <FeaturedEventsCarousel />

            {/* Filter Summary / Active Tags */}
            <div className="flex flex-wrap items-center gap-3">
              <AnimatePresence>
                {activeFilters.category && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-black uppercase text-gold"
                  >
                    #{activeFilters.category}
                  </motion.div>
                )}
                {activeFilters.county && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white flex items-center gap-2"
                  >
                    <MapPin className="h-3 w-3 text-gold" />
                    {activeFilters.county}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex justify-between items-center gap-4">
              <h2 className="font-headline text-3xl font-black uppercase italic tracking-tighter">Live Feed</h2>
              <Dialog open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "h-12 px-6 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest",
                      hasActiveFilters && "border-gold text-gold"
                    )}
                  >
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Refine
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-obsidian border-white/5 p-0 overflow-hidden">
                  <div className="p-6 overflow-y-auto max-h-[80vh]">
                    <EventFilter onFilterChange={handleFilterChange} />
                  </div>
                  <DialogFooter className="p-4 bg-white/[0.02] border-t border-white/5">
                    <Button onClick={() => setFilterSheetOpen(false)} className="w-full bg-gold text-obsidian font-black uppercase h-14 rounded-2xl">Show Results</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-14 rounded-full">
                  <TabsTrigger value="all" className="rounded-full px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian">All Events</TabsTrigger>
                  <TabsTrigger value="today" className="rounded-full px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian">Today</TabsTrigger>
                  <TabsTrigger value="this-weekend" className="rounded-full px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian">This Weekend</TabsTrigger>
                  <TabsTrigger value="past" className="rounded-full px-6 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-zinc-700 data-[state=active]:text-white">Past Events</TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4">
                  <Link href="/archive" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-white transition-colors">
                    View Archive
                  </Link>
                </div>
              </div>

              <TabsContent value="all" className="mt-0 focus-visible:outline-none">
                <EventGrid filters={activeFilters} />
              </TabsContent>
              <TabsContent value="today" className="mt-0 focus-visible:outline-none">
                <EventGrid filters={{ ...activeFilters, date: new Date() }} />
              </TabsContent>
              <TabsContent value="this-weekend" className="mt-0 focus-visible:outline-none">
                <EventGrid filters={activeFilters} />
              </TabsContent>
              <TabsContent value="past" className="mt-0 focus-visible:outline-none">
                <EventGrid filters={{ ...activeFilters, showPast: true }} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
