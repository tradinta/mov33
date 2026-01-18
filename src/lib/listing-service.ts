
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { generateSlug, ensureUniqueSlug } from '@/lib/slug';

export async function createListing(formData: any, organizerId: string) {
    const { listingType, ...data } = formData;
    const collectionName = listingType === 'event' ? 'events' : 'tours';

    try {
        const docData = {
            ...data,
            organizerId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        // Generate Slug
        if (data.name) {
            const baseSlug = generateSlug(data.name);
            const uniqueSlug = await ensureUniqueSlug(baseSlug, collectionName);
            docData.slug = uniqueSlug;
        }

        // Normalize date: ensure it's a proper Date object for Firestore
        if (docData.date) {
            const parsedDate = new Date(docData.date);
            if (!isNaN(parsedDate.getTime())) {
                docData.date = parsedDate;
            } else {
                delete docData.date; // Remove invalid date
            }
        }

        const docRef = await addDoc(collection(firestore, collectionName), docData);
        return docRef.id;

    } catch (error: any) {
        console.error(`Error creating ${listingType}: `, error);
        throw error;
    }
}
