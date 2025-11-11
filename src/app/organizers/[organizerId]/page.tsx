import { notFound } from 'next/navigation';
import { organizersData, type Organizer } from '@/lib/organizers-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/event-card';
import { TourCard } from '@/components/tours/tour-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Mail, Phone, Ticket, Map } from 'lucide-react';
import type { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type OrganizerProfilePageProps = {
    params: { organizerId: string };
};

export async function generateMetadata({ params }: OrganizerProfilePageProps): Promise<Metadata> {
  const organizer = organizersData.find((o) => o.id === params.organizerId);

  if (!organizer) {
    return {
      title: "Organizer Not Found | Mov33",
    };
  }

  return {
    title: `${organizer.name} | Organizer | Mov33`,
    description: `Browse events and tours hosted by ${organizer.name}. ${organizer.description}`,
  };
}


export default function OrganizerProfilePage({ params }: OrganizerProfilePageProps) {
    const organizer = organizersData.find(o => o.id === params.organizerId);

    if (!organizer) {
        notFound();
    }

    const hasEvents = organizer.events.length > 0;
    const hasTours = organizer.tours.length > 0;
    const defaultTab = hasEvents ? "events" : "tours";

    return (
        <div className="bg-background text-foreground">
            {/* Hero Section */}
            <section className="bg-card/30 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center md:text-left md:flex md:items-center md:gap-8">
                    <Avatar className="w-32 h-32 mx-auto md:mx-0 border-4 border-accent shadow-lg">
                        <AvatarImage src={organizer.logoUrl} alt={organizer.name} />
                        <AvatarFallback>{organizer.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="mt-4 md:mt-0">
                        <h1 className="font-headline text-4xl md:text-5xl font-extrabold">{organizer.name}</h1>
                        <p className="mt-2 text-lg text-muted-foreground max-w-2xl mx-auto md:mx-0">{organizer.description}</p>
                        <div className="mt-4 flex justify-center md:justify-start gap-4 text-muted-foreground">
                             <div className="flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                <span>{organizer.name.toLowerCase().replace(/\s/g, '')}.com</span>
                            </div>
                             <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                <span>contact@{organizer.name.toLowerCase().replace(/\s/g, '')}.com</span>
                            </div>
                        </div>
                    </div>
                     <div className="mt-6 md:mt-0 md:ml-auto">
                        <Button className="font-poppins">Follow</Button>
                    </div>
                </div>
            </section>
            
            {/* Content Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                 <Tabs defaultValue={defaultTab} className="w-full">
                    <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                        {hasEvents && <TabsTrigger value="events">Events ({organizer.events.length})</TabsTrigger>}
                        {hasTours && <TabsTrigger value="tours">Tours ({organizer.tours.length})</TabsTrigger>}
                    </TabsList>
                    
                    {hasEvents && (
                        <TabsContent value="events">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
                                {organizer.events.map((event) => (
                                    <EventCard key={event.id} event={event} />
                                ))}
                            </div>
                        </TabsContent>
                    )}

                    {hasTours && (
                        <TabsContent value="tours">
                             <div className="space-y-12 mt-8">
                                {organizer.tours.map(tour => (
                                    <TourCard key={tour.id} tour={tour} />
                                ))}
                            </div>
                        </TabsContent>
                    )}
                </Tabs>


                {!hasEvents && !hasTours && (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground font-poppins">No upcoming activities from {organizer.name} at the moment.</p>
                        <p className="text-sm text-muted-foreground/80 mt-2">Check back soon!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
