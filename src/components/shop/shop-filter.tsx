"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Search, ListFilter } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

const categories = ["Apparel", "Accessories", "Drinkware"];

export function ShopFilter() {
  const [priceRange, setPriceRange] = useState([0, 10000]);

  return (
    <div className="sticky top-[65px] z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center gap-4 py-3">
        <div className="relative flex-grow">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search merchandise..." className="pl-10 h-11" />
        </div>
        <div className="hidden md:flex items-center gap-2">
            <Select>
                <SelectTrigger className="w-[180px] h-11">
                    <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                        <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" className="h-11">
                        <ListFilter className="mr-2 h-4 w-4" /> Price
                    </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[350px]">
                    <DialogHeader>
                        <DialogTitle>Filter by Price</DialogTitle>
                    </DialogHeader>
                    <div className="py-4">
                         <Label className="font-poppins text-sm font-semibold">Price Range (KES)</Label>
                        <Slider
                            min={0}
                            max={10000}
                            step={500}
                            value={priceRange}
                            onValueChange={setPriceRange}
                            className="my-4"
                        />
                        <div className="flex justify-between items-center text-sm text-muted-foreground font-poppins">
                            <span>KES {priceRange[0].toLocaleString()}</span>
                            <span>KES {priceRange[1].toLocaleString()}</span>
                        </div>
                    </div>
                     <DialogFooter>
                        <Button type="submit" className="w-full">Apply</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="h-11 md:hidden">
              <ListFilter className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Filters</DialogTitle>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <div className="grid gap-2">
                <Label>Category</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label>Price Range (KES)</Label>
                <Slider
                  min={0}
                  max={10000}
                  step={500}
                  value={priceRange}
                  onValueChange={setPriceRange}
                  className="my-2"
                />
                <div className="flex justify-between items-center text-sm text-muted-foreground">
                  <span>KES {priceRange[0].toLocaleString()}</span>
                  <span>KES {priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit" className="w-full">
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
