import { Event, Tour } from "./types";

export const siteConfig = {
    name: "Mov33",
    description: "Kenya's Premium Ticketing & Experience Platform. Discover events, book tours, and buy exclusive merchandise.",
    url: "https://www.mov33.co.ke",
    ogImage: "https://www.mov33.co.ke/og-image.jpg",
    links: {
        twitter: "https://twitter.com/mov33ke",
        instagram: "https://instagram.com/mov33ke",
    },
};

export function generateEventJsonLd(event: Event) {
    return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: event.title,
        startDate: event.date?.toDate?.()?.toISOString() || new Date().toISOString(),
        endDate: event.date?.toDate?.()?.toISOString() || new Date().toISOString(), // Assuming 1 day default if no end date
        description: event.description,
        image: event.imageUrl ? [event.imageUrl] : [siteConfig.ogImage],
        location: {
            '@type': 'Place',
            name: event.venue || event.location,
            address: {
                '@type': 'PostalAddress',
                addressLocality: event.location, // Simplified
                addressCountry: 'KE',
            },
        },
        offers: {
            '@type': 'Offer',
            url: `${siteConfig.url}/events/${event.id}`,
            price: event.price,
            priceCurrency: 'KES',
            availability: 'https://schema.org/InStock',
        },
        organizer: {
            '@type': 'Organization',
            name: event.organizerId || 'Mov33',
            url: siteConfig.url,
        },
    };
}

export function generateTourJsonLd(tour: Tour) {
    return {
        '@context': 'https://schema.org',
        '@type': 'TouristTrip',
        name: tour.title,
        description: tour.description,
        image: tour.imageUrl ? [tour.imageUrl] : [siteConfig.ogImage],
        touristType: [tour.category],
        itinerary: tour.itinerary?.map(day => ({
            '@type': 'TouristAttraction',
            name: day.title,
            description: day.description
        })),
        offers: {
            '@type': 'Offer',
            url: `${siteConfig.url}/tours/${tour.id}`,
            price: tour.price,
            priceCurrency: 'KES',
            availability: 'https://schema.org/InStock',
        },
    };
}
