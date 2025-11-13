

"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, MapPin, Tag, SlidersHorizontal, Search, Check, ChevronsUpDown, RotateCw } from "lucide-react";
import { useState, useEffect } from "react";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Separator } from "../ui/separator";
import { CommandDialog, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { counties } from "@/lib/counties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockSearchData } from "@/lib/search-data";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const categories = ["Concert", "Festival", "Sports", "Community", "Party", "Tech", "Adventure"];
const ageGroups = ["All Ages", "Kids", "Teenagers", "Young Adults", "Youths", "Seniors", "All"];

export function EventFilter() {
  const [date, setDate] = useState<Date>();
  const [priceRange, setPriceRange] = useState([500, 20000]);
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [county, setCounty] = useState("")
  const [openCommand, setOpenCommand] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpenCommand((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
    <div className="relative w-full mb-4 lg:mb-6" onClick={() => setOpenCommand(true)}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <Input 
            placeholder="Search events, artists..."
            className="pl-10 h-11 rounded-full cursor-pointer w-full"
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium opacity-100 sm:flex">
            <span className="text-lg">⌘</span>K
        </kbd>
    </div>

    <Card>
       <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-poppins font-semibold">Filters</CardTitle>
        <Button variant="ghost" size="sm">
          <RotateCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <Label className="font-poppins text-sm font-semibold">Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal font-poppins mt-2",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
        </div>
        <div>
            <Label className="font-poppins text-sm font-semibold">County</Label>
            <Select onValueChange={setCounty} value={county}>
                <SelectTrigger className="w-full font-poppins mt-2">
                    <SelectValue placeholder="Select county..." />
                </SelectTrigger>
                <SelectContent>
                    {counties.map(c => <SelectItem key={c} value={c.toLowerCase()}>{c}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div>
            <Label className="font-poppins text-sm font-semibold">Category</Label>
            <Select>
                <SelectTrigger className="w-full font-poppins mt-2">
                    <SelectValue placeholder="Select category..." />
                </SelectTrigger>
                <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                </SelectContent>
            </Select>
        </div>
        <div className="grid gap-2">
            <Label className="font-poppins text-sm font-semibold">Price Range (KES)</Label>
            <Slider
                min={0}
                max={50000}
                step={1000}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-2"
            />
            <div className="flex justify-between items-center text-sm text-muted-foreground font-poppins">
                <Input className="w-24 h-8" value={priceRange[0].toLocaleString()} onChange={(e) => setPriceRange([+e.target.value.replace(/,/g, ''), priceRange[1]])} />
                <span className="px-2">-</span>
                <Input className="w-24 h-8" value={priceRange[1].toLocaleString()} onChange={(e) => setPriceRange([priceRange[0], +e.target.value.replace(/,/g, '')])}/>
            </div>
        </div>
        <Separator/>
        <div className="grid gap-2">
            <Label className="font-poppins text-sm font-semibold">Sort by</Label>
            <Select>
                <SelectTrigger className="w-full font-poppins">
                    <SelectValue placeholder="Recommended" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="recommended">Recommended</SelectItem>
                    <SelectItem value="popularity">Popularity</SelectItem>
                    <SelectItem value="date_asc">Date: Soonest</SelectItem>
                    <SelectItem value="date_desc">Date: Latest</SelectItem>
                    <SelectItem value="price_asc">Price: Low to High</SelectItem>
                    <SelectItem value="price_desc">Price: High to Low</SelectItem>
                </SelectContent>
            </Select>
        </div>
        <Button className="w-full hidden lg:inline-flex">Apply Filters</Button>
      </CardContent>
    </Card>

    <CommandDialog open={openCommand} onOpenChange={setOpenCommand}>
    <CommandInput placeholder="Search events, artists, venues..." />
    <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Events">
        {mockSearchData.events.map((event) => (
            <CommandItem key={event.id} value={event.name} onSelect={() => { console.log('nav to event'); setOpenCommand(false); }}>
            {event.name}
            </CommandItem>
        ))}
        </CommandGroup>
        <Separator />
        <CommandGroup heading="Artists">
            {mockSearchData.artists.map((artist) => (
            <CommandItem key={artist.id} value={artist.name} onSelect={() => { console.log('nav to artist'); setOpenCommand(false); }}>
            {artist.name}
            </CommandItem>
        ))}
        </CommandGroup>
        <Separator />
        <CommandGroup heading="Venues">
        {mockSearchData.venues.map((venue) => (
            <CommandItem key={venue.id} value={venue.name} onSelect={() => { console.log('nav to venue'); setOpenCommand(false); }}>
            {venue.name}
            </CommandItem>
        ))}
        </CommandGroup>
    </CommandList>
    </CommandDialog>
    </>
  );
}
