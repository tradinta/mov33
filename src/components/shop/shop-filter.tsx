
"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { ListFilter, RotateCw } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "../ui/separator";

const categories = ["Apparel", "Accessories", "Drinkware"];

export function ShopFilter() {
  const [priceRange, setPriceRange] = useState([0, 10000]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-poppins font-semibold">Filters</CardTitle>
        <Button variant="ghost" size="sm">
          <RotateCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3">
          <Label className="font-poppins">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-3">
          <Label className="font-poppins">Price Range (KES)</Label>
          <Slider
            min={0}
            max={10000}
            step={500}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-2"
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground font-poppins">
            <span>KES {priceRange[0].toLocaleString()}</span>
            <span>KES {priceRange[1].toLocaleString()}</span>
          </div>
        </div>

        <div className="grid gap-3">
            <Label className="font-poppins">Sort by</Label>
            <Select>
            <SelectTrigger>
                <SelectValue placeholder="Recommended" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="popularity">Popularity</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
            </SelectContent>
            </Select>
        </div>
        <Button className="w-full hidden lg:inline-flex">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}
