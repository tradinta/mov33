import { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { doc, getDoc, collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { UserProfile, Event } from '@/lib/types';
import { serializeEvent } from '@/lib/events';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, CheckCircle, Globe, MapPin, Share2, Users } from 'lucide-react';
import { EventCard } from '@/components/events/event-card';

type Props = {
    params: { id: string };
};

async function getOrganizer(id: string) {
    const docRef = doc(firestore, 'users', id);
    const docSnap = await getDoc(docRef);
    if (!docSnap.exists()) return null;
    // Basic security: ensure we only return public fields or sanitize
    return { id: docSnap.id, ...docSnap.data() } as UserProfile;
}

async function getOrganizerEvents(organizerId: string) {
    const eventsRef = collection(firestore, 'events');
    const q = query(eventsRef, where('organizerId', '==', organizerId), orderBy('date', 'desc'), limit(20));
    const querySnapshot = await getDocs(q);

    const events = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event));

    // Separate into active and past
    const now = new Date();
    const active: Event[] = [];
    const past: Event[] = [];

    events.forEach(event => {
        let eventDate = new Date();
        if (event.date) {
            if (typeof (event.date as any).toDate === 'function') {
                eventDate = (event.date as any).toDate();
            } else if ((event.date as any).seconds) {
                eventDate = new Date((event.date as any).seconds * 1000);
            }
        }

        if (eventDate >= now) {
            active.push(event);
        } else {
            past.push(event);
        }
    });

    // Sort active by soonest first, past by most recent first (already desc)
    active.sort((a, b) => {
        const dateA = (a.date as any).seconds || 0;
        const dateB = (b.date as any).seconds || 0;
        return dateA - dateB;
    });

    return {
        active: active.map(serializeEvent),
        past: past.map(serializeEvent)
    };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const organizer = await getOrganizer(resolvedParams.id);
    if (!organizer) return { title: 'Organizer Not Found' };
    return {
        title: `${organizer.displayName || 'Organizer'} | Mov33`,
        description: organizer.bio || `Check out events by ${organizer.displayName} on Mov33.`,
        openGraph: {
            images: [organizer.photoURL || ''],
        }
    };
}

export default async function OrganizerProfilePage({ params }: Props) {
    const resolvedParams = await params;
    const organizer = await getOrganizer(resolvedParams.id);
    const { active, past } = await getOrganizerEvents(resolvedParams.id);

    if (!organizer) return notFound();

    return (
        <div className="min-h-screen bg-obsidian text-white pt-20">
            {/* Hero Section */}
            <div className="relative">
                <div className="h-64 md:h-80 w-full overflow-hidden bg-gradient-to-br from-obsidian via-purple-950/20 to-obsidian border-b border-white/5 relative">
                    {/* Abstract BG Pattern */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
                </div>

                <div className="container mx-auto px-4 relative -mt-32">
                    <div className="flex flex-col md:flex-row gap-8 items-start md:items-end mb-8">
                        <div className="h-40 w-40 md:h-52 md:w-52 rounded-[2.5rem] border-4 border-obsidian bg-obsidian p-1 shadow-2xl relative group">
                            <Avatar className="h-full w-full rounded-[2rem]">
                                <AvatarImage src={organizer.photoURL} className="object-cover" />
                                <AvatarFallback className="bg-white/10 text-4xl font-black text-gold">{organizer.displayName?.[0]}</AvatarFallback>
                            </Avatar>
                            {organizer.isVerified && (
                                <div className="absolute -bottom-2 -right-2 bg-blue-500 text-white p-2 rounded-full border-4 border-obsidian shadow-lg" title="Verified Organizer">
                                    <CheckCircle className="h-6 w-6 fill-current" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 pb-2 space-y-4">
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase italic tracking-tighter text-white mb-2">{organizer.displayName}</h1>
                                <div className="flex flex-wrap gap-4 text-sm font-medium text-white/60">
                                    {organizer.location && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                                            <MapPin className="h-4 w-4" /> {organizer.location}
                                        </div>
                                    )}
                                    {organizer.website && (
                                        <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                                            <Globe className="h-4 w-4" />
                                            <a href={organizer.website} target="_blank" rel="noopener noreferrer">{organizer.website.replace(/^https?:\/\//, '')}</a>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1.5 bg-white/5 px-3 py-1 rounded-full">
                                        <Calendar className="h-4 w-4" /> Joined {organizer.createdAt ? new Date((organizer.createdAt as any).seconds * 1000).getFullYear() : '2024'}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4 pb-2">
                            {/* Stats */}
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center min-w-[100px]">
                                <div className="text-2xl font-black text-white">{active.length + past.length}</div>
                                <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Events</div>
                            </div>
                            <div className="bg-white/5 backdrop-blur-md rounded-2xl p-4 border border-white/5 text-center min-w-[100px]">
                                <div className="text-2xl font-black text-white">{organizer.followersCount || 0}</div>
                                <div className="text-[10px] uppercase font-bold text-white/40 tracking-widest">Followers</div>
                            </div>
                        </div>
                    </div>

                    {/* Bio Section */}
                    {organizer.bio && (
                        <div className="max-w-3xl mb-12">
                            <p className="text-lg text-white/80 font-poppins leading-relaxed">{organizer.bio}</p>
                        </div>
                    )}

                    {/* Events Tabs */}
                    <Tabs defaultValue="upcoming" className="space-y-8 pb-20">
                        <TabsList className="bg-white/5 border border-white/5 p-1 rounded-2xl h-auto">
                            <TabsTrigger value="upcoming" className="rounded-xl px-8 py-3 text-sm font-black uppercase tracking-widest data-[state=active]:bg-gold data-[state=active]:text-obsidian">
                                Upcoming Events ({active.length})
                            </TabsTrigger>
                            <TabsTrigger value="past" className="rounded-xl px-8 py-3 text-sm font-black uppercase tracking-widest data-[state=active]:bg-white/10 data-[state=active]:text-white">
                                Past Events ({past.length})
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="upcoming" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {active.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {active.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                                    <Calendar className="h-16 w-16 mx-auto text-white/20 mb-6" />
                                    <h3 className="text-2xl font-black uppercase italic text-white mb-2">No Upcoming Events</h3>
                                    <p className="text-white/40">Check back later for new announcements from this curator.</p>
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="past" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            {past.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity">
                                    {past.map(event => (
                                        <EventCard key={event.id} event={event} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-white/5 rounded-[3rem] border border-white/5 border-dashed">
                                    <Calendar className="h-16 w-16 mx-auto text-white/20 mb-6" />
                                    <h3 className="text-2xl font-black uppercase italic text-white mb-2">No Past Events</h3>
                                    <p className="text-white/40">This organizer hasn't hosted any events yet.</p>
                                </div>
                            )}
                        </TabsContent>
                    </Tabs>

                </div>
            </div>
        </div>
    );
}
