
'use client';

import { notFound, useRouter } from 'next/navigation';
import { eventsData, type Event } from '@/lib/events-data';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft,
  Calendar, 
  MapPin, 
  Rocket
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ImageGallery } from '@/components/events/image-gallery';
import Link from 'next/link';
import { MainLayout } from '@/components/layout/main-layout';

// Dummy gallery data - in a real app this would be fetched
const eventGalleries = {
  "sauti-sol-live": [
    { id: "gallery-1", imageUrl: "https://picsum.photos/seed/sautisol1/800/600", description: "Sauti Sol on stage", imageHint: "band stage" },
    { id: "gallery-2", imageUrl: "https://picsum.photos/seed/sautisol2/800/600", description: "Cheering fans", imageHint: "concert fans" },
    { id: "gallery-3", imageUrl: "https://picsum.photos/seed/sautisol3/800/600", description: "Fireworks over the stage", imageHint: "concert fireworks" },
  ],
   "blankets-and-wine": [
    { id: "gallery-1", imageUrl: "https://picsum.photos/seed/bnw1/800/600", description: "Friends enjoying the festival", imageHint: "festival friends" },
    { id: "gallery-2", imageUrl: "https://picsum.photos/seed/bnw2/800/600", description: "Artist performing on stage", imageHint: "artist stage" },
  ],
};


type EventArchivePageProps = {
  params: { id: string };
};

export default function EventArchivePage({ params }: EventArchivePageProps) {
  const event = eventsData.find((e) => e.id === params.id);
  const gallery = eventGalleries[params.id as keyof typeof eventGalleries] || [event?.image].filter(Boolean) as any[];

  if (!event) {
    notFound();
  }

  return (
    <MainLayout>
        <div className="bg-background text-foreground">
            <ImageGallery gallery={gallery} />

            <div className="container mx-auto px-4 py-8">
                <main className="max-w-4xl mx-auto">
                    <div className="space-y-12">
                        {/* Event Header */}
                        <header>
                             <div className="flex items-center gap-2">
                               <Badge variant="outline">Archived Event</Badge>
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
                        </header>
                        
                         {/* About Section */}
                        <section id="about">
                            <h2 className="font-headline text-2xl font-bold">About The Event</h2>
                            <div className="mt-4 prose prose-invert max-w-none text-muted-foreground font-body leading-relaxed">
                            <p>{event.description}</p>
                            </div>
                        </section>

                        <section className="text-center py-12 border-2 border-dashed rounded-lg bg-card/30">
                            <h2 className="font-headline text-2xl font-bold">Missed Out?</h2>
                            <p className="mt-2 text-muted-foreground max-w-md mx-auto">
                                Don't let the next great experience pass you by. Check out our upcoming events and be part of the story.
                            </p>
                            <Button asChild size="lg" className="mt-6 font-poppins text-lg">
                                <Link href="/events">
                                    <Rocket className="mr-2 h-5 w-5"/> Explore Upcoming Events
                                </Link>
                            </Button>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    </MainLayout>
  );
}
