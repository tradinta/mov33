
import { Metadata, ResolvingMetadata } from 'next';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Tour } from '@/lib/types';
import TourDetailsClient from '@/components/tours/tour-details-client';
import { generateTourJsonLd, siteConfig } from '@/lib/seo';

type Props = {
    params: { id: string };
    searchParams: { [key: string]: string | string[] | undefined };
};

async function getTour(id: string): Promise<Tour | null> {
    try {
        const docRef = doc(firestore, 'tours', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Tour;
        }
    } catch (e) {
        console.error('Error fetching tour for SEO:', e);
    }
    return null;
}

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const tour = await getTour(params.id);

    if (!tour) {
        return {
            title: 'Tour Not Found | Mov33',
        };
    }

    const previousImages = (await parent).openGraph?.images || [];
    const ogImages = tour.imageUrl ? [tour.imageUrl, ...previousImages] : previousImages;

    return {
        title: `${tour.title} | Mov33 Expeditions`,
        description: tour.description?.slice(0, 160) || 'Book your dream safari or expedition with Mov33.',
        openGraph: {
            title: tour.title,
            description: tour.description?.slice(0, 160),
            images: ogImages,
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: tour.title,
            description: tour.description?.slice(0, 160),
            images: ogImages,
        },
    };
}

export default async function TourPage({ params }: Props) {
    const tour = await getTour(params.id);

    const jsonLd = tour ? generateTourJsonLd(tour) : null;

    return (
        <>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <TourDetailsClient tourId={params.id} />
        </>
    );
}
