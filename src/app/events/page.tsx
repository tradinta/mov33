import { EventFilter } from "@/components/events/event-filter";
import { EventGrid } from "@/components/events/event-grid";
import { HeroSection } from "@/components/events/hero-section";
import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: 'Events in Kenya - Concerts, Festivals & More | Mov33',
  description: 'Discover and book tickets for the best events in Kenya. From vibrant concerts in Nairobi to cultural festivals in Lamu, find your next unforgettable experience with Mov33.',
};

export default function EventsPage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <EventFilter />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
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
      </div>
    </div>
  );
}
