
import { eventsData } from "@/lib/events-data";
import { PastEventCard } from "@/components/archive/past-event-card";
import { MainLayout } from "@/components/layout/main-layout";
import { Archive } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Event Archive | Mov33',
    description: 'Relive the moments from our past events and tours. Browse galleries and see what you missed.',
};

export default function ArchivePage() {
    // In a real app, you'd fetch only past events. Here we filter them.
    const pastEvents = eventsData.filter(event => new Date(event.date) < new Date());

    return (
        <MainLayout>
            <div className="bg-background">
                <section className="bg-card/30 border-b">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                        <Archive className="mx-auto h-16 w-16 text-accent" />
                        <h1 className="font-headline text-4xl md:text-5xl font-extrabold mt-4">Event Archive</h1>
                        <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                            A look back at the unforgettable moments we've shared. Relive your favorite events and discover what you've missed.
                        </p>
                    </div>
                </section>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {pastEvents.map(event => (
                            <PastEventCard key={event.id} event={event} />
                        ))}
                        {pastEvents.length === 0 && (
                            <p className="col-span-full text-center text-muted-foreground">No past events in the archive yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
