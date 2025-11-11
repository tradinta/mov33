import { notFound } from 'next/navigation';
import { organizersData, type Organizer } from '@/lib/organizers-data';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { EventCard } from '@/components/events/event-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Globe, Mail, Phone } from 'lucide-react';
import type { Metadata } from 'next';

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
    title: `${organizer.name} | Event Organizer | Mov33`,
    description: `Browse events hosted by ${organizer.name}. ${organizer.description}`,
  };
}


export default function OrganizerProfilePage({ params }: OrganizerProfilePageProps) {
    const organizer = organizersData.find(o => o.id === params.organizerId);

    if (!organizer) {
        notFound();
    }

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
            
            {/* Events Section */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h2 className="font-headline text-3xl font-bold mb-8">Events by {organizer.name}</h2>
                {organizer.events.length > 0 ? (
                     <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {organizer.events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border-2 border-dashed rounded-lg">
                        <p className="text-muted-foreground font-poppins">No upcoming events from {organizer.name} at the moment.</p>
                        <p className="text-sm text-muted-foreground/80 mt-2">Check back soon!</p>
                    </div>
                )}
            </section>
        </div>
    );
}
