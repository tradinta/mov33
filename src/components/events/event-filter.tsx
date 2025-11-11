
"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, MapPin, Tag, SlidersHorizontal, Search, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
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
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { counties } from "@/lib/counties";

const categories = ["Concert", "Festival", "Sports", "Community", "Party", "Tech", "Adventure"];

export function EventFilter() {
  const [date, setDate] = useState<Date>();
  const [priceRange, setPriceRange] = useState([500, 20000]);
  const [comboboxOpen, setComboboxOpen] = useState(false)
  const [county, setCounty] = useState("")

  return (
    <div className="sticky top-[65px] z-40 bg-background/90 backdrop-blur-md border-b">
      <div className="container mx-auto py-3">
        <div className="flex flex-col md:flex-row items-center gap-2">
            <div className="relative w-full md:flex-grow">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input placeholder="Search events by name, artist, or venue..." className="pl-11 w-full text-base rounded-full bg-card" />
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pt-2 pb-1 md:py-0">
              
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-[180px] justify-start text-left font-normal font-poppins rounded-full",
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
                    className="w-[200px] justify-between font-poppins rounded-full"
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
                  </Command>
                </PopoverContent>
              </Popover>
    
              <Select>
                <SelectTrigger className="min-w-[150px] font-poppins rounded-full">
                   <SelectValue placeholder={<div className="flex items-center gap-2"><Tag className="h-4 w-4"/> Category</div>} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                </SelectContent>
              </Select>
              
              <Dialog>
                <DialogTrigger asChild>
                   <Button variant="outline" className="font-poppins rounded-full">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    All Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle className="font-headline">Advanced Filters</DialogTitle>
                  </DialogHeader>
                  <div className="py-4 grid gap-6">
                      <div>
                          <Label className="font-poppins text-sm font-semibold">Price Range (KES)</Label>
                          <Slider
                              min={0}
                              max={50000}
                              step={1000}
                              value={priceRange}
                              onValueChange={setPriceRange}
                              className="my-4"
                          />
                          <div className="flex justify-between items-center text-sm text-muted-foreground font-poppins">
                              <Input className="w-24 h-8" value={priceRange[0].toLocaleString()} onChange={(e) => setPriceRange([+e.target.value.replace(/,/g, ''), priceRange[1]])} />
                              <span className="px-2">-</span>
                              <Input className="w-24 h-8" value={priceRange[1].toLocaleString()} onChange={(e) => setPriceRange([priceRange[0], +e.target.value.replace(/,/g, '')])}/>
                          </div>
                      </div>
                      <Separator />
                      <div>
                          <Label className="font-poppins text-sm font-semibold">Sort by</Label>
                           <Select>
                              <SelectTrigger className="w-full font-poppins mt-2">
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
                  </div>
                  <DialogFooter>
                    <Button variant="ghost">Clear Filters</Button>
                    <Button type="submit" className="bg-accent hover:bg-accent/90">Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
    
            </div>
        </div>
      </div>
    </div>
  );
}
