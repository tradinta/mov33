"use client";

import Image from 'next/image';
import { Tour } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, MapPin, Users, Award } from 'lucide-react';
import { ImageGallery } from '@/components/events/image-gallery';
import { cn } from '@/lib/utils';

interface TourDetailHeroProps {
    tour: Tour;
}

export function TourDetailHero({ tour }: TourDetailHeroProps) {
    return (
        <section className="bg-obsidian border-b border-white/5 pb-12">
            {tour.gallery && tour.gallery.length > 0 ? (
                <ImageGallery gallery={tour.gallery.map((url, i) => ({ id: `tg-${i}`, imageUrl: url }))} />
            ) : (
                <div className="h-[40vh] md:h-[60vh] relative overflow-hidden">
                    <Image
                        src={tour.imageUrl || 'https://images.unsplash.com/photo-1533105079780-92b9be482077'}
                        fill
                        alt={tour.name}
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                </div>
            )}

            <div className="container mx-auto px-4 md:px-12 py-10 space-y-8">
                <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-gold text-obsidian font-black uppercase tracking-widest text-[9px] py-1 px-3 rounded-full">
                        {tour.destination}
                    </Badge>
                    {tour.isPremium && (
                        <Badge className="bg-white/10 text-white/60 border-white/5 font-black uppercase tracking-widest text-[9px] py-1 px-3 rounded-full">
                            <Award className="mr-1.5 h-3 w-3" />
                            Premium Expedition
                        </Badge>
                    )}
                </div>

                <h1 className="font-headline text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.9] max-w-4xl">
                    {tour.name}
                </h1>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-4">
                    <div className="flex items-center gap-3 bg-white/5 py-2 px-4 rounded-xl border border-white/5">
                        <Star className="h-4 w-4 text-gold fill-gold" />
                        <span className="font-black text-sm text-white italic tracking-tight">{tour.rating}</span>
                        <span className="text-[10px] font-black uppercase tracking-widest text-white/30">({tour.reviews} Reviews)</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                            <Clock className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase text-white/30 tracking-widest">Duration</div>
                            <div className="text-xs font-bold text-white uppercase">{tour.duration}</div>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                            <Users className="h-4 w-4" />
                        </div>
                        <div>
                            <div className="text-[9px] font-black uppercase text-white/30 tracking-widest">Capacity</div>
                            <div className="text-xs font-bold text-white uppercase">Up to {tour.maxGuests} Guests</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

