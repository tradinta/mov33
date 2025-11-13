import { eventsData } from "@/lib/events-data";
import { EventCard } from "@/components/events/event-card";
import { Card, CardContent } from "../ui/card";
import Link from "next/link";
import Image from "next/image";
import { MapPin } from "lucide-react";

export function TrendingEvents() {
    const mainEvent = eventsData.find(e => e.id === 'sauti-sol-live');
    const sideEvents = eventsData.filter(e => ['safari-sevens', 'blankets-and-wine'].includes(e.id));
    
    if (!mainEvent) return null;

    return (
        <section>
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Now Trending</h2>
              <p className="mt-2 text-lg text-muted-foreground">The hottest events right now.</p>
            </div>

            <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
                {/* Main Event */}
                <div className="lg:col-span-1">
                    <Card className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 relative h-full">
                        <CardContent className="p-0 h-full">
                            <Link href={`/events/${mainEvent.id}`} className="block h-full">
                                <div className="relative aspect-[4/3] md:aspect-video lg:h-full w-full overflow-hidden">
                                    <Image
                                    src={mainEvent.image.imageUrl}
                                    alt={mainEvent.image.description}
                                    fill
                                    sizes="(max-width: 768px) 100vw, 50vw"
                                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                                    data-ai-hint={mainEvent.image.imageHint}
                                    priority
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                </div>
                                <div className="absolute bottom-0 left-0 p-6 space-y-2 text-white w-full">
                                    <div className="flex items-center text-sm text-white/90 font-body gap-1.5">
                                        <span className="font-bold text-accent">{mainEvent.date}</span>
                                    </div>
                                    <h3 className="font-headline text-2xl md:text-3xl font-bold text-white group-hover:text-accent transition-colors leading-tight">
                                    {mainEvent.name}
                                    </h3>
                                    <div className="flex items-center text-sm text-white/90 font-body gap-1.5">
                                        <MapPin className="h-4 w-4" />
                                        <span>{mainEvent.venue}, {mainEvent.location}</span>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                    </Card>
                </div>
                
                {/* Side Events */}
                <div className="lg:col-span-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-8">
                   {sideEvents.map(event => (
                     <Card key={event.id} className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 relative">
                        <CardContent className="p-0">
                            <Link href={`/events/${event.id}`} className="block">
                                <div className="sm:flex lg:flex-row">
                                     <div className="relative aspect-video sm:aspect-square lg:aspect-video w-full sm:w-1/2 lg:w-2/5 overflow-hidden">
                                        <Image
                                        src={event.image.imageUrl}
                                        alt={event.image.description}
                                        fill
                                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                                        data-ai-hint={event.image.imageHint}
                                        />
                                    </div>
                                    <div className="p-4 flex flex-col justify-center">
                                        <span className="text-xs font-semibold text-accent">{event.date}</span>
                                        <h3 className="font-headline text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-tight mt-1">
                                            {event.name}
                                        </h3>
                                        <div className="flex items-center text-xs text-muted-foreground font-body gap-1.5 mt-1">
                                            <MapPin className="h-3 w-3" />
                                            <span>{event.location}</span>
                                        </div>
                                         <p className="font-semibold text-base text-foreground mt-2">
                                            From KES {event.price}
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </CardContent>
                     </Card>
                   ))}
                </div>
            </div>
        </section>
    );
}
