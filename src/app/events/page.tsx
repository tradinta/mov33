
'use client';
import { useState } from 'react';
import { EventFilter } from "@/components/events/event-filter";
import { EventGrid } from "@/components/events/event-grid";
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
import { FeaturedEventsCarousel } from '@/components/events/featured-events-carousel';
import { EventSearch } from '@/components/events/event-search';


export default function EventsPage() {
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  
  return (
    <div className="bg-background">
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
             <FeaturedEventsCarousel />

             {/* Mobile Filter Button */}
            <div className="lg:hidden my-6 flex justify-between items-center">
                <h2 className="font-headline text-2xl font-bold">All Events</h2>
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

            <Tabs defaultValue="all" className="w-full mt-12">
              <TabsList className="grid w-full grid-cols-4 max-w-lg">
                <TabsTrigger value="all">All Events</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="this-weekend">This Weekend</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              <div className="my-6">
                <EventSearch />
              </div>
              <TabsContent value="all">
                <EventGrid />
              </TabsContent>
               <TabsContent value="today">
                <EventGrid />
              </TabsContent>
               <TabsContent value="this-weekend">
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
