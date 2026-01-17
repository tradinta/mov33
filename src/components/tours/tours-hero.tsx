'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Map, Search, Compass, MapPin } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

interface ToursHeroProps {
  onSearch?: (query: string) => void;
}

export function ToursHero({ onSearch }: ToursHeroProps) {
  const heroImage = PlaceHolderImages.find(p => p.id === 'tour-hero');
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    if (onSearch) onSearch(val);
  };

  return (
    <section className="relative h-[80vh] w-full flex items-center justify-center overflow-hidden bg-background dark:bg-obsidian">
      {/* Immersive Background */}
      <motion.div
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover opacity-60 dark:opacity-40"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
      </motion.div>

      {/* Modern Gradient Overlays */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-b from-background/20 dark:from-obsidian/20 via-transparent to-background dark:to-obsidian" />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background/40 dark:from-obsidian/40 via-transparent to-background/40 dark:to-obsidian/40" />

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-background dark:from-obsidian to-transparent z-[2]" />

      <div className="relative z-20 text-center container mx-auto px-4 max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 text-[10px] font-black uppercase tracking-[0.3em] text-gold mx-auto">
            <Compass className="h-4 w-4 animate-spin-slow" />
            Explore the Unseen Kenya
          </div>

          <h1 className="font-headline text-6xl md:text-8xl lg:text-9xl font-black uppercase tracking-[calc(-0.05em)] italic text-foreground dark:text-white leading-[0.9] drop-shadow-2xl">
            Wild <span className="text-gold">Expeditions</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-muted-foreground dark:text-white/70 max-w-2xl mx-auto font-poppins leading-relaxed">
            From the golden plains of Maasai Mara to the ancient ruins of Lamu.
            Curated journeys designed for the bold and the curious.
          </p>

          {/* Search Bar Masterpiece */}
          <div className="mt-12 mx-auto max-w-2xl bg-black/5 dark:bg-white/5 backdrop-blur-2xl p-2 rounded-[2rem] border border-black/10 dark:border-white/10 shadow-2xl flex flex-col md:flex-row items-center gap-2 transition-all hover:border-gold/30">
            <div className="relative w-full h-14 md:h-16 flex items-center px-6">
              <Search className="h-5 w-5 text-gold mr-4" />
              <Input
                placeholder="Where will your spirit take you? (e.g. Mara, Diani)"
                className="border-0 bg-transparent focus-visible:ring-0 text-base md:text-lg text-foreground dark:text-white font-bold placeholder:text-muted-foreground/40 dark:placeholder:text-white/20 placeholder:font-medium p-0"
                value={query}
                onChange={handleSearch}
              />
            </div>
            <Button className="w-full md:w-48 h-14 md:h-16 bg-gold hover:bg-gold/90 text-obsidian rounded-[1.8rem] font-black uppercase text-xs tracking-widest transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-gold/20">
              Find Tours
            </Button>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8 mt-12 opacity-80 dark:opacity-40">
            {['Maasai Mara', 'Amboseli', 'Diani Beach', 'Mount Kenya'].map(spot => (
              <div key={spot} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground dark:text-white">
                <MapPin className="h-3 w-3 text-gold" />
                {spot}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
