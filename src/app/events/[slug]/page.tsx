
import { Metadata, ResolvingMetadata } from 'next';
import { redirect } from 'next/navigation';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Event } from '@/lib/types';
import EventDetailsClient from '@/components/events/event-details-client';
import { generateEventJsonLd } from '@/lib/seo';

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
            return { event: { id: docSnap.id, ...docSnap.data() } as Event, isRedirect: false };
        }

        // 2. Try finding by ID
        const docRef = doc(firestore, 'events', slugOrId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { event: { id: docSnap.id, ...docSnap.data() } as Event, isRedirect: true };
        }
    } catch (e) {
        console.error('Error fetching event for SEO:', e);
    }
    return { event: null, isRedirect: false };
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const { event } = await getEvent(params.slug);

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
    const { event, isRedirect } = await getEvent(params.slug);

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
            <EventDetailsClient eventId={event?.id || params.slug} />
        </>
    );
}
