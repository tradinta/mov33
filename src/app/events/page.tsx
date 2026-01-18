import { EventsClient } from '@/components/events/events-client';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Mov33 - Discover the Best Vibes in Kenya',
  description: 'Explore upcoming concerts, tech summits, warehouse parties, and exclusive events across Kenya. Find your next experience with Mov33.',
  openGraph: {
    title: 'Events | Mov33',
    description: 'Find your next vibe. From underground parties to premium summits.',
    images: ['/og-events.jpg'], // Update with actual image if available
  },
};

export default function EventsPage() {
  return (
    <div className="bg-background dark:bg-obsidian min-h-screen transition-colors duration-300">
      <EventsClient />
    </div>
  );
}
