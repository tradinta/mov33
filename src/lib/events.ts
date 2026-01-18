import { Timestamp } from 'firebase/firestore';
import { Event } from '@/lib/types';

export function serializeEvent(event: any): any {
    if (!event) return null;
    const serialized = { ...event };

    // Convert Firestore Timestamps to Serializable Dates/Strings
    ['date', 'createdAt', 'updatedAt', 'earlyBirdDeadline'].forEach(field => {
        if (serialized[field] && typeof serialized[field].toDate === 'function') {
            serialized[field] = serialized[field].toDate().toISOString();
        } else if (serialized[field] && serialized[field].seconds) {
            serialized[field] = new Date(serialized[field].seconds * 1000).toISOString();
        }
    });

    // Handle ticketTiers explicitly if present
    if (serialized.ticketTiers && Array.isArray(serialized.ticketTiers)) {
        serialized.ticketTiers = serialized.ticketTiers.map((tier: any) => {
            const newTier = { ...tier };
            if (newTier.earlyBirdDeadline) {
                if (typeof newTier.earlyBirdDeadline.toDate === 'function') {
                    newTier.earlyBirdDeadline = newTier.earlyBirdDeadline.toDate().toISOString();
                } else if (newTier.earlyBirdDeadline.seconds) {
                    newTier.earlyBirdDeadline = new Date(newTier.earlyBirdDeadline.seconds * 1000).toISOString();
                }
            }
            return newTier;
        });
    }

    // Handle updates timestamps
    if (serialized.updates && Array.isArray(serialized.updates)) {
        serialized.updates = serialized.updates.map((update: any) => {
            const newUpdate = { ...update };
            if (newUpdate.date) {
                if (typeof newUpdate.date.toDate === 'function') {
                    newUpdate.date = newUpdate.date.toDate().toISOString();
                } else if (newUpdate.date.seconds) {
                    newUpdate.date = new Date(newUpdate.date.seconds * 1000).toISOString();
                }
            }
            return newUpdate;
        });
    }

    return serialized;
}
