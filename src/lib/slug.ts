
import { firestore } from '@/firebase';
import { collection, getDocs, query, where, limit } from 'firebase/firestore';

export function generateSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
}

export async function ensureUniqueSlug(slug: string, collectionName: string): Promise<string> {
    const colRef = collection(firestore, collectionName);
    let uniqueSlug = slug;
    let counter = 1;

    while (true) {
        const q = query(colRef, where('slug', '==', uniqueSlug), limit(1));
        const snapshot = await getDocs(q);
        if (snapshot.empty) break;
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}
