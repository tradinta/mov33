
import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Event } from '@/lib/types';
import EventDetailsClient from '@/components/events/event-details-client';
import { generateEventJsonLd } from '@/lib/seo';
import { serializeEvent } from '@/lib/events';

type Props = {
    params: { slug: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

// Reusing getEvent logic is fine as we are fetching 'events' collection
async function getEvent(slugOrId: string): Promise<{ event: Event | null, isRedirect: boolean }> {
    try {
        // 1. Try finding by slug
        const eventsRef = collection(firestore, 'events');
        const q = query(eventsRef, where('slug', '==', slugOrId));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            const docSnap = querySnapshot.docs[0];
            const eventData = { id: docSnap.id, ...docSnap.data() } as any;
            return { event: serializeEvent(eventData), isRedirect: false };
        }

        // 2. Try finding by ID
        const docRef = doc(firestore, 'events', slugOrId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const eventData = { id: docSnap.id, ...docSnap.data() } as any;
            return { event: serializeEvent(eventData), isRedirect: true };
        }
    } catch (e) {
        console.error('Error fetching event for Archive:', e);
    }
    return { event: null, isRedirect: false };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const { event } = await getEvent(resolvedParams.slug);

    if (!event) {
        return {
            title: 'Archived Event Not Found | Mov33',
        };
    }

    return {
        title: `[Archived] ${event.title} | Mov33`,
        description: `View details and gallery for the past event: ${event.title}.`,
        openGraph: {
            title: `[Archived] ${event.title}`,
            description: event.description?.slice(0, 160),
            images: event.postEventGallery && event.postEventGallery.length > 0 ? [event.postEventGallery[0]] : (event.imageUrl ? [event.imageUrl] : []),
        },
    };
}

export default async function ArchivePage({ params }: Props) {
    const resolvedParams = await params;
    const { event, isRedirect } = await getEvent(resolvedParams.slug);

    if (isRedirect && event?.slug) {
        redirect(`/archives/${event.slug}`);
    }

    // You might want to 404 if the event is FUTURE? 
    // User said "past events are archived". Assuming we just display ANY event accessed via this route as archived.

    if (!event) {
        // Render Client Component with null event -> triggers "Not Found" UI
        return <EventDetailsClient eventId={resolvedParams.slug} initialEvent={null} isArchived={true} />;
    }

    return (
        <EventDetailsClient eventId={event.id} initialEvent={event} isArchived={true} />
    );
}
