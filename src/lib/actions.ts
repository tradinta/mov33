'use server';

import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import type { EventFormValues } from '@/app/organizer/events/new/page';

export async function createListing(formData: EventFormValues, organizerId: string) {
    const { listingType, ...data } = formData;
    const collectionName = listingType === 'event' ? 'events' : 'tours';

    try {
        const docData = {
            ...data,
            organizerId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        };

        if (docData.date) {
            docData.date = new Date(docData.date);
        }

        await addDoc(collection(firestore, collectionName), docData);

    } catch (error) {
        console.error(`Error creating ${listingType}: `, error);
        // Re-throw the error to be caught by the calling function
        throw new Error(`Failed to create ${listingType}.`);
    }
}
