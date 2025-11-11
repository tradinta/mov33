"use client";

import Image from 'next/image';
import type { Tour } from '@/lib/tours-data';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Users } from 'lucide-react';
import { ImageGallery } from '@/components/events/image-gallery';

interface TourDetailHeroProps {
  tour: Tour;
}

export function TourDetailHero({ tour }: TourDetailHeroProps) {
  return (
    <section className="bg-card border-b">
        <ImageGallery gallery={tour.gallery} />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <Badge className="bg-accent text-accent-foreground font-poppins mb-4">{tour.destination}</Badge>
            <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-foreground">
                {tour.name}
            </h1>
            <div className="mt-4 flex flex-wrap items-center gap-x-6 gap-y-3 text-muted-foreground font-poppins">
                <div className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-amber-500" />
                    <span className="font-semibold text-foreground">{tour.rating}</span>
                    <span>({tour.reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-2">
                    <Clock className="h-5 w-5 text-accent" />
                    <span>{tour.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    <span>Up to 6 people</span>
                </div>
            </div>
        </div>
    </section>
  );
}
