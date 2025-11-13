
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
  type CarouselApi,
} from '@/components/ui/carousel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay"
import { cn } from '@/lib/utils';

export function FeaturedEventsCarousel() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [current, setCurrent] = React.useState(0)

  // Get 3 random products to feature
  const featuredEvents = React.useMemo(() => {
    return eventsData.slice().sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  )

  React.useEffect(() => {
    if (!api) {
      return
    }
 
    setCurrent(api.selectedScrollSnap())
 
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap())
    })
  }, [api])


  return (
    <div className="relative w-full">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
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
                    priority={featuredEvents.indexOf(event) === 0}
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
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-2 w-2 rounded-full bg-white/50 transition-all",
              current === index ? "w-4 bg-white" : "hover:bg-white/75"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
