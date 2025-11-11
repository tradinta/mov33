import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/events-data";
import { Heart, MapPin } from "lucide-react";
import { Button } from "../ui/button";

export function EventCard({ event }: { event: Event }) {
  const [dayOfWeek, datePart] = event.date.split(',');
  const [day, month] = datePart?.trim().split(' ') || ["", ""];
  
  return (
    <Card className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 relative">
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <Button variant="ghost" size="icon" className="rounded-full bg-background/70 hover:bg-background h-8 w-8">
          <Heart className="h-4 w-4 text-foreground" />
          <span className="sr-only">Bookmark event</span>
        </Button>
      </div>

      <div className="absolute top-3 left-3 z-10 bg-background/80 rounded-lg p-2 text-center w-14 shadow-md backdrop-blur-sm">
        <span className="block text-[10px] uppercase text-foreground/80 leading-none font-poppins">{dayOfWeek}</span>
        <span className="block font-bold text-base text-accent leading-none font-headline">{day}</span>
        <span className="block text-[10px] uppercase text-foreground/80 leading-none font-poppins">{month}</span>
      </div>

      <CardContent className="p-0">
        <Link href={`/events/${event.id}`} className="block">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={event.image.imageUrl}
              alt={event.image.description}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={event.image.imageHint}
            />
             <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
          </div>
          <div className="absolute bottom-0 left-0 p-4 space-y-1 text-white w-full">
            <h3 className="font-headline text-lg font-bold text-white group-hover:text-accent transition-colors leading-tight">
              {event.name}
            </h3>
             <div className="flex items-center text-xs text-white/90 font-body gap-1.5">
                <MapPin className="h-3 w-3" />
                <span>{event.venue}, {event.location}</span>
            </div>
            <div className="flex justify-between items-end font-poppins pt-2">
                <span className="block font-semibold text-base text-accent">
                   KES {event.price}
                </span>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="space-y-3 rounded-xl border bg-card p-0 shadow-sm overflow-hidden">
      <Skeleton className="aspect-[3/4] w-full" />
    </div>
  );
}
