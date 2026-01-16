"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import {
  Calendar as CalendarIcon,
  RotateCw,
  Music,
  Zap,
  Trophy,
  Users as UsersIcon,
  GlassWater,
  Cpu,
  Mountain,
  MapPin,
  Tag
} from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { counties } from "@/lib/counties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { GlassCard } from "../ui/glass-card";

export type EventFilters = {
  date: Date | undefined;
  category: string;
  county: string;
  priceRange: [number, number];
  sortBy: string;
  searchQuery: string;
};

interface EventFilterProps {
  onFilterChange: (filters: EventFilters) => void;
}

const categories = [
  { name: "Concert", icon: Music },
  { name: "Festival", icon: Zap },
  { name: "Sports", icon: Trophy },
  { name: "Community", icon: UsersIcon },
  { name: "Party", icon: GlassWater },
  { name: "Tech", icon: Cpu },
  { name: "Adventure", icon: Mountain },
];

export function EventFilter({ onFilterChange }: EventFilterProps) {
  const [date, setDate] = useState<Date>();
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [county, setCounty] = useState("");
  const [category, setCategory] = useState("");
  const [sortBy, setSortBy] = useState("recommended");
  const [searchQuery, setSearchQuery] = useState("");

  const handleReset = () => {
    setDate(undefined);
    setPriceRange([0, 50000]);
    setCounty("");
    setCategory("");
    setSortBy("recommended");
    setSearchQuery("");
  };

  useEffect(() => {
    onFilterChange({
      date,
      category,
      county,
      priceRange,
      sortBy,
      searchQuery
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date, category, county, priceRange, sortBy, searchQuery]);

  return (
    <GlassCard className="border-white/5 bg-obsidian/40 backdrop-blur-xl sticky top-24">
      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-white/5">
        <CardTitle className="text-xl font-black uppercase tracking-tighter italic text-white flex items-center gap-2">
          <div className="h-2 w-6 bg-gold rounded-full" />
          Filters
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleReset}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-gold transition-colors"
        >
          <RotateCw className="mr-2 h-3 w-3" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-8 pt-8">
        {/* Date Filter */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
            <CalendarIcon className="h-3 w-3 text-gold" />
            Target Date
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-full justify-start text-left font-bold font-poppins h-12 rounded-xl bg-white/5 border-white/5 hover:bg-white/10 transition-all",
                  !date && "text-muted-foreground"
                )}
              >
                {date ? format(date, "PPP") : <span className="text-xs uppercase tracking-tight">Pick an evening</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-obsidian border-white/10" align="start">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                initialFocus
                className="rounded-xl border-none font-poppins"
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* County Filter */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
            <MapPin className="h-3 w-3 text-gold" />
            Location / County
          </Label>
          <Select onValueChange={setCounty} value={county}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-white/5 border-white/5 font-bold font-poppins focus:ring-gold/50 transition-all text-xs uppercase tracking-tight">
              <SelectValue placeholder="All regions" />
            </SelectTrigger>
            <SelectContent className="bg-obsidian border-white/10 max-h-60">
              <SelectItem value="all" className="uppercase text-[10px] font-black tracking-widest">All Regions</SelectItem>
              {counties.map(c => (
                <SelectItem key={c} value={c.toLowerCase()} className="font-bold text-xs">
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Category Selection - MASTERPIECE Grid */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground flex items-center gap-2">
            <Tag className="h-3 w-3 text-gold" />
            Experience Type
          </Label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.name.toLowerCase();
              return (
                <button
                  key={cat.name}
                  onClick={() => setCategory(isActive ? "" : cat.name.toLowerCase())}
                  className={cn(
                    "flex items-center gap-2 px-3 py-3 rounded-xl border text-[10px] font-black uppercase tracking-tighter transition-all duration-300",
                    isActive
                      ? "bg-gold text-obsidian border-gold shadow-lg shadow-gold/20"
                      : "bg-white/5 border-white/5 text-muted-foreground hover:bg-white/10"
                  )}
                >
                  <Icon className={cn("h-4 w-4", isActive ? "text-obsidian" : "text-gold")} />
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Price Range Slider */}
        <div className="space-y-4">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">
            Budget (KES)
          </Label>
          <Slider
            min={0}
            max={100000}
            step={1000}
            value={priceRange}
            onValueChange={(val) => setPriceRange(val as [number, number])}
            className="my-6"
          />
          <div className="flex justify-between items-center gap-2 font-mono text-[10px] text-muted-foreground">
            <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/5 flex-1 text-center font-black">
              {priceRange[0].toLocaleString()}
            </div>
            <span className="text-gold opacity-50 font-black">-</span>
            <div className="bg-white/5 px-3 py-2 rounded-lg border border-white/5 flex-1 text-center font-black">
              {priceRange[1].toLocaleString()}
            </div>
          </div>
        </div>

        <Separator className="bg-white/5" />

        {/* Sort Filter */}
        <div className="space-y-3">
          <Label className="uppercase text-[10px] font-black tracking-widest text-muted-foreground">
            Order By
          </Label>
          <Select onValueChange={setSortBy} value={sortBy}>
            <SelectTrigger className="w-full h-12 rounded-xl bg-white/5 border-white/5 font-bold font-poppins focus:ring-gold/50 transition-all text-xs uppercase tracking-tight">
              <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent className="bg-obsidian border-white/10">
              <SelectItem value="recommended" className="font-bold text-xs uppercase tracking-tight">Recommended</SelectItem>
              <SelectItem value="date_asc" className="font-bold text-xs uppercase tracking-tight">Soonest First</SelectItem>
              <SelectItem value="price_asc" className="font-bold text-xs uppercase tracking-tight">Price: Low - High</SelectItem>
              <SelectItem value="price_desc" className="font-bold text-xs uppercase tracking-tight">Price: High - Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </GlassCard>
  );
}
