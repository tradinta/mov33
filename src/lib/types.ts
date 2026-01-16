import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

export type UserRole = 'user' | 'moderator' | 'organizer' | 'influencer' | 'admin' | 'super-admin';

export interface UserProfile {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: UserRole;
    phoneNumber?: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    bio?: string;
    location?: string;
    website?: string;
    businessRegistration?: string;
    availableBalance?: number;
    pendingBalance?: number;
    totalPayouts?: number;
    followersCount?: number;
    isVerified?: boolean;
    isSuspended?: boolean;
    mov33Plus?: boolean;
    mov33PlusExpiry?: Timestamp;
}

export interface Event {
    id: string;
    title: string;
    description: string;
    organizerId: string;
    organizerName?: string;
    organizerLogoUrl?: string;
    date: Timestamp;
    venue: string;
    location: string;
    price: number; // Base price or starting price
    capacity: number;
    ticketsSold: number;
    imageUrl?: string;
    gallery?: { id: string; imageUrl: string; description?: string }[];
    schedule?: { day: string; items: { time: string; title: string }[] }[];
    faqs?: { q: string; a: string }[];
    lostAndFound?: { itemsFound: number; contact: string };
    ticketTiers?: {
        id: string;
        tier: string;
        price: number;
        description: string;
        perks: string[];
        status: 'Available' | 'Sold Out' | 'Almost Gone';
        remaining?: number;
        discount?: string;
    }[];
    status: 'draft' | 'published' | 'cancelled';
    isPrivate: boolean;
    tags: string[];
    isFeatured?: boolean;
    isPremium?: boolean;
    reportedCount?: number;
    moderationStatus?: 'pending' | 'approved' | 'rejected';
    slug?: string;
}

export interface Payout {
    id: string;
    organizerId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    method: string;
    recipient: string;
    createdAt: Timestamp | null;
}

export interface Promocode {
    id: string;
    organizerId: string;
    code: string;
    discountType: 'percentage' | 'fixed';
    discountValue: number;
    active: boolean;
    usageCount: number;
    maxUsage?: number;
    influencerId?: string;
    commissionValue?: number;
    commissionType?: 'percentage' | 'fixed';
    createdAt: Timestamp;
}

export interface TicketRecord {
    id: string;
    orderId: string;
    eventId: string;
    eventName: string;
    eventDate: Timestamp;
    eventLocation: string;
    eventImageUrl?: string;
    userId: string;
    userName: string;
    userEmail: string;
    ticketType: string; // VIP, Advance, etc.
    price: number;
    qrCode: string; // Unique string for QR generation
    checkedIn: boolean;
    checkedInAt?: Timestamp;
    organizerId: string;
    createdAt: Timestamp;
}

export interface EventListing {
    id: string;
    name: string;
    date: string;
    time?: string;
    location?: string;
    imageUrl?: string;
    ticketsSold?: number;
    totalCapacity?: number;
    organizerId: string;
    revenue?: number;
}

export interface Tour {
    id: string;
    name: string;
    duration: string;
    price: number;
    rating: number;
    reviews: number;
    destination: string;
    description: string;
    highlights: string[];
    includes: string[];
    notIncludes: string[];
    imageUrl?: string;
    gallery?: string[];
    organizerId: string;
    organizerName?: string;
    organizerLogoUrl?: string;
    privateBooking: boolean;
    minGuests: number;
    maxGuests: number;
    status: 'draft' | 'published' | 'cancelled';
    moderationStatus?: 'pending' | 'approved' | 'rejected';
    isFeatured?: boolean;
    isPremium?: boolean;
    tags: string[];
    createdAt: Timestamp;
}

export interface TourListing {
    id: string;
    name: string;
    destination: string;
    duration?: string;
    bookings?: number;
    organizerId: string;
}

export interface GuideItem {
    icon: ReactNode;
    title: string;
    description: string;
    steps: string[];
}

export interface Report {
    id: string;
    targetId: string;
    targetType: 'event' | 'user';
    reporterId: string;
    reason: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: Timestamp;
}
