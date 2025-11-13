

"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon, RotateCw } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { Separator } from "../ui/separator";
import { counties } from "@/lib/counties";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

const categories = ["Concert", "Festival", "Sports", "Community", "Party", "Tech", "Adventure"];
const ageGroups = ["All Ages", "Kids", "Teenagers", "Young Adults", "Youths", "Seniors", "All"];

export function EventFilter() {
  const [date, setDate] = useState<Date>();
  const [priceRange, setPriceRange] = useState([500, 20000]);
  const [county, setCounty] = useState("")

  return (
    <>
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
    </>
  );
}
