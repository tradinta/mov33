'use client';

import React, { useEffect, useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Event } from '@/lib/types';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    Award,
    Calendar,
    ChevronRight,
    Facebook,
    Instagram,
    Linkedin,
    Locate,
    MapPin,
    Minus,
    Plus,
    Share2,
    ShoppingCart,
    Twitter,
    Loader2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ImageGallery } from '@/components/events/image-gallery';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { EventViewTracker } from '@/components/analytics/event-view-tracker';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type EventDetailsClientProps = {
    eventId: string;
};

function ShareModal() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="font-poppins">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[250px] bg-obsidian border-white/10 text-white">
                <DialogHeader>
                    <DialogTitle className="text-center font-headline uppercase tracking-tight">Share this Event</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center gap-4 py-4">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/5 bg-white/5 hover:bg-gold hover:text-obsidian transition-all">
                        <Facebook className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/5 bg-white/5 hover:bg-gold hover:text-obsidian transition-all">
                        <Twitter className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/5 bg-white/5 hover:bg-gold hover:text-obsidian transition-all">
                        <Instagram className="h-6 w-6" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-white/5 bg-white/5 hover:bg-gold hover:text-obsidian transition-all">
                        <Linkedin className="h-6 w-6" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function EventDetailsClient({ eventId }: EventDetailsClientProps) {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const { profile } = useAuth();
    const { addToCart } = useCart();
    const { toast } = useToast();
    const router = useRouter();

    const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const docRef = doc(firestore, 'events', eventId);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setEvent({ id: docSnap.id, ...docSnap.data() } as Event);
                } else {
                    setEvent(null);
                }
            } catch (error) {
                console.error("Error fetching event:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <Loader2 className="h-10 w-10 animate-spin text-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-gold animate-pulse">Loading Event Details...</p>
            </div>
        );
    }

    if (!event) {
        notFound();
    }

    const isVipEvent = event.tags.includes("VIP") || event.isPremium;
    const hasPremiumAccess = profile?.mov33Plus || false;
    const showUpgradeGate = isVipEvent && !hasPremiumAccess;

    const eventDate = event.date?.toDate ? event.date.toDate() : new Date();

    const handleQuantityChange = (ticketId: string, change: number) => {
        setTicketQuantities(prev => {
            const currentQuantity = prev[ticketId] || 0;
            const newQuantity = Math.max(0, currentQuantity + change);
            return {
                ...prev,
                [ticketId]: newQuantity,
            };
        });
    };

    const addTicketsToCart = (): number => {
        let itemsAdded = 0;
        if (!event.ticketTiers) return 0;

        Object.entries(ticketQuantities).forEach(([ticketId, quantity]) => {
            if (quantity > 0) {
                const ticketInfo = event.ticketTiers?.find(t => t.id === ticketId);
                if (ticketInfo) {
                    addToCart({
                        id: `${event.id}-${ticketId}`,
                        name: event.title,
                        price: ticketInfo.price,
                        image: event.imageUrl || '',
                        quantity,
                        variant: { name: ticketInfo.tier },
                    });
                    itemsAdded += quantity;
                }
            }
        });
        return itemsAdded;
    }

    const handleAddToCart = () => {
        const itemsAdded = addTicketsToCart();
        if (itemsAdded > 0) {
            toast({
                title: "Added to Cart",
                description: `Successfully added ${itemsAdded} ticket(s) for ${event.title}.`,
            });
            setTicketQuantities({});
        } else {
            toast({
                variant: "destructive",
                title: "No tickets selected",
                description: "Please select a quantity for at least one ticket tier.",
            });
        }
    };

    const handleProceedToCheckout = () => {
        const itemsAdded = addTicketsToCart();
        if (itemsAdded > 0) {
            router.push('/checkout');
        } else {
            toast({
                variant: "destructive",
                title: "No tickets selected",
                description: "Please select tickets before proceeding to checkout.",
            });
        }
    }

    const totalSelectedTickets = Object.values(ticketQuantities).reduce((sum, qty) => sum + qty, 0);

    // JSON-LD is now handled in the Server Component, but we keep the structure here just in case specific client-side updates are needed eventually.
    // Integrating the Schema directly in the page header via Metadata is cleaner.

    return (
        <div className="bg-obsidian min-h-screen text-white pt-20">
            <EventViewTracker eventId={event.id} organizerId={event.organizerId} />

            {event.gallery && event.gallery.length > 0 ? (
                <ImageGallery gallery={event.gallery} />
            ) : (
                <div className="h-[40vh] md:h-[60vh] relative overflow-hidden">
                    <Image
                        src={event.imageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                        fill
                        alt={event.title}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                </div>
            )}

            <div className="container mx-auto px-4 py-12">
                <main className="max-w-4xl mx-auto space-y-16">
                    <div className="space-y-10">
                        {/* Event Header */}
                        <header className="space-y-6">
                            <div className="flex flex-wrap items-center gap-3">
                                {event.tags.map(tag => (
                                    <Badge key={tag} className={cn(
                                        tag === 'VIP' || event.isPremium ? 'bg-gold text-obsidian' : 'bg-white/10 text-white/60 border-white/5',
                                        'font-black uppercase tracking-widest text-[9px] py-1 px-3 rounded-full'
                                    )}>
                                        {tag === 'VIP' && <Award className="mr-1.5 h-3 w-3" />}
                                        {tag}
                                    </Badge>
                                ))}
                            </div>

                            <h1 className="font-headline text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9]">
                                {event.title}
                            </h1>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                        <Calendar className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">Date & Time</div>
                                        <div className="font-bold text-sm">{format(eventDate, 'EEEE, d MMM yyyy')} • 18:00</div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/5">
                                    <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
                                        <MapPin className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black uppercase text-white/30 tracking-widest">Location</div>
                                        <div className="font-bold text-sm">{event.venue}, {event.location}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest h-12 px-8 hover:bg-gold hover:text-obsidian transition-all">
                                    <Calendar className="mr-2 h-4 w-4" /> Add to Calendar
                                </Button>
                                <ShareModal />
                            </div>
                        </header>

                        {/* Ticket Booking Section */}
                        <section id="tickets" className="scroll-mt-32">
                            {showUpgradeGate ? (
                                <div className="bg-gradient-to-br from-gold/10 via-gold/5 to-transparent border border-gold/20 p-8 rounded-[2.5rem] relative overflow-hidden">
                                    <div className="relative z-10">
                                        <div className="h-12 w-12 rounded-2xl bg-gold text-obsidian flex items-center justify-center mb-6">
                                            <Award className="h-6 w-6" />
                                        </div>
                                        <h3 className="text-3xl font-black uppercase italic tracking-tighter text-white mb-4">Members Only Experience</h3>
                                        <p className="text-white/60 font-poppins max-w-md mb-8">This is an exclusive event for mov33+ members. Join the elite circle to unlock access and member pricing.</p>
                                        <Button onClick={() => router.push('/profile')} className="bg-gold text-obsidian font-black uppercase tracking-widest px-10 h-14 rounded-2xl shadow-xl shadow-gold/20">Upgrade to mov33+</Button>
                                    </div>
                                    <div className="absolute -top-20 -right-20 h-64 w-64 bg-gold/20 rounded-full blur-[100px]" />
                                </div>
                            ) : (
                                <Card className="bg-white/[0.03] border-white/5 rounded-[3rem] p-8 md:p-12 overflow-hidden relative">
                                    <div className="relative z-10 space-y-10">
                                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                            <div>
                                                <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white">Discovery Passes</h2>
                                                <p className="text-white/40 text-sm font-poppins mt-2">Secure your spot for this premium experience.</p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {event.ticketTiers?.map(ticket => (
                                                <div key={ticket.id} className="group bg-white/5 border border-white/5 rounded-3xl p-6 transition-all hover:bg-white/[0.08] hover:border-white/10 flex flex-col sm:flex-row justify-between sm:items-center gap-6">
                                                    <div className="flex-1 space-y-2">
                                                        <div className="flex items-center justify-between">
                                                            <h4 className="font-black text-lg uppercase italic tracking-tight text-white group-hover:text-gold transition-colors">{ticket.tier}</h4>
                                                            <div className="text-2xl font-black text-white font-headline italic tracking-tighter">KES {ticket.price.toLocaleString()}</div>
                                                        </div>
                                                        <p className="text-xs text-white/40 font-poppins max-w-sm">{ticket.description}</p>
                                                        <div className="flex flex-wrap gap-2 pt-2">
                                                            {ticket.status === 'Sold Out' && <Badge className="bg-red-500/20 text-red-400 border-none text-[8px] uppercase font-black">Sold Out</Badge>}
                                                            {ticket.remaining && ticket.remaining < 20 && ticket.status !== 'Sold Out' && <Badge className="bg-orange-500/20 text-orange-400 border-none text-[8px] uppercase font-black">Only {ticket.remaining} left</Badge>}
                                                            {ticket.discount && <Badge className="bg-kenyan-green/20 text-kenyan-green border-none text-[8px] uppercase font-black">{ticket.discount}</Badge>}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center gap-4 bg-obsidian py-2 px-4 rounded-2xl border border-white/10">
                                                        <Button variant="ghost" size="icon" className='h-8 w-8 rounded-xl text-white hover:bg-white/10' onClick={() => handleQuantityChange(ticket.id, -1)} disabled={ticket.status === 'Sold Out'}>
                                                            <Minus className="h-4 w-4" />
                                                        </Button>
                                                        <span className='text-xl font-black w-6 text-center text-white'>{ticketQuantities[ticket.id] || 0}</span>
                                                        <Button variant="ghost" size="icon" className='h-8 w-8 rounded-xl text-white hover:bg-white/10' onClick={() => handleQuantityChange(ticket.id, 1)} disabled={ticket.status === 'Sold Out' || (ticket.remaining !== undefined && ticket.remaining <= (ticketQuantities[ticket.id] || 0))}>
                                                            <Plus className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-4">
                                            <Button size="lg" className="w-full sm:flex-1 h-16 bg-gold text-obsidian font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-gold/20 transition-all hover:scale-[1.02] active:scale-[0.98]" onClick={handleProceedToCheckout} disabled={totalSelectedTickets === 0}>
                                                Proceed to Checkout
                                            </Button>
                                            <Button size="lg" variant="outline" className="w-full sm:w-auto h-16 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest px-10 hover:bg-white/10" onClick={handleAddToCart} disabled={totalSelectedTickets === 0}>
                                                <ShoppingCart className="mr-3 h-5 w-5" />
                                                Add ({totalSelectedTickets})
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-gold/5 rounded-full blur-[100px]" />
                                </Card>
                            )}
                        </section>

                        {/* About Section */}
                        <section id="about" className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                                <div className="h-1 w-6 bg-gold rounded-full" />
                                Experience Details
                            </h2>
                            <div className="prose prose-invert max-w-none text-white/60 font-poppins leading-relaxed">
                                <p>{event.description}</p>
                            </div>
                        </section>

                        {/* Schedule Section */}
                        {event.schedule && event.schedule.length > 0 && (
                            <section id="schedule" className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                                    <div className="h-1 w-6 bg-gold rounded-full" />
                                    The Itinerary
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {event.schedule.map((day, index) => (
                                        <AccordionItem value={`item-${index}`} key={day.day} className="border-white/5 bg-white/[0.02] rounded-3xl px-6">
                                            <AccordionTrigger className="font-black uppercase text-sm italic tracking-tight hover:no-underline hover:text-gold">
                                                {day.day}
                                            </AccordionTrigger>
                                            <AccordionContent>
                                                <ul className="space-y-6 pt-4 pb-2">
                                                    {day.items.map((item, i) => (
                                                        <li key={i} className="flex items-start gap-6 group">
                                                            <p className="font-black text-gold text-xs w-20 shrink-0 pt-0.5">{item.time}</p>
                                                            <p className="text-white/60 text-sm font-medium group-hover:text-white transition-colors">{item.title}</p>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}

                        {/* Organizer Section */}
                        <section id="organizer" className="space-y-6">
                            <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                                <div className="h-1 w-6 bg-gold rounded-full" />
                                The Curator
                            </h2>
                            <Link href={`/organizers/${event.organizerId}`} className="block group">
                                <Card className="bg-white/5 border border-white/5 p-8 rounded-[2.5rem] transition-all group-hover:border-gold/30">
                                    <div className="flex items-center gap-6">
                                        <Avatar className="h-20 w-20 border-2 border-white/10 group-hover:border-gold/50 transition-all duration-500">
                                            <AvatarImage src={event.organizerLogoUrl} alt={event.organizerName} className="object-cover" />
                                            <AvatarFallback className="bg-white/5 font-black text-gold">{event.organizerName?.[0] || 'O'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <h3 className="font-black text-2xl uppercase italic tracking-tighter text-white group-hover:text-gold transition-colors">{event.organizerName || 'Mov33 Partner'}</h3>
                                            <p className="text-sm text-white/40 font-poppins">Official Curator & Event Organizer</p>
                                            <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gold opacity-60 group-hover:opacity-100 italic">
                                                View Discovery Catalog <ChevronRight className="h-3 w-3" />
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </Link>
                        </section>

                        {/* FAQs */}
                        {event.faqs && event.faqs.length > 0 && (
                            <section id="faq" className="space-y-6">
                                <h2 className="text-xl font-black uppercase tracking-widest text-white flex items-center gap-3">
                                    <div className="h-1 w-6 bg-gold rounded-full" />
                                    Common Inquiries
                                </h2>
                                <Accordion type="single" collapsible className="w-full space-y-4">
                                    {event.faqs.map((faq, index) => (
                                        <AccordionItem value={`faq-${index}`} key={index} className="border-white/5 bg-white/[0.02] rounded-3xl px-6">
                                            <AccordionTrigger className="text-left font-bold text-sm text-white/80 hover:no-underline hover:text-gold">
                                                {faq.q}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-white/40 font-poppins leading-relaxed">
                                                {faq.a}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </section>
                        )}

                        {/* Lost & Found Section */}
                        {event.lostAndFound && (
                            <section id="lost-and-found">
                                <Card className="bg-white/5 border-dashed border-white/10 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/20">
                                        <Locate className="h-8 w-8" />
                                    </div>
                                    <div className="flex-1 space-y-2">
                                        <h4 className="text-lg font-black uppercase italic tracking-tight text-white">Lost & Found Presence</h4>
                                        <p className="text-white/40 text-sm font-poppins">
                                            The curator has reported <strong className="text-gold font-black">{event.lostAndFound.itemsFound} found items</strong>. If you are missing something, we're here to help.
                                        </p>
                                    </div>
                                    <Button asChild className="bg-white/5 hover:bg-white/10 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl px-8 border border-white/5">
                                        <a href={`mailto:${event.lostAndFound.contact}`}>Contact Curator</a>
                                    </Button>
                                </Card>
                            </section>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
