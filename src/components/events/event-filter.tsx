"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, ChevronDown, ListFilter, Search } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";

export function EventFilter() {
  const [date, setDate] = useState<Date>();
  const [priceRange, setPriceRange] = useState([500, 10000]);

  return (
    <div className="sticky top-16 z-40 bg-background/80 backdrop-blur-lg -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-4 border-b border-border">
      <div className="container mx-auto flex flex-col md:flex-row items-center gap-4">
        <div className="relative w-full md:flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input placeholder="Search for events..." className="pl-10 w-full" />
        </div>
        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
          <Select>
            <SelectTrigger className="min-w-[150px] font-poppins">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="concerts">Concerts</SelectItem>
              <SelectItem value="festivals">Festivals</SelectItem>
              <SelectItem value="sports">Sports</SelectItem>
              <SelectItem value="community">Community</SelectItem>
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[200px] justify-start text-left font-normal font-poppins",
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

          <Select>
            <SelectTrigger className="min-w-[150px] font-poppins">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nairobi">Nairobi</SelectItem>
              <SelectItem value="mombasa">Mombasa</SelectItem>
              <SelectItem value="kisumu">Kisumu</SelectItem>
              <SelectItem value="nakuru">Nakuru</SelectItem>
              <SelectItem value="lamu">Lamu</SelectItem>
            </SelectContent>
          </Select>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="min-w-[150px] font-poppins">Price Range <ChevronDown className="ml-2 h-4 w-4" /></Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-4 w-64">
              <Label className="font-poppins">Price (KES)</Label>
              <Slider
                min={0}
                max={20000}
                step={500}
                value={priceRange}
                onValueChange={setPriceRange}
                className="my-4"
              />
              <div className="flex justify-between text-sm text-muted-foreground font-poppins">
                <span>{priceRange[0]}</span>
                <span>{priceRange[1]}</span>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="ghost" className="md:hidden"><ListFilter /></Button>
        </div>
        <div className="hidden md:flex">
          <Select>
            <SelectTrigger className="min-w-[150px] font-poppins">
              <SelectValue placeholder="Sort by: Popularity" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popularity">Popularity</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
