import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { firestore } from '@/firebase';
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
import { ArrowRight, Loader2 } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay";
import { cn } from '@/lib/utils';
import { Event } from '@/lib/types';
import { motion } from 'framer-motion';

export function FeaturedEventsCarousel() {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [featuredEvents, setFeaturedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const plugin = useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const q = query(
          collection(firestore, 'events'),
          where('moderationStatus', '==', 'approved'),
          where('isFeatured', '==', true),
          limit(5)
        );
        const snap = await getDocs(q);
        setFeaturedEvents(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Event)));
      } catch (error) {
        console.error("Error fetching featured events:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  useEffect(() => {
    if (!api) return;
    setCurrent(api.selectedScrollSnap());
    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  if (loading) {
    return (
      <div className="w-full aspect-[21/9] bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 animate-pulse">
        <Loader2 className="h-8 w-8 animate-spin text-gold/50" />
      </div>
    );
  }

  if (featuredEvents.length === 0) return null;

  return (
    <div className="relative w-full group">
      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        opts={{
          align: 'start',
          loop: true,
        }}
        className="w-full"
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
      >
        <CarouselContent>
          {featuredEvents.map((event) => (
            <CarouselItem key={event.id}>
              <Card className="overflow-hidden border-none shadow-none rounded-3xl bg-transparent">
                <CardContent className="relative p-0 aspect-[21/9] md:aspect-[21/7]">
                  {event.imageUrl ? (
                    <Image
                      src={event.imageUrl}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority={featuredEvents.indexOf(event) === 0}
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-obsidian via-obsidian/80 to-gold/20" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />

                  <div className="absolute inset-0 flex flex-col justify-center p-8 md:p-16 lg:p-20 pt-16 md:pt-24">
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="max-w-3xl space-y-4 md:space-y-6"
                    >
                      <div className="flex flex-wrap items-center gap-3">
                        <Badge className="bg-gold text-obsidian font-black uppercase tracking-[0.2em] text-[10px] px-4 py-1.5 rounded-full border-none shadow-xl shadow-gold/20">
                          Featured Highlight
                        </Badge>
                        {event.isPremium && (
                          <Badge className="bg-white/10 backdrop-blur-md text-white border-white/10 font-black uppercase tracking-widest text-[9px] px-4 py-1.5 rounded-full">
                            Premium Experience
                          </Badge>
                        )}
                      </div>

                      <div className="space-y-4">
                        <h2 className="font-headline text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[0.9] italic uppercase tracking-tighter drop-shadow-2xl">
                          {event.title}
                        </h2>
                        <p className="text-white/70 text-sm md:text-base lg:text-lg max-w-xl line-clamp-2 font-poppins font-medium leading-relaxed">
                          {event.description}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-6 pt-2">
                        <Link href={`/events/${event.id}`}>
                          <Button className="bg-white text-obsidian hover:bg-gold hover:text-obsidian font-black uppercase tracking-widest rounded-2xl transition-all h-14 px-10 shadow-2xl hover:scale-105 active:scale-95 group/btn">
                            Secure Access <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover/btn:translate-x-1" />
                          </Button>
                        </Link>

                        <div className="hidden sm:flex flex-col">
                          <span className="text-[10px] uppercase font-black text-white/40 tracking-widest mb-0.5">Starting From</span>
                          <span className="text-xl font-black text-gold italic tracking-tighter font-headline">KES {(event.price || 0).toLocaleString()}</span>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
          <CarouselPrevious className="absolute left-6 top-1/2 -translate-y-1/2 bg-black/50 border-white/10 hover:bg-gold hover:text-obsidian h-12 w-12" />
          <CarouselNext className="absolute right-6 top-1/2 -translate-y-1/2 bg-black/50 border-white/10 hover:bg-gold hover:text-obsidian h-12 w-12" />
        </div>
      </Carousel>
      <div className="absolute bottom-6 right-12 z-10 flex gap-1.5">
        {featuredEvents.map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn(
              "h-1 px-3 rounded-full transition-all duration-300",
              current === index ? "bg-gold w-8" : "bg-white/20 hover:bg-white/40"
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
