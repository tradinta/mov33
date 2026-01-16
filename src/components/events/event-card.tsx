'use client';

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { Event } from "@/lib/types";
import { Heart, MapPin } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export function EventCard({ event }: { event: Event }) {
  // Handle Firestore Timestamp or Date object
  const eventDate = event.date?.toDate ? event.date.toDate() : new Date();
  const dayOfWeek = format(eventDate, 'EEE').toUpperCase();
  const day = format(eventDate, 'dd');
  const month = format(eventDate, 'MMM').toUpperCase();

  const isSoldOut = event.ticketsSold >= event.capacity && event.capacity > 0;
  const price = event.price || 0;

  return (
    <Link href={`/events/${event.id}`} className="block h-full group">
      <Card className="h-full overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-0">
        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {event.imageUrl ? (
            <Image
              src={event.imageUrl}
              alt={event.title}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-800 dark:to-zinc-700" />
          )}

          {/* Gradient Overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Floating Calendar Badge - Top Left */}
          <div className="absolute top-4 left-4 z-20">
            <div className="bg-white dark:bg-zinc-800 rounded-xl px-3 py-2 text-center shadow-lg min-w-[54px]">
              <span className="block text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wide">{dayOfWeek}</span>
              <span className="block font-bold text-2xl text-orange-500 leading-none my-0.5">{day}</span>
              <span className="block text-[9px] uppercase font-bold text-zinc-500 dark:text-zinc-400 tracking-wide">{month}</span>
            </div>
          </div>

          {/* Bookmark Heart - Top Right */}
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              className="h-10 w-10 rounded-full bg-white dark:bg-zinc-800 flex items-center justify-center shadow-lg hover:scale-110 transition-transform"
            >
              <Heart className="h-5 w-5 text-zinc-400 hover:text-red-500 transition-colors" />
            </button>
          </div>

          {/* Sold Out Badge */}
          {isSoldOut && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
              <Badge className="bg-red-500 text-white border-none text-xs font-bold uppercase">
                Sold Out
              </Badge>
            </div>
          )}

          {/* Content Overlay - Bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
            {/* Event Title */}
            <h3 className="font-bold text-xl text-white leading-tight mb-2 line-clamp-2">
              {event.title}
            </h3>

            {/* Location */}
            <div className="flex items-center gap-1.5 text-white/80 text-sm mb-3">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>

            {/* Price */}
            <div className="text-orange-500 font-bold text-lg">
              {price === 0 ? 'KES Free' : `KES ${price.toLocaleString()}`}
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function EventCardSkeleton() {
  return (
    <Card className="h-[400px] overflow-hidden bg-white dark:bg-zinc-900 rounded-2xl border-0 animate-pulse">
      <div className="relative aspect-[4/5]">
        <Skeleton className="absolute inset-0 bg-zinc-200 dark:bg-zinc-800" />
        <div className="absolute top-4 left-4">
          <Skeleton className="w-14 h-16 rounded-xl bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="absolute top-4 right-4">
          <Skeleton className="w-10 h-10 rounded-full bg-zinc-300 dark:bg-zinc-700" />
        </div>
        <div className="absolute bottom-4 left-4 right-4 space-y-2">
          <Skeleton className="h-6 w-3/4 bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-4 w-1/2 bg-zinc-300 dark:bg-zinc-700" />
          <Skeleton className="h-5 w-1/3 bg-zinc-300 dark:bg-zinc-700" />
        </div>
      </div>
    </Card>
  );
}
