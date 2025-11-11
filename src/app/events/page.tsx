import { EventFilter } from "@/components/events/event-filter";
import { EventGrid } from "@/components/events/event-grid";
import { HeroSection } from "@/components/events/hero-section";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events in Kenya - Concerts, Festivals & More | Mov33',
  description: 'Discover and book tickets for the best events in Kenya. From vibrant concerts in Nairobi to cultural festivals in Lamu, find your next unforgettable experience with Mov33.',
};

export default function EventsPage() {
  return (
    <div className="bg-background">
      <HeroSection />
      <EventFilter />
      <div className="px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <EventGrid />
      </div>
    </div>
  );
}
