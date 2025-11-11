
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, MapPin, Tag, SlidersHorizontal, Search, Check, ChevronsUpDown } from "lucide-react";
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
    <div className="sticky top-[65px] z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center gap-2 py-3 overflow-x-auto">
        <div className="flex items-center gap-2 flex-grow">
          <div className="relative flex-grow" onClick={() => setOpenCommand(true)}>
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
             <Input 
                placeholder="Search events, artists..."
                className="pl-10 h-11 rounded-full cursor-pointer w-full"
              />
               <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-2 font-mono text-sm font-medium opacity-100 sm:flex">
                <span className="text-lg">⌘</span>K
              </kbd>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-[180px] justify-start text-left font-normal font-poppins rounded-full h-11",
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

            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-[200px] justify-between font-poppins rounded-full h-11"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">
                      {county
                        ? counties.find((c) => c.toLowerCase() === county)?.trim()
                        : "Select county..."}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[200px] p-0">
                <Command>
                  <CommandInput placeholder="Search county..." />
                  <CommandList>
                    <CommandEmpty>No county found.</CommandEmpty>
                    <CommandGroup>
                      {counties.map((c) => (
                        <CommandItem
                          key={c}
                          value={c}
                          onSelect={(currentValue) => {
                            setCounty(currentValue === county ? "" : currentValue)
                            setComboboxOpen(false)
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              county === c.toLowerCase() ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {c}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
  
            <Select>
              <SelectTrigger className="min-w-[150px] font-poppins rounded-full h-11">
                 <SelectValue placeholder={<div className="flex items-center gap-2"><Tag className="h-4 w-4"/> Category</div>} />
              </SelectTrigger>
              <SelectContent>
                {categories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
              </SelectContent>
            </Select>
        </div>    
        <Dialog>
          <DialogTrigger asChild>
              <Button variant="outline" className="font-poppins rounded-full h-11 shrink-0">
              <SlidersHorizontal className="mr-0 md:mr-2 h-4 w-4" />
              <span className="hidden md:inline">Filters</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="font-headline">Advanced Filters</DialogTitle>
            </DialogHeader>
            <div className="py-4 grid gap-6">
                <div className="md:hidden">
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
                  <div className="md:hidden">
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
                  <div className="md:hidden">
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
                <Separator />
                  <div className="grid gap-2">
                    <Label className="font-poppins text-sm font-semibold">Age Group</Label>
                      <Select>
                        <SelectTrigger className="w-full font-poppins">
                            <SelectValue placeholder="All Ages" />
                        </SelectTrigger>
                        <SelectContent>
                            {ageGroups.map(age => <SelectItem key={age} value={age.toLowerCase().replace(' ', '-')}>{age}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <DialogFooter>
              <Button variant="ghost">Clear Filters</Button>
              <Button type="submit" className="bg-accent hover:bg-accent/90">Apply Filters</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

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
    </div>
  );
}

    