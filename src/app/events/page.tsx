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
    <>
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EventFilter />
        <EventGrid />
      </div>
    </>
  );
}
