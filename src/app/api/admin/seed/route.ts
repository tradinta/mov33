import { NextRequest, NextResponse } from 'next/server';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';

export async function GET(req: NextRequest) {
    try {
        const events = [
            {
                title: "Nairobi Tech Week 2026",
                description: "The biggest tech gathering in East Africa. Join thousands of developers, founders, and investors for a week of innovation.",
                date: Timestamp.fromDate(new Date('2026-06-15T09:00:00')),
                location: "KICC, Nairobi",
                price: 5000,
                imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50935278?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "tech",
                tags: ["tech", "conference", "networking"],
                organizerId: "mov33-official",
                status: "published",
                isFeatured: true,
                isPremium: false,
                venue: "Kenyatta International Convention Centre",
                capacity: 5000,
                ticketsSold: 1240,
                moderationStatus: "approved",
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "std", tier: "Standard", price: 5000, quantity: 4000, status: "available" },
                    { id: "vip", tier: "VIP", price: 15000, quantity: 1000, status: "available" }
                ]
            },
            {
                title: "Sauti Sol Final Bow",
                description: "The legendary boy band returns for one final exclusive performance under the stars.",
                date: Timestamp.fromDate(new Date('2026-04-20T19:00:00')),
                location: "Uhuru Gardens, Nairobi",
                price: 3500,
                imageUrl: "https://images.unsplash.com/photo-1459749411177-046f521c8ae3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "concert",
                tags: ["music", "concert", "live"],
                organizerId: "mov33-official",
                status: "published",
                isFeatured: true,
                isPremium: true,
                venue: "Uhuru Gardens",
                capacity: 10000,
                ticketsSold: 8500,
                moderationStatus: "approved",
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "reg", tier: "Regular", price: 3500, quantity: 8000, status: "available" },
                    { id: "vip", tier: "Golden Circle", price: 10000, quantity: 2000, status: "available" }
                ]
            },
            {
                title: "Diani Beach Yoga Retreat",
                description: "3 days of mindfulness, yoga, and wellness on the pristine white sands of Diani.",
                date: Timestamp.fromDate(new Date('2026-08-10T08:00:00')),
                location: "Diani Beach, Kwale",
                price: 25000,
                imageUrl: "https://images.unsplash.com/photo-1599447421405-0c307896879e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "community",
                tags: ["wellness", "yoga", "beach"],
                organizerId: "wellness-kenya",
                status: "published",
                isFeatured: false,
                isPremium: true,
                venue: "Swahili Beach Resort",
                capacity: 50,
                ticketsSold: 12,
                moderationStatus: "approved",
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "retreat", tier: "Full Retreat", price: 25000, quantity: 50, status: "available" }
                ]
            },
            {
                title: "Safari Rally Afterparty",
                description: "Celebrate the WRC Safari Rally with petrolheads and party lovers. Top DJs and endless vibes.",
                date: Timestamp.fromDate(new Date('2026-06-28T20:00:00')),
                location: "Naivasha",
                price: 2000,
                imageUrl: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "party",
                tags: ["party", "rally", "nightlife"],
                organizerId: "rally-events",
                status: "published",
                isFeatured: false,
                isPremium: false,
                venue: "Soysambu Conservancy",
                capacity: 2000,
                ticketsSold: 450,
                moderationStatus: "approved",
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "entry", tier: "Entry", price: 2000, quantity: 2000, status: "available" }
                ]
            },
            {
                title: "Kilifi New Year Festival 2027",
                description: "Early bird tickets for the most vibrant new year festival in Africa. Art, music, and culture.",
                date: Timestamp.fromDate(new Date('2026-12-30T12:00:00')),
                location: "Kilifi",
                price: 8000,
                imageUrl: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "festival",
                tags: ["festival", "art", "music"],
                organizerId: "kilifi-fest",
                status: "published",
                isFeatured: true,
                isPremium: false,
                venue: "Beneath the Baobabs",
                capacity: 4000,
                ticketsSold: 150,
                moderationStatus: "approved",
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "early", tier: "Early Bird", price: 8000, quantity: 500, status: "available" },
                    { id: "adv", tier: "Advance", price: 12000, quantity: 2000, status: "available" }
                ]
            }
        ];

        const tours = [
            {
                title: "Mount Kenya Expedition",
                description: "4-day hike to Point Lenana via the Sirimon route. All inclusive package with guides and porters.",
                date: Timestamp.fromDate(new Date('2026-09-01T06:00:00')),
                location: "Mount Kenya",
                price: 45000,
                imageUrl: "https://images.unsplash.com/photo-1625409575979-99c0cb878a64?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "adventure",
                organizerId: "adventure-kenya",
                status: "published",
                isFeatured: true,
                duration: "4 Days",
                difficulty: "Hard",
                included: ["Transport", "Meals", "Park Fees", "Guide"],
                itinerary: [
                    { day: 1, title: "Nairobi to Old Moses", description: "Drive to Sirimon gate and hike to camp." },
                    { day: 2, title: "Old Moses to Shipton's", description: "Trek through the moorland." },
                    { day: 3, title: "Summit Day", description: "Summit Point Lenana at sunrise." },
                    { day: 4, title: "Descent", description: "Descent and drive back to Nairobi." }
                ],
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "resident", tier: "Citizen/Resident", price: 45000, quantity: 20, status: "available" },
                    { id: "nrb", tier: "Non-Resident", price: 85000, quantity: 10, status: "available" }
                ]
            },
            {
                title: "Maasai Mara Great Migration",
                description: "Witness the 8th wonder of the world. Luxury safari experience in the heart of the Mara.",
                date: Timestamp.fromDate(new Date('2026-07-15T08:00:00')),
                location: "Maasai Mara",
                price: 120000,
                imageUrl: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "safari",
                organizerId: "luxury-safaris",
                status: "published",
                isFeatured: true,
                duration: "3 Days",
                difficulty: "Easy",
                included: ["Flights", "Luxury Camp", "Game Drives", "Park Fees"],
                itinerary: [
                    { day: 1, title: "Arrival", description: "Fly to Mara and evening game drive." },
                    { day: 2, title: "Full Day Drive", description: "Follow the migration herds." },
                    { day: 3, title: "Departure", description: "Morning drive and flight back." }
                ],
                createdAt: Timestamp.now(),
                ticketTiers: [
                    { id: "wkd", tier: "Weekend Package", price: 120000, quantity: 12, status: "available" }
                ]
            }
        ];

        const products = [
            {
                name: "Mov33 Signature Hoodie",
                description: "Premium cotton blend hoodie with gold embroidered logo.",
                price: 4500,
                imageUrl: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "Clothing",
                stock: 50,
                createdAt: Timestamp.now(),
            },
            {
                name: "Festival Snapback",
                description: "Limited edition black and gold snapback.",
                price: 1500,
                imageUrl: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "Accessories",
                stock: 100,
                createdAt: Timestamp.now(),
            },
            {
                name: "Insulated Travel Flask",
                description: "Keep your drinks cold for 24 hours. Matte black finish.",
                price: 2000,
                imageUrl: "https://images.unsplash.com/photo-1602143407151-5111b24e6c4f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80",
                category: "Accessories",
                stock: 200,
                createdAt: Timestamp.now(),
            }
        ];

        for (const event of events) {
            await addDoc(collection(firestore, 'events'), event);
        }
        for (const tour of tours) {
            await addDoc(collection(firestore, 'tours'), tour);
        }
        for (const product of products) {
            await addDoc(collection(firestore, 'products'), product);
        }

        return NextResponse.json({ success: true, message: "Sample data seeded successfully!" });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
