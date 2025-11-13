
'use client';

import React, { useState } from 'react';
import { notFound, useRouter } from 'next/navigation';
import { eventsData, type Event } from '@/lib/events-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  Award,
  Calendar, 
  ChevronRight, 
  Clock, 
  Facebook,
  Heart, 
  Instagram,
  Linkedin,
  Locate,
  MapPin, 
  Minus, 
  Plus, 
  Share2, 
  ShoppingCart, 
  Star, 
  Ticket,
  Twitter,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { ImageGallery } from '@/components/events/image-gallery';
import Link from 'next/link';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { UpgradeToVipCard } from '@/components/shared/upgrade-to-vip-card';
import { cn } from '@/lib/utils';

// Dummy data that would normally come from a CMS or database
const eventDetails = {
  "safari-sevens": {
    gallery: [
      PlaceHolderImages.find(p => p.id === 'hero-1')!,
      { id: "gallery-1", imageUrl: "https://picsum.photos/seed/safarisevens1/600/400", description: "Action shot from a rugby match", imageHint: "rugby game" },
      { id: "gallery-2", imageUrl: "https://picsum.photos/seed/safarisevens2/600/400", description: "Crowd cheering at the stadium", imageHint: "stadium crowd" },
      { id: "gallery-3", imageUrl: "https://picsum.photos/seed/safarisevens3/600/400", description: "Trophy presentation", imageHint: "sports trophy" },
    ],
    about: "Africa's premier seven-a-side rugby tournament returns to Nairobi for a weekend of thrilling action, vibrant entertainment, and international camaraderie. Experience the fast-paced, high-scoring matches as top teams from around the globe compete for the coveted Safari Sevens trophy. More than just a rugby tournament, it's a festival celebrating sport, music, and Kenyan culture.",
    organizer: {
      id: "kenya-rugby-union",
      name: "Kenya Rugby Union",
      logoUrl: "https://picsum.photos/seed/kru/100/100",
      description: "The official governing body of rugby in Kenya, dedicated to promoting the sport and organizing world-class tournaments.",
    },
    artists: [],
    schedule: [
      { day: "Day 1: Friday", items: [
        { time: "10:00 AM", title: "Gates Open & Group Stage Matches Begin" },
        { time: "01:00 PM", title: "Lunch Break & Entertainment" },
        { time: "04:00 PM", title: "Final Group Stage Matches" },
        { time: "06:00 PM", title: "After-Party with DJ Spark" },
      ]},
      { day: "Day 2: Saturday", items: [
        { time: "10:00 AM", title: "Knockout Rounds Begin" },
        { time: "01:00 PM", title: "Veterans Match & Halftime Show" },
        { time: "04:00 PM", title: "Semi-Finals" },
        { time: "06:00 PM", title: "Live Concert ft. Sauti Sol" },
      ]},
      { day: "Day 3: Sunday", items: [
        { time: "12:00 PM", title: "Bronze Final" },
        { time: "02:00 PM", title: "Main Cup Final" },
        { time: "04:00 PM", title: "Trophy Presentation & Closing Ceremony" },
      ]},
    ],
    faqs: [
        { q: "What items are prohibited?", a: "No outside food or drinks, large bags, or professional camera equipment will be allowed." },
        { q: "Is there parking available?", a: "Yes, limited paid parking is available. We recommend using ride-sharing services." },
        { q: "Are children allowed?", a: "Yes, this is a family-friendly event. Children under 12 enter free." },
    ],
    lostAndFound: {
      itemsFound: 5,
      contact: 'help@safarisevens.com'
    },
    tickets: [
        { id: 'early-bird', tier: "Early Bird", price: 1500, description: "Get in early and save! Access for the full weekend.", perks: ["Full weekend pass", "Access to all group matches"], status: "Sold Out", remaining: 0 },
        { id: 'advance', tier: "Advance", price: 2500, description: "The complete weekend experience for any rugby fan.", perks: ["Full weekend pass", "Access to all matches including finals"], status: "Available", remaining: null, discount: "Group discount available" },
        { id: 'vip', tier: "VIP", price: 7500, description: "Elevate your weekend with exclusive perks.", perks: ["Express entry", "Access to VIP lounge", "Complimentary drinks & snacks"], status: "Available", remaining: null },
        { id: 'vvip', tier: "Premium VIP", price: 15000, description: "The ultimate fan package with player access.", perks: ["All VIP perks", "Meet & Greet with players", "Exclusive merchandise"], status: "Almost Gone", remaining: 15 },
    ]
  },
  "sauti-sol-live": {
     gallery: [
      PlaceHolderImages.find(p => p.id === 'hero-1')!,
      { id: "gallery-1", imageUrl: "https://picsum.photos/seed/sautisol1/600/400", description: "Sauti Sol on stage", imageHint: "band stage" },
      { id: "gallery-2", imageUrl: "https://picsum.photos/seed/sautisol2/600/400", description: "Cheering fans", imageHint: "concert fans" },
      { id: "gallery-3", imageUrl: "https://picsum.photos/seed/sautisol3/600/400", description: "Fireworks over the stage", imageHint: "concert fireworks" },
    ],
    about: "Join Kenya's biggest Afro-pop band, Sauti Sol, for their final homecoming concert. Celebrate a decade of incredible music, iconic hits, and unforgettable performances. This will be a night to remember, filled with energy, dancing, and a journey through their greatest hits.",
     organizer: {
      id: "mov33-presents",
      name: "Mov33 Presents",
      logoUrl: "https://picsum.photos/seed/mov33/100/100",
      description: "Curators of premium live experiences in Kenya, bringing the world's best artists to the local stage.",
    },
    artists: [
        { name: "Sauti Sol", role: "Main Act", imageUrl: "https://picsum.photos/seed/sautisolband/100/100" },
        { name: "Nviiri The Storyteller", role: "Opening Act", imageUrl: "https://picsum.photos/seed/nviiri/100/100" },
        { name: "Bensoul", role: "Special Guest", imageUrl: "https://picsum.photos/seed/bensoul/100/100" },
    ],
    schedule: [
      { day: "Event Schedule", items: [
        { time: "06:00 PM", title: "Gates Open & DJ Set" },
        { time: "08:00 PM", title: "Opening Act: Nviiri The Storyteller" },
        { time: "09:00 PM", title: "Main Act: Sauti Sol" },
        { time: "11:00 PM", title: "After-Party" },
      ]}
    ],
     faqs: [
        { q: "What time does the main act start?", a: "Sauti Sol is expected on stage at 9:00 PM." },
        { q: "Can I bring a camera?", a: "Only phone cameras are allowed. No professional DSLRs." },
        { q: "What's the refund policy?", a: "Tickets are non-refundable." },
    ],
    lostAndFound: {
      itemsFound: 8,
      contact: 'lost@mov33.com'
    },
     tickets: [
        { id: 'advance', tier: "Advance", price: 5000, description: "Secure your spot for this historic final show.", perks: ["Full access to the concert grounds"], status: "Available", remaining: null },
        { id: 'vip', tier: "VIP", price: 15000, description: "Enjoy the show from the best seats with premium service.", perks: ["Express entry", "Access to VIP lounge with private bar", "Premium viewing area"], status: "Available", remaining: null, discount: "Buy 4, get 1 free!" },
        { id: 'vvip', tier: "VVIP", price: 30000, description: "An unforgettable night with exclusive artist access.", perks: ["All VIP perks", "Meet & Greet with Sauti Sol", "Signed merchandise"], status: "Almost Gone", remaining: 25 },
    ]
  }
};


