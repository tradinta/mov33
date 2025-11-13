
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Event } from "@/lib/events-data";
import { Archive, MapPin } from "lucide-react";
import { Badge } from "../ui/badge";

export function PastEventCard({ event }: { event: Event }) {
  
  return (
    <Card className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1 relative">
      <Badge variant="secondary" className="absolute top-3 left-3 z-10 font-poppins">
         <Archive className="mr-1.5 h-3 w-3" />
        Archived
      </Badge>

      <CardContent className="p-0">
        <Link href={`/archive/${event.id}`} className="block">
          <div className="relative aspect-[3/4] w-full overflow-hidden">
            <Image
              src={event.image.imageUrl}
              alt={event.image.description}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
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
             <p className="text-xs text-muted-foreground pt-1">{event.date}</p>
          </div>
        </Link>
      </CardContent>
    </Card>
  );
}

