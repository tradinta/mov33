
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { eventsData } from '@/lib/events-data';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"

export function FeaturedEventsCarousel() {
  // Get 3 random products to feature
  const featuredEvents = React.useMemo(() => {
    return eventsData.slice().sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true })
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {featuredEvents.map((event) => (
          <CarouselItem key={event.id}>
            <Card className="overflow-hidden border-none shadow-none rounded-2xl">
              <CardContent className="relative p-0 aspect-[16/9]">
                <Image
                  src={event.image.imageUrl}
                  alt={event.name}
                  fill
                  className="object-cover"
                  data-ai-hint={event.image.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Badge variant="secondary">Featured Event</Badge>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold mt-2 max-w-lg">
                    {event.name}
                  </h2>
                  <p className="mt-2 text-sm max-w-md">
                    {event.description}
                  </p>
                  <Link href={`/events/${event.id}`}>
                    <Button
                      variant="secondary"
                      className="mt-4 font-poppins"
                    >
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
    </Carousel>
  );
}
