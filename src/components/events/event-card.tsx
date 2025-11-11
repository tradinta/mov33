import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/events-data";
import { Calendar, MapPin, Tag } from "lucide-react";

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="overflow-hidden group shadow-md hover:shadow-2xl hover:shadow-accent/20 transition-all duration-300 ease-in-out hover:-translate-y-2 rounded-lg">
      <CardContent className="p-0 relative">
        <Link href={`/events/${event.id}`}>
          <div className="relative h-56 w-full">
            <Image
              src={event.image.imageUrl}
              alt={event.image.description}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={event.image.imageHint}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-2 right-2 flex gap-2">
              {event.tags.map(tag => (
                <Badge 
                  key={tag} 
                  variant={tag.toLowerCase() === 'vip' ? 'destructive' : 'secondary'}
                  className="font-poppins bg-opacity-80 backdrop-blur-sm"
                  style={tag.toLowerCase() === 'vip' ? {backgroundColor: 'hsl(var(--muted-gold))', color: 'white'} : {}}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
          <div className="p-4 bg-card text-card-foreground">
            <h3 className="font-headline text-xl font-bold truncate group-hover:text-accent">{event.name}</h3>
            <div className="mt-2 space-y-2 text-sm text-muted-foreground font-body">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>{event.location}</span>
              </div>
               <div className="flex items-center gap-2 font-poppins">
                <Tag className="h-4 w-4" />
                <span className="font-bold text-accent">KES {event.price}</span>
              </div>
            </div>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-56 w-full rounded-lg" />
      <div className="space-y-2 p-1">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-4 w-1/3" />
      </div>
    </div>
  );
}
