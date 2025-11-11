import { notFound } from 'next/navigation';
import { eventsData } from '@/lib/events-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { EventCard } from '@/components/events/event-card';
import {
  Calendar,
  Clock,
  MapPin,
  Tag,
  Users,
  Share2,
  Heart,
  Music,
  CalendarPlus,
  Info,
  ChevronRight,
  Ticket as TicketIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { StickyTicketbar } from '@/components/events/sticky-ticket-bar';
import { ImageGallery } from '@/components/events/image-gallery';

export async function generateStaticParams() {
  return eventsData.map((event) => ({
    id: event.id,
  }));
}

// Dummy data - in a real app, this would come from your event data
const detailedEventData = {
  gallery: [
    PlaceHolderImages.find(p => p.id === 'hero-1')!,
    PlaceHolderImages.find(p => p.id === 'discover-events')!,
    {
      id: 'crowd-shot',
      description: 'Excited crowd at a previous Sauti Sol concert',
      imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1974&auto=format&fit=crop',
      imageHint: 'concert crowd'
    }
  ],
  artists: [
    { name: 'Sauti Sol', genre: 'Afro-Pop', image: {imageUrl: "https://picsum.photos/seed/101/100/100", imageHint:"person portrait", description:"Sauti Sol"} },
    { name: 'Nviiri The Storyteller', genre: 'Afro-Fusion', image: {imageUrl: "https://picsum.photos/seed/102/100/100", imageHint:"person portrait", description:"Nviiri"} },
    { name: 'Bensoul', genre: 'Soulful RnB', image: {imageUrl: "https://picsum.photos/seed/103/100/100", imageHint:"person portrait", description:"Bensoul"} },
  ],
  schedule: [
    { time: '6:00 PM', activity: 'Doors Open & DJ Set' },
    { time: '7:30 PM', activity: 'Opening Act: Bensoul' },
    { time: '8:15 PM', activity: 'Special Guest: Nviiri' },
    { time: '9:00 PM', activity: 'Headline: Sauti Sol' },
    { time: '11:00 PM', activity: 'Afterparty with DJ Schwaz' },
  ],
  faqs: [
      { q: "What are the age restrictions?", a: "This event is strictly 18+. Proof of age will be required at the entrance." },
      { q: "Is parking available?", a: "Yes, ample and secure parking is available at the venue for a flat fee of KES 500." },
      { q: "Can I bring my own food and drinks?", a: "No outside food or drinks are allowed. A wide variety of food and beverage options will be available for purchase inside." },
      { q: "What happens if it rains?", a: "The event will proceed rain or shine. The main stage area is covered." }
  ],
   location: {
    name: "Uhuru Gardens National Monument",
    address: "Langata Road, Nairobi, Kenya",
    lat: -1.3323,
    lng: 36.7941,
  },
  ticketTiers: [
    { name: "Early Bird", price: "3,500", benefits: "General admission, available for a limited time.", soldOut: true },
    { name: "Advance", price: "5,000", benefits: "Standard general admission.", soldOut: false },
    { name: "Gate", price: "6,000", benefits: "General admission purchased at the event entrance.", soldOut: false },
    { name: "VIP", price: "12,000", benefits: "Express entry, premium viewing area, dedicated bar, and exclusive washrooms.", soldOut: false },
  ]
};

export default function EventDetailPage({ params }: { params: { id: string } }) {
  const event = eventsData.find((p) => p.id === params.id);
  const alsoLikeEvents = eventsData.filter(e => e.id !== params.id && e.tags.some(t => event?.tags.includes(t))).slice(0, 5);


  if (!event) {
    notFound();
  }

  return (
    <>
      <div className="bg-background text-foreground">
        <ImageGallery gallery={detailedEventData.gallery} />

        <StickyTicketbar eventName={event.name} ticketPrice={event.price} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              <header>
                  <div className="flex items-center gap-4 mb-4">
                      {event.tags.map(tag => (
                          <Badge key={tag} variant={tag.toLowerCase() === 'vip' ? 'default' : 'secondary'} className="font-poppins bg-accent text-accent-foreground">{tag}</Badge>
                      ))}
                  </div>
                <h1 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tight">{event.name}</h1>
                <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-lg text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    <span className="font-poppins font-medium">{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-accent" />
                    <span className="font-poppins font-medium">{event.location}</span>
                  </div>
                </div>
              </header>

              <section>
                <h2 className="font-headline text-3xl font-bold border-b pb-3 mb-4">About This Event</h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Join us for an unforgettable night with Kenya's biggest Afro-pop band, Sauti Sol, as they light up the stage at the iconic Uhuru Gardens. Get ready to sing along to all your favorite hits, from "Sura Yako" to "Midnight Train". This electrifying concert experience will feature state-of-the-art sound and lighting, special guest performances from Sol Generation artists Nviiri The Storyteller and Bensoul, and an atmosphere you won't want to miss. Come and be part of a magical night celebrating the best of Kenyan music!
                </p>
              </section>
              
              <section>
                <h2 className="font-headline text-3xl font-bold border-b pb-3 mb-6">Artist Lineup</h2>
                <div className="space-y-6">
                  {detailedEventData.artists.map(artist => (
                      <div key={artist.name} className="flex items-center gap-4 bg-card p-4 rounded-xl shadow-sm hover:bg-secondary/50 transition-colors">
                          <Avatar className="h-16 w-16 border-2 border-accent">
                              <AvatarImage src={artist.image.imageUrl} alt={artist.name} data-ai-hint={artist.image.imageHint} />
                              <AvatarFallback>{artist.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                              <h3 className="font-poppins font-bold text-lg text-foreground">{artist.name}</h3>
                              <p className="text-muted-foreground flex items-center gap-2"><Music className="h-4 w-4"/>{artist.genre}</p>
                          </div>
                      </div>
                  ))}
                </div>
              </section>

              <section>
                  <h2 className="font-headline text-3xl font-bold border-b pb-3 mb-6">Event Schedule</h2>
                  <div className="space-y-4">
                      {detailedEventData.schedule.map((item, index) => (
                      <div key={index} className="flex items-center gap-4">
                          <div className="flex flex-col items-center">
                              <div className="bg-accent text-accent-foreground rounded-full h-8 w-8 flex items-center justify-center font-bold font-poppins text-sm">{index + 1}</div>
                              {index < detailedEventData.schedule.length - 1 && <div className="w-px h-8 bg-border"></div>}
                          </div>
                          <div className="bg-card p-4 rounded-xl flex-1 shadow-sm">
                              <p className="font-poppins font-semibold text-foreground">{item.activity}</p>
                              <p className="text-sm text-muted-foreground flex items-center gap-2"><Clock className="h-4 w-4"/>{item.time}</p>
                          </div>
                      </div>
                      ))}
                  </div>
              </section>
              
              <section>
                <h2 className="font-headline text-3xl font-bold border-b pb-3 mb-6">Frequently Asked Questions</h2>
                <Accordion type="single" collapsible className="w-full">
                  {detailedEventData.faqs.map((faq, i) => (
                      <AccordionItem value={`item-${i}`} key={i}>
                          <AccordionTrigger className="font-poppins font-semibold text-lg hover:no-underline">{faq.q}</AccordionTrigger>
                          <AccordionContent className="text-base text-muted-foreground leading-relaxed">
                          {faq.a}
                          </AccordionContent>
                      </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>

            <aside className="lg:col-span-1 space-y-8 sticky top-24 h-fit">
               <div className="bg-card rounded-2xl shadow-lg border border-border/50">
                  <div className="p-6">
                      <h3 className="font-headline text-2xl font-bold mb-4">Get Your Tickets</h3>
                      <div className="space-y-4">
                          {detailedEventData.ticketTiers.map(tier => (
                              <div key={tier.name} className={`p-4 rounded-lg border-2 ${tier.name === "VIP" ? 'border-accent bg-accent/5' : 'border-border'}`}>
                                  <div className="flex justify-between items-start">
                                      <div>
                                          <h4 className="font-poppins font-bold text-lg">{tier.name}</h4>
                                          <p className="text-sm text-muted-foreground">{tier.benefits}</p>
                                      </div>
                                      <p className="font-poppins font-bold text-lg text-accent whitespace-nowrap">KES {tier.price}</p>
                                  </div>
                                  <Button className="w-full mt-4" disabled={tier.soldOut}>
                                      {tier.soldOut ? 'Sold Out' : 'Select Ticket'}
                                  </Button>
                              </div>
                          ))}
                      </div>
                  </div>
                   <div className="bg-secondary/50 p-4 rounded-b-2xl border-t">
                       <Button variant="ghost" className="w-full justify-center gap-2 text-muted-foreground hover:text-foreground">
                          <Share2 className="h-4 w-4"/> Share Event
                       </Button>
                   </div>
              </div>

              <div className="bg-card rounded-2xl shadow-lg border border-border/50 overflow-hidden">
                  <div className="relative h-48 w-full">
                      <Image src="https://picsum.photos/seed/map/600/400" alt="Map to venue" layout="fill" objectFit="cover" data-ai-hint="city map" />
                      <div className="absolute inset-0 bg-black/40"></div>
                       <div className="absolute top-4 left-4 text-white">
                          <h3 className="font-headline text-xl font-bold">{detailedEventData.location.name}</h3>
                          <p className="text-sm">{detailedEventData.location.address}</p>
                      </div>
                  </div>
                  <div className="p-4">
                      <Button variant="outline" className="w-full">
                          Get Directions
                          <ChevronRight className="h-4 w-4 ml-2"/>
                      </Button>
                  </div>
              </div>
            </aside>
          </div>
        </div>

        <section className="bg-secondary/30 py-16">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-center font-headline text-3xl font-bold mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {alsoLikeEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
