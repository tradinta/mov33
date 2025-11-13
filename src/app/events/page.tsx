
'use client';
import { useState } from 'react';
import { EventFilter } from "@/components/events/event-filter";
import { EventGrid } from "@/components/events/event-grid";
import { HeroSection } from "@/components/events/hero-section";
import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";


// export const metadata: Metadata = {
//   title: 'Events in Kenya - Concerts, Festivals & More | Mov33',
//   description: 'Discover and book tickets for the best events in Kenya. From vibrant concerts in Nairobi to cultural festivals in Lamu, find your next unforgettable experience with Mov33.',
// };

export default function EventsPage() {
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  
  return (
    <div className="bg-background">
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
           {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <EventFilter />
            </div>
          </aside>
          
           {/* Main Content Column */}
          <main className="lg:col-span-3">
             {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex justify-between items-center">
                <h2 className="font-headline text-2xl font-bold">Upcoming Events</h2>
                <Dialog open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Event Filters</DialogTitle>
                        </DialogHeader>
                        <EventFilter />
                        <DialogFooter>
                          <Button onClick={() => setFilterSheetOpen(false)} className="w-full">Apply Filters</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-sm">
                <TabsTrigger value="upcoming">Upcoming Events</TabsTrigger>
                <TabsTrigger value="past">Past & Archived</TabsTrigger>
              </TabsList>
              <TabsContent value="upcoming">
                <EventGrid />
              </TabsContent>
              <TabsContent value="past">
                {/* For now, this shows the same as upcoming. In a real app, this would be a separate data fetch. */}
                <EventGrid /> 
                <div className="text-center mt-8">
                  <p className="text-muted-foreground">Showing a placeholder for past events.</p>
                </div>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </div>
  );
}
