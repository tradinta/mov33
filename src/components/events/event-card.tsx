import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/events-data";
import { Calendar, MapPin, Ticket } from "lucide-react";

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="group overflow-hidden rounded-xl border-border/60 shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1">
      <CardContent className="p-0 relative">
        <Link href={`/events/${event.id}`} className="block">
          <div className="relative h-56 w-full overflow-hidden">
            <Image
              src={event.image.imageUrl}
              alt={event.image.description}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={event.image.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
            <div className="absolute top-3 right-3 flex gap-2">
              {event.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={tag.toLowerCase() === 'vip' ? 'default' : 'secondary'}
                  className="font-poppins text-xs backdrop-blur-sm"
                  style={tag.toLowerCase() === 'vip' ? {backgroundColor: 'hsl(var(--muted-gold))', color: 'hsl(var(--deep-blue-foreground))', border: 'none'} : {}}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="p-4 space-y-3">
            <h3 className="font-headline text-lg font-bold truncate text-foreground group-hover:text-accent transition-colors">
              {event.name}
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground font-body">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-accent" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-accent" />
                <span>{event.location}</span>
              </div>
            </div>
             <div className="flex items-center gap-2 font-poppins pt-2">
              <Ticket className="h-4 w-4 text-accent/80" />
              <span className="font-semibold text-accent">
                {event.price === "Free" ? "Free Entry" : `From KES ${event.price}`}
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
    <div className="space-y-3 rounded-xl border bg-card p-4 shadow-sm">
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="space-y-3 pt-2">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-4 w-1/4 mt-2" />
      </div>
    </div>
  );
}
