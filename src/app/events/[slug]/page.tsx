
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
        console.error('Error fetching event for SEO:', e);
    }
    return { event: null, isRedirect: false };
}

// serializeEvent moved to @/lib/events

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const resolvedParams = await params;
    const { event } = await getEvent(resolvedParams.slug);

    if (!event) {
        return {
            title: 'Event Not Found | Mov33',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];

    // Generate dynamic OG image URL
    let eventDate = new Date();
    if (event.date) {
        if (typeof event.date === 'string') {
            eventDate = new Date(event.date);
        } else if (typeof event.date.toDate === 'function') {
            eventDate = event.date.toDate();
        } else if (event.date.seconds) {
            eventDate = new Date(event.date.seconds * 1000);
        }
    }

    const formattedDate = eventDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    const ogImageUrl = new URL('/api/og', process.env.NEXT_PUBLIC_BASE_URL || 'https://mov33.com');
    ogImageUrl.searchParams.set('title', event.title);
    ogImageUrl.searchParams.set('date', formattedDate);
    ogImageUrl.searchParams.set('location', `${event.venue}, ${event.location}`);
    ogImageUrl.searchParams.set('price', event.price?.toString() || 'FREE');
    ogImageUrl.searchParams.set('ticketsSold', event.ticketsSold?.toString() || '0');
    if (event.imageUrl) ogImageUrl.searchParams.set('image', event.imageUrl);

    const dynamicOgImage = ogImageUrl.toString();
    const ogImages = [dynamicOgImage, ...previousImages];

    return {
        title: `${event.title} | Mov33 Tickets`,
        description: event.description?.slice(0, 160) || 'Secure your tickets for this exclusive event on Mov33.',
        openGraph: {
            title: event.title,
            description: event.description?.slice(0, 160),
            images: ogImages,
            type: 'website',
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
    const resolvedParams = await params;
    const { event, isRedirect } = await getEvent(resolvedParams.slug);

    if (isRedirect && event?.slug) {
        redirect(`/events/${event.slug}`);
    }

    const jsonLd = event ? generateEventJsonLd(event) : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <EventDetailsClient eventId={event?.id || resolvedParams.slug} initialEvent={event} />
        </>
    );
}
