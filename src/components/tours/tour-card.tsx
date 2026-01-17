'use client';

import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import type { Tour } from "@/lib/types";
import {
  Clock,
  Star,
  Users,
  ArrowUpRight,
  MapPin,
  Zap,
  Heart,
  ShieldCheck
} from "lucide-react";
import { Badge } from "../ui/badge";
import { motion } from "framer-motion";
import { GlassCard } from "../ui/glass-card";

export function TourCard({ tour }: { tour: Tour }) {
  const isPrivate = tour.privateBooking;

  return (
    <Link href={`/tours/${tour.id}`} className="block h-full group">
      <GlassCard className="h-full overflow-hidden border-black/5 dark:border-white/5 bg-background/40 dark:bg-obsidian/40 backdrop-blur-xl transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 flex flex-col">
        {/* Top Image Section */}
        <div className="relative aspect-[4/5] overflow-hidden">
          {tour.imageUrl ? (
            <Image
              src={tour.imageUrl}
              alt={tour.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-obsidian via-obsidian/80 to-gold/20" />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-transparent to-black/20" />

          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
            <Badge className="bg-black/20 dark:bg-white/10 backdrop-blur-md text-foreground dark:text-white border-black/10 dark:border-white/10 text-[9px] font-black uppercase tracking-widest h-7 px-3">
              <MapPin className="mr-1.5 h-3 w-3 text-gold" /> {tour.destination}
            </Badge>
            {tour.isFeatured && (
              <Badge className="bg-gold text-obsidian text-[8px] font-black uppercase tracking-widest h-6 border-none shadow-lg">
                <Zap className="mr-1 h-3 w-3" /> Trending
              </Badge>
            )}
          </div>

          <div className="absolute top-4 right-4 z-20">
            <button className="h-10 w-10 rounded-full bg-black/20 dark:bg-white/10 backdrop-blur-md border border-black/10 dark:border-white/10 flex items-center justify-center text-foreground dark:text-white hover:bg-gold hover:text-obsidian transition-all group/btn shadow-xl">
              <Heart className="h-4 w-4 transition-transform group-hover/btn:scale-110" />
            </button>
          </div>

          {/* Bottom Info Bar On Image */}
          <div className="absolute bottom-4 left-4 right-4 z-20 flex justify-between items-center bg-background/60 dark:bg-obsidian/60 backdrop-blur-md p-3 rounded-2xl border border-black/5 dark:border-white/5 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-gold" />
                <span className="text-[10px] font-black text-foreground/90 dark:text-white uppercase">{tour.duration}</span>
              </div>
              <div className="h-1 w-1 bg-black/20 dark:bg-white/20 rounded-full" />
              <div className="flex items-center gap-1.5">
                <Star className="h-3 w-3 text-gold fill-gold" />
                <span className="text-[10px] font-black text-foreground dark:text-white">{tour.rating}</span>
              </div>
            </div>
            {isPrivate && (
              <ShieldCheck className="h-4 w-4 text-gold/60" />
            )}
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-headline text-2xl font-black text-foreground dark:text-white leading-[1.1] tracking-tighter uppercase italic group-hover:text-gold transition-colors duration-300">
              {tour.name}
            </h3>

            <p className="text-muted-foreground font-poppins text-xs line-clamp-2 leading-relaxed opacity-60">
              {tour.description}
            </p>

            <div className="flex flex-wrap gap-2 pt-1">
              {tour.highlights?.slice(0, 2).map((h, i) => (
                <span key={i} className="text-[9px] font-black uppercase bg-black/5 dark:bg-white/5 px-2 py-1 rounded text-muted-foreground/60 dark:text-white/50 tracking-tighter">
                  • {h}
                </span>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-black/5 dark:border-white/5 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="text-[10px] uppercase font-black text-muted-foreground tracking-tight">
                Member's Expedition Rate
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black text-foreground dark:text-white italic tracking-tighter font-headline">
                  KES {(tour.price * 0.9).toLocaleString()}
                </span>
                <span className="text-[10px] text-muted-foreground line-through decoration-gold/50">
                  KES {tour.price.toLocaleString()}
                </span>
              </div>
            </div>

            <div className="h-12 w-12 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 flex items-center justify-center group-hover:bg-gold group-hover:text-obsidian transition-all duration-500 rotate-45 group-hover:rotate-0 shadow-lg group-hover:shadow-gold/20">
              <ArrowUpRight className="h-6 w-6 -rotate-45 group-hover:rotate-0 transition-transform duration-500 text-foreground dark:text-white group-hover:text-obsidian" />
            </div>
          </div>
        </div>
      </GlassCard>
    </Link>
  );
}

export function TourCardSkeleton() {
  return (
    <GlassCard className="h-[500px] overflow-hidden border-white/5 bg-white/[0.02] flex flex-col animate-pulse">
      <Skeleton className="aspect-[4/5] w-full bg-white/5" />
      <div className="p-6 space-y-4 flex-1">
        <Skeleton className="h-4 w-1/3 bg-white/5" />
        <Skeleton className="h-10 w-full bg-white/5" />
        <Skeleton className="h-12 w-full bg-white/5" />
        <div className="pt-4 mt-auto">
          <Skeleton className="h-12 w-full bg-white/5 rounded-2xl" />
        </div>
      </div>
    </GlassCard>
  );
}
