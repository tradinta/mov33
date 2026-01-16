
import { Metadata, ResolvingMetadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Event } from '@/lib/types';
import EventDetailsClient from '@/components/events/event-details-client';
import { generateEventJsonLd, siteConfig } from '@/lib/seo';

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// Next.js convention: fetch data here for metadata
// Since we ideally want to share data with the client component to avoid double fetch, 
// we normally fetch here and pass it down. 
// However, the Client Component has its own complex state (Cart, Auth, etc) and currently fetches on mount.
// To save refactoring time, we will duplicate the fetch here PURELY for SEO (Metadata + JSON-LD).
// Firestore SDK caches well, so distinct requests might not be too expensive if near each other, 
// but since one is server-side (Node) and one is client-side, they are distinct.
// For MVP SEO, this is acceptable.

async function getEvent(id: string): Promise<Event | null> {
  try {
    const docRef = doc(firestore, 'events', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Event;
    }
  } catch (e) {
    console.error('Error fetching event for SEO:', e);
  }
  return null;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const event = await getEvent(params.id);

  if (!event) {
    return {
      title: 'Event Not Found | Mov33',
    };
  }

  const previousImages = (await parent).openGraph?.images || [];
  const ogImages = event.imageUrl ? [event.imageUrl, ...previousImages] : previousImages;

  return {
    title: `${event.title} | Mov33 Tickets`,
    description: event.description?.slice(0, 160) || 'Secure your tickets for this exclusive event on Mov33.',
    openGraph: {
      title: event.title,
      description: event.description?.slice(0, 160),
      // url: `https://mov33.co.ke/events/${event.id}`, // Optional, canonical handles it usually
      images: ogImages,
      type: 'website', // or 'video.other' or custom 'event' object if supported
    },
    twitter: {
      card: 'summary_large_image',
      title: event.title,
      description: event.description?.slice(0, 160),
      images: ogImages,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const event = await getEvent(params.id);

  // JSON-LD injection for Google Rich Results
  const jsonLd = event ? generateEventJsonLd(event) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <EventDetailsClient eventId={params.id} />
    </>
  );
}
