import { MetadataRoute } from 'next';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { firestore } from '@/firebase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.mov33.co.ke';

    // 1. Static Routes
    const routes = [
        '',
        '/events',
        '/tours',
        '/shop',
        '/about',
        '/membership',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: route === '' ? 1.0 : 0.8,
    }));

    // 2. Dynamic Events
    let events = [];
    try {
        const eventsQuery = query(collection(firestore, 'events'), where('status', '==', 'published'));
        // Note: getDocs on server might need Admin SDK for larger fetches, 
        // but for sitemap generation in Next.js (Node runtime), standard SDK works if rules allow read.
        // However, standardized public read rules usually suffice here.
        const eventsSnap = await getDocs(eventsQuery);
        events = eventsSnap.docs.map(doc => ({
            url: `${baseUrl}/events/${doc.id}`,
            lastModified: doc.data().updatedAt?.toDate() || doc.data().createdAt?.toDate() || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));
    } catch (err) {
        console.error("Error generating events sitemap:", err);
    }

    // 3. Dynamic Tours
    let tours = [];
    try {
        const toursQuery = query(collection(firestore, 'tours'), where('status', '==', 'published'));
        const toursSnap = await getDocs(toursQuery);
        tours = toursSnap.docs.map(doc => ({
            url: `${baseUrl}/tours/${doc.id}`,
            lastModified: doc.data().updatedAt?.toDate() || doc.data().createdAt?.toDate() || new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.9,
        }));
    } catch (err) {
        console.error("Error generating tours sitemap:", err);
    }

    return [...routes, ...events, ...tours];
}
