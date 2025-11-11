import { notFound } from 'next/navigation';
import { eventsData, type Event } from '@/lib/events-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Calendar, 
  ChevronRight, 
  Clock, 
  Heart, 
  MapPin, 
  Share2, 
  Star, 
  Ticket,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

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
      name: "Kenya Rugby Union",
      logoUrl: "https://picsum.photos/seed/kru/100/100",
      description: "The official governing body of rugby in Kenya.",
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
    tickets: [
        { tier: "Early Bird", price: 1500, perks: ["Full weekend pass", "Access to all group matches"], status: "Sold Out" },
        { tier: "Advance", price: 2500, perks: ["Full weekend pass", "Access to all matches including finals"], status: "Available" },
        { tier: "VIP", price: 7500, perks: ["Express entry", "Access to VIP lounge", "Complimentary drinks & snacks"], status: "Available" },
        { tier: "Premium VIP", price: 15000, perks: ["All VIP perks", "Meet & Greet with players", "Exclusive merchandise"], status: "Almost Gone" },
    ]
  },
  // Add other event details here...
  "sauti-sol-live": {
     gallery: [
      PlaceHolderImages.find(p => p.id === 'hero-1')!,
      { id: "gallery-1", imageUrl: "https://picsum.photos/seed/sautisol1/600/400", description: "Sauti Sol on stage", imageHint: "band stage" },
      { id: "gallery-2", imageUrl: "https://picsum.photos/seed/sautisol2/600/400", description: "Cheering fans", imageHint: "concert fans" },
      { id: "gallery-3", imageUrl: "https://picsum.photos/seed/sautisol3/600/400", description: "Fireworks over the stage", imageHint: "concert fireworks" },
    ],
    about: "Join Kenya's biggest Afro-pop band, Sauti Sol, for their final homecoming concert. Celebrate a decade of incredible music, iconic hits, and unforgettable performances. This will be a night to remember, filled with energy, dancing, and a journey through their greatest hits.",
     organizer: {
      name: "Mov33 Presents",
      logoUrl: "https://picsum.photos/seed/mov33/100/100",
      description: "Curators of premium live experiences in Kenya.",
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
     tickets: [
        { tier: "Advance", price: 5000, perks: ["Full access to the concert grounds"], status: "Available" },
        { tier: "VIP", price: 15000, perks: ["Express entry", "Access to VIP lounge with private bar", "Premium viewing area"], status: "Available" },
        { tier: "VVIP", price: 30000, perks: ["All VIP perks", "Meet & Greet with Sauti Sol", "Signed merchandise"], status: "Almost Gone" },
    ]
  }
};


type EventDetailPageProps = {
  params: { id: string };
};

export default function EventDetailPage({ params }: EventDetailPageProps) {
  const event = eventsData.find((e) => e.id === params.id);
  const details = eventDetails[params.id as keyof typeof eventDetails] || eventDetails['safari-sevens']; // Fallback to default details

  if (!event) {
    notFound();
  }
  
  const [dayOfWeek, datePart] = event.date.split(',');
  const [day, month] = datePart?.trim().split(' ') || ["", ""];

  return (
    <div className="bg-background text-foreground">
        {/* Main Grid Layout */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,450px] gap-12 px-4 py-8">
            {/* Left Column: Event Info */}
            <main className="order-2 lg:order-1">
                <div className="space-y-12">
                    {/* Event Header */}
                    <header>
                        <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-foreground">
                            {event.name}
                        </h1>
                        <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-2 text-muted-foreground font-poppins">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-accent" />
                                <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-accent" />
                                <span>{event.location}</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                            {event.tags.map(tag => (
                                <Badge key={tag} variant="secondary" className="font-poppins">{tag}</Badge>
                            ))}
                        </div>
                    </header>

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

                </div>
            </main>

            {/* Right Column: Image & Tickets */}
            <aside className="order-1 lg:order-2">
                <div className="sticky top-24 space-y-6">
                    {/* Image */}
                    <Card className="overflow-hidden border-0 shadow-2xl shadow-black/30">
                      <div className="relative aspect-square w-full">
                          <Image
                              src={event.image.imageUrl}
                              alt={event.name}
                              fill
                              priority
                              className="object-cover"
                              data-ai-hint={event.image.imageHint}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                          <div className="absolute top-3 right-3 flex gap-2">
                              <Button variant="ghost" size="icon" className="rounded-full bg-background/70 hover:bg-background h-10 w-10">
                                <Share2 className="h-5 w-5 text-foreground" />
                              </Button>
                              <Button variant="ghost" size="icon" className="rounded-full bg-background/70 hover:bg-background h-10 w-10">
                                <Heart className="h-5 w-5 text-foreground" />
                              </Button>
                          </div>
                      </div>
                    </Card>

                    {/* Ticket Cards */}
                    <Card className="bg-card/50 backdrop-blur-lg">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Book Your Tickets</CardTitle>
                            <CardDescription>Select a tier to proceed.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {details.tickets.map(ticket => (
                                <button key={ticket.tier} disabled={ticket.status === 'Sold Out'} className="w-full text-left">
                                <Card  className="bg-background/70 hover:bg-background hover:ring-2 hover:ring-accent transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:ring-0">
                                    <CardHeader className="flex flex-row items-center justify-between p-4">
                                        <div>
                                            <h4 className="font-poppins font-semibold text-lg">{ticket.tier}</h4>
                                             {ticket.status === 'Sold Out' && <Badge variant="destructive" className="mt-1">Sold Out</Badge>}
                                             {ticket.status === 'Almost Gone' && <Badge variant="outline" className="mt-1 border-amber-500 text-amber-500">Almost Gone</Badge>}
                                        </div>
                                        <p className="font-headline text-xl font-bold text-accent">KES {ticket.price.toLocaleString()}</p>
                                    </CardHeader>
                                </Card>
                                </button>
                            ))}
                        </CardContent>
                    </Card>
                </div>
            </aside>
        </div>
    </div>
  );
}
