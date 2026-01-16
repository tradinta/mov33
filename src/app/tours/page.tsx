'use client';

import { useState } from 'react';
import { ToursHero } from '@/components/tours/tours-hero';
import { ToursGrid } from '@/components/tours/tours-grid';
import { TourFilter, TourFilters } from '@/components/tours/tour-filter';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, MapPin, Compass, Waves } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export default function ToursPage() {
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [activeFilters, setActiveFilters] = useState<TourFilters>({
    destination: "",
    duration: "any",
    priceRange: [0, 300000],
    privateOnly: false,
    searchQuery: ""
  });

  const handleFilterChange = (filters: TourFilters) => {
    setActiveFilters(filters);
  };

  return (
    <div className="bg-background dark:bg-obsidian min-h-screen transition-colors duration-300">
      <ToursHero onSearch={(q) => setActiveFilters(prev => ({ ...prev, searchQuery: q }))} />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-12">
          {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <TourFilter onFilterChange={handleFilterChange} />
          </aside>

          {/* Main Content Column */}
          <main className="lg:col-span-3 space-y-12">

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="h-1 w-8 bg-gold rounded-full" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-gold/60">Curated Expeditions</span>
                </div>
                <h2 className="font-headline text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground dark:text-white">
                  Available <span className="text-gold">Tours</span>
                </h2>
              </div>

              <div className="flex items-center gap-3">
                <AnimatePresence>
                  {activeFilters.destination && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-4 py-2 bg-gold/10 border border-gold/20 rounded-full text-[10px] font-black uppercase text-gold flex items-center gap-2"
                    >
                      <MapPin className="h-3 w-3" />
                      {activeFilters.destination}
                    </motion.div>
                  )}
                  {activeFilters.duration !== "any" && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase text-white"
                    >
                      {activeFilters.duration} Days
                    </motion.div>
                  )}
                </AnimatePresence>

                <Dialog open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="lg:hidden h-12 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest">
                      <SlidersHorizontal className="mr-2 h-4 w-4" />
                      Refine
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-obsidian border-white/5 p-0">
                    <div className="p-6 overflow-y-auto max-h-[80vh]">
                      <TourFilter onFilterChange={handleFilterChange} />
                    </div>
                    <DialogFooter className="p-4 bg-white/[0.02] border-t border-white/5">
                      <Button onClick={() => setFilterSheetOpen(false)} className="w-full bg-gold text-obsidian font-black uppercase h-14 rounded-2xl">Confirm</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <TabsList className="bg-white/5 border border-white/5 p-1 h-14 rounded-2xl">
                  <TabsTrigger value="all" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian">All Journeys</TabsTrigger>
                  <TabsTrigger value="savanna" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian flex items-center gap-2">
                    <Compass className="h-4 w-4" /> Savanna
                  </TabsTrigger>
                  <TabsTrigger value="coastal" className="rounded-xl px-8 font-black uppercase text-[10px] tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian flex items-center gap-2">
                    <Waves className="h-4 w-4" /> Coastal
                  </TabsTrigger>
                </TabsList>

                <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                  Sorted by: <span className="text-white">Trending</span>
                </div>
              </div>

              <TabsContent value="all" className="mt-0 focus-visible:outline-none">
                <ToursGrid filters={activeFilters} />
              </TabsContent>
              <TabsContent value="savanna" className="mt-0 focus-visible:outline-none">
                <ToursGrid filters={activeFilters} />
              </TabsContent>
              <TabsContent value="coastal" className="mt-0 focus-visible:outline-none">
                <ToursGrid filters={activeFilters} />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