type EventDetailPageProps = {
  params: { id: string };
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
            <DialogContent className="sm:max-w-[250px]">
                <DialogHeader>
                    <DialogTitle className="text-center font-headline">Share this Event</DialogTitle>
                </DialogHeader>
                <div className="flex justify-center gap-4 py-4">
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Facebook className="h-6 w-6 text-[#1877F2]" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Twitter className="h-6 w-6 text-[#1DA1F2]" />
                    </Button>
                     <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Instagram className="h-6 w-6 text-[#E4405F]" />
                    </Button>
                     <Button variant="outline" size="icon" className="h-12 w-12 rounded-full">
                        <Linkedin className="h-6 w-6 text-[#0A66C2]" />
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = eventsData.find((e) => e.id === params.id);
  const details = eventDetails[params.id as keyof typeof eventDetails] || eventDetails['safari-sevens']; 
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const [ticketQuantities, setTicketQuantities] = useState<Record<string, number>>({});
  
  // Mock current user status. In a real app, this would come from a user context or session.
  const currentUser = {
    membership: "Standard" // Change to "VIP" to test access
  };

  if (!event) {
    notFound();
  }

  const isVipEvent = event.tags.includes("VIP");
  const hasVipAccess = currentUser.membership === "VIP";
  const showUpgradeGate = isVipEvent && !hasVipAccess;


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
    Object.entries(ticketQuantities).forEach(([ticketId, quantity]) => {
      if (quantity > 0) {
        const ticketInfo = details.tickets.find(t => t.id === ticketId);
        if (ticketInfo) {
          addToCart({
            id: `${event.id}-${ticketId}`,
            name: event.name,
            price: ticketInfo.price,
            image: event.image.imageUrl,
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
        title: "Tickets Added to Cart",
        description: `Successfully added ${itemsAdded} ticket(s) to your cart.`,
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

  return (
    <div className="bg-background text-foreground">
        <ImageGallery gallery={details.gallery} />

        <div className="container mx-auto px-4 py-8">
            <main className="max-w-4xl mx-auto">
                <div className="space-y-12">
                    {/* Event Header */}
                    <header>
                        <div className="flex items-center gap-2">
                            {event.tags.map(tag => (
                                <Badge key={tag} variant={tag === 'VIP' ? 'destructive' : 'secondary'} className={cn(tag === 'VIP' && 'bg-muted-gold text-white', 'font-poppins')}>
                                    {tag === 'VIP' && <Award className="mr-1.5 h-3 w-3" />}
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-foreground mt-4">
                            {event.name}
                        </h1>
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground font-poppins">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-accent" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-accent" />
                                <span>{event.venue}, {event.location}</span>
                            </div>
                        </div>
                        <div className="mt-6 flex gap-2">
                            <Button variant="outline" size="sm" className="font-poppins">
                                <Calendar className="mr-2 h-4 w-4" />
                                Add to Calendar
                            </Button>
                            <ShareModal />
                        </div>
                    </header>
                    
                    {/* Ticket Booking Section */}
                    <section id="tickets">
                        {showUpgradeGate ? (
                            <UpgradeToVipCard />
                        ) : (
                        <Card className="bg-card/50 backdrop-blur-lg shadow-xl">
                            <CardHeader>
                                <CardTitle className="font-headline text-2xl">Book Your Tickets</CardTitle>
                                <CardDescription>Select your desired ticket tiers and quantities.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <TooltipProvider>
                                {details.tickets.map(ticket => (
                                    <Card key={ticket.id} className="bg-background/70">
                                        <div className="p-4 flex flex-col sm:flex-row justify-between sm:items-center">
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="font-poppins font-semibold text-lg">{ticket.tier}</h4>
                                                    <p className="font-headline text-xl font-bold text-accent">KES {ticket.price.toLocaleString()}</p>
                                                </div>
                                                <p className="text-sm text-muted-foreground font-body mt-1">{ticket.description}</p>
                                                 <div className='pt-2'>
                                                    {ticket.status === 'Sold Out' && <Badge variant="destructive">Sold Out</Badge>}
                                                    {ticket.remaining && ticket.remaining > 0 && <Badge variant="outline" className="border-amber-500 text-amber-500">Only {ticket.remaining} tickets left!</Badge>}
                                                    {ticket.discount && <Badge variant="secondary" className="bg-green-100 text-green-800 border-green-300 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700 mt-1">{ticket.discount}</Badge>}
                                                </div>
                                            </div>
                                             <div className='flex items-center gap-3 rounded-full border px-3 py-2 mt-4 sm:mt-0 sm:ml-6'>
                                                <Button variant="ghost" size="icon" className='h-8 w-8 rounded-full' onClick={() => handleQuantityChange(ticket.id, -1)} disabled={ticket.status === 'Sold Out'}>
                                                    <Minus className="h-4 w-4" />
                                                </Button>
                                                <span className='text-lg font-bold w-6 text-center'>{ticketQuantities[ticket.id] || 0}</span>
                                                <Button variant="ghost" size="icon" className='h-8 w-8 rounded-full' onClick={() => handleQuantityChange(ticket.id, 1)} disabled={ticket.status === 'Sold Out' || ticket.remaining === ticketQuantities[ticket.id]}>
                                                    <Plus className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </Card>
                                ))}
                                </TooltipProvider>
                            </CardContent>
                            <CardFooter className="flex-col sm:flex-row gap-2">
                                <Button size="lg" variant="outline" className="w-full sm:w-auto font-poppins text-lg" onClick={handleAddToCart} disabled={totalSelectedTickets === 0}>
                                    <ShoppingCart className="mr-2 h-5 w-5" />
                                    Add to Cart ({totalSelectedTickets})
                                </Button>
                                 <Button size="lg" className="w-full sm:flex-1 font-poppins text-lg" onClick={handleProceedToCheckout} disabled={totalSelectedTickets === 0}>
                                    Proceed to Checkout
                                 </Button>
                            </CardFooter>
                        </Card>
                        )}
                    </section>


                    {/* About Section */}
                    <section id="about">
                        <h2 className="font-headline text-2xl font-bold">About The Event</h2>
                        <div className="mt-4 prose prose-invert max-w-none text-muted-foreground font-body leading-relaxed">
                          <p>{details.about}</p>
                        </div>
                    </section>

                    {/* Artists Section */}
                    {details.artists && details.artists.length > 0 && (
                        <section id="artists">
                            <h2 className="font-headline text-2xl font-bold">Lineup</h2>
                            <div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-6">
                                {details.artists.map(artist => (
                                    <div key={artist.name} className="flex flex-col items-center text-center">
                                        <Avatar className="h-24 w-24 border-2 border-accent">
                                            <AvatarImage src={artist.imageUrl} alt={artist.name}/>
                                            <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                        <h4 className="mt-3 font-poppins font-semibold text-foreground">{artist.name}</h4>
                                        <p className="text-sm text-muted-foreground">{artist.role}</p>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )}

                    {/* Schedule Section */}
                    <section id="schedule">
                        <h2 className="font-headline text-2xl font-bold">Schedule</h2>
                        <Accordion type="single" collapsible defaultValue="item-0" className="w-full mt-4">
                          {details.schedule.map((day, index) => (
                            <AccordionItem value={`item-${index}`} key={day.day}>
                                <AccordionTrigger className="font-poppins font-semibold text-lg">{day.day}</AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-4 pt-2">
                                        {day.items.map(item => (
                                          <li key={item.time} className="flex items-start gap-4 pl-4 border-l-2 border-accent">
                                              <p className="font-poppins font-semibold text-accent w-24">{item.time}</p>
                                              <p className="text-muted-foreground">{item.title}</p>
                                          </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                    </section>

                    {/* Location Section */}
                    <section id="location">
                         <h2 className="font-headline text-2xl font-bold">Location</h2>
                         <div className="mt-4 aspect-video w-full overflow-hidden rounded-xl border">
                             <Image src="https://picsum.photos/seed/maplocation/1200/600" alt="Event location map" width={1200} height={600} className="w-full h-full object-cover" data-ai-hint="street map" />
                         </div>
                    </section>

                     {/* Organizer Section */}
                    <section id="organizer">
                        <h2 className="font-headline text-2xl font-bold">Organizer</h2>
                        <Link href={`/organizers/${details.organizer.id}`} className="block group">
                            <Card className="mt-4 flex items-center gap-4 p-4 bg-card/50 group-hover:bg-accent/10 transition-colors">
                                <Avatar className="h-16 w-16 border">
                                    <AvatarImage src={details.organizer.logoUrl} alt={details.organizer.name}/>
                                    <AvatarFallback>{details.organizer.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="font-poppins font-semibold text-lg group-hover:text-accent">{details.organizer.name}</h3>
                                    <p className="text-sm text-muted-foreground">{details.organizer.description}</p>
                                </div>
                            </Card>
                        </Link>
                    </section>


                    {/* FAQs */}
                     <section id="faq">
                        <h2 className="font-headline text-2xl font-bold">Frequently Asked Questions</h2>
                         <Accordion type="single" collapsible className="w-full mt-4">
                          {details.faqs.map((faq, index) => (
                            <AccordionItem value={`item-${index}`} key={index}>
                                <AccordionTrigger className="font-poppins text-left">{faq.q}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground font-body leading-relaxed">
                                    {faq.a}
                                </AccordionContent>
                            </AccordionItem>
                          ))}
                        </Accordion>
                    </section>
                    
                     {/* Lost & Found Section */}
                     {details.lostAndFound && (
                        <section id="lost-and-found">
                            <h2 className="font-headline text-2xl font-bold">Lost &amp; Found</h2>
                            <Card className="mt-4 bg-card/50">
                                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                                    <div className="p-4 bg-accent/10 rounded-full">
                                        <Locate className="h-10 w-10 text-accent" />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-muted-foreground">
                                            The organizer has reported <strong className="text-foreground">{details.lostAndFound.itemsFound} lost items</strong>. If you believe one might be yours, please get in touch.
                                        </p>
                                    </div>
                                    <Button asChild>
                                        <a href={`mailto:${details.lostAndFound.contact}`}>Contact Organizer</a>
                                    </Button>
                                </CardContent>
                            </Card>
                        </section>
                    )}
                </div>
            </main>
        </div>
    </div>
  );
}


    