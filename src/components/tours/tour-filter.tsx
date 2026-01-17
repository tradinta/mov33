"use client";

import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  RotateCw,
  Palmtree,
  Compass,
  Waves,
  Map as MapIcon,
  Heart,
  Clock,
  DollarSign,
  Users as UsersIcon
} from "lucide-react";
import { useState, useEffect } from "react";
import { Separator } from "../ui/separator";
import { Label } from "@/components/ui/label";
import { CardHeader, CardTitle, CardContent } from "../ui/card";
import { GlassCard } from "../ui/glass-card";
import { Checkbox } from "@/components/ui/checkbox";

export type TourFilters = {
  destination: string;
  duration: string;
  priceRange: [number, number];
  privateOnly: boolean;
  searchQuery: string;
};

interface TourFilterProps {
  onFilterChange: (filters: TourFilters) => void;
}

const destinations = [
  "Maasai Mara",
  "Amboseli",
  "Diani",
  "Nairobi",
  "Lamu",
  "Samburu",
  "Tsavo",
  "Naivasha"
];

export function TourFilter({ onFilterChange }: TourFilterProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [destination, setDestination] = useState("");
  const [duration, setDuration] = useState("any");
  const [privateOnly, setPrivateOnly] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleReset = () => {
    setPriceRange([0, 200000]);
    setDestination("");
    setDuration("any");
    setPrivateOnly(false);
    setSearchQuery("");
  };

  useEffect(() => {
    onFilterChange({
      destination,
      duration,
      priceRange,
      privateOnly,
      searchQuery
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destination, duration, priceRange, privateOnly, searchQuery]);

  return (
    <GlassCard className="border-black/5 dark:border-white/5 bg-background/40 dark:bg-obsidian/40 backdrop-blur-xl sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-black/5 dark:border-white/5">
        <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-foreground dark:text-white flex items-center gap-2">
          <div className="h-2 w-6 bg-gold rounded-full" />
          Expedition
        </CardTitle>
        <button
          onClick={handleReset}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors flex items-center gap-1.5"
        >
          <RotateCw className="h-3 w-3" />
          Reset
        </button>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        {/* Destination */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
            <MapIcon className="h-3 w-3 text-gold" />
            Region / Park
          </Label>
          <Select onValueChange={setDestination} value={destination}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 font-bold font-poppins focus:ring-gold/50 transition-all text-xs uppercase tracking-tight text-foreground dark:text-white">
              <SelectValue placeholder="All Destinations" />
            </SelectTrigger>
            <SelectContent className="bg-background dark:bg-obsidian border-black/10 dark:border-white/10 max-h-60">
              <SelectItem value="all" className="uppercase text-[10px] font-black tracking-widest">All Kenya</SelectItem>
              {destinations.map(d => (
                <SelectItem key={d} value={d.toLowerCase()} className="font-bold text-xs uppercase tracking-tight">
                  {d}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Duration Masterpiece Selector */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
            <Clock className="h-3 w-3 text-gold" />
            Duration
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: "1 Day", val: "1" },
              { label: "2-3 Days", val: "2-3" },
              { label: "4-7 Days", val: "4-7" },
              { label: "1 Week+", val: "7+" }
            ].map((d) => (
              <button
                key={d.val}
                onClick={() => setDuration(duration === d.val ? "any" : d.val)}
                className={cn(
                  "px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                  duration === d.val
                    ? "bg-gold text-obsidian border-gold shadow-lg shadow-gold/20"
                    : "bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/5 text-muted-foreground hover:bg-black/10 dark:hover:bg-white/10"
                )}
              >
                {d.label}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range */}
        <div className="space-y-4">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
            <DollarSign className="h-3 w-3 text-gold" />
            Budget Range (KES)
          </Label>
          <Slider
            min={0}
            max={300000}
            step={5000}
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as [number, number])}
            className="my-6"
          />
          <div className="flex justify-between items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <div className="bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg border border-black/5 dark:border-white/5 flex-1 text-center font-black text-foreground dark:text-white">
              {priceRange[0].toLocaleString()}
            </div>
            <span className="text-gold opacity-50 font-black">-</span>
            <div className="bg-black/5 dark:bg-white/5 px-3 py-2 rounded-lg border border-black/5 dark:border-white/5 flex-1 text-center font-black text-foreground dark:text-white">
              {priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        <Separator className="bg-black/5 dark:bg-white/5" />

        {/* Checks */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 bg-black/5 dark:bg-white/5 p-4 rounded-xl border border-black/5 dark:border-white/5 hover:border-gold/30 transition-all cursor-pointer group" onClick={() => setPrivateOnly(!privateOnly)}>
            <Checkbox
              id="private"
              checked={privateOnly}
              onCheckedChange={(val) => setPrivateOnly(!!val)}
              className="h-5 w-5 rounded-md border-black/20 dark:border-white/20 data-[state=checked]:bg-gold data-[state=checked]:text-obsidian"
            />
            <div className="space-y-0.5">
              <Label htmlFor="private" className="text-[10px] font-bold uppercase tracking-widest text-foreground dark:text-white group-hover:text-gold transition-colors cursor-pointer">
                Private Booking
              </Label>
              <p className="text-[9px] text-muted-foreground uppercase font-black tracking-tighter opacity-50">Exclusive solo/group tours</p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button className="w-full bg-gold text-obsidian font-black uppercase h-14 rounded-2xl shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-all">
            Apply Filters
          </Button>
        </div>
      </CardContent>
    </GlassCard>
  );
}