import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/events-data";
import { ArrowRight } from "lucide-react";

export function EventCard({ event }: { event: Event }) {
  return (
    <Card className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1">
      <CardContent className="p-0">
        <Link href={`/events/${event.id}`} className="block">
          <div className="relative aspect-[4/3] w-full overflow-hidden">
            <Image
              src={event.image.imageUrl}
              alt={event.image.description}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={event.image.imageHint}
            />
          </div>
          <div className="p-5 space-y-3 flex flex-col flex-grow">
            <h3 className="font-headline text-xl font-bold truncate text-foreground group-hover:text-accent transition-colors">
              {event.name}
            </h3>
            <p className="text-sm text-muted-foreground font-body flex-grow min-h-[40px]">
              {event.description}
            </p>
            <div className="flex justify-between items-end font-poppins pt-2">
              <div>
                <span className="text-xs text-muted-foreground">From</span>
                <span className="block font-semibold text-xl text-accent">
                   KES {event.price}
                </span>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-accent" />
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
      <Skeleton className="h-56 w-full" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="flex justify-between items-end pt-4">
            <div className="w-1/3 space-y-1">
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-full" />
            </div>
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  );
}
