'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { RotateCw } from 'lucide-react';
import { Separator } from '../ui/separator';

const destinations = [
  'Maasai Mara',
  'Amboseli',
  'Diani',
  'Nairobi',
  'Lamu',
  'Samburu',
];

export function TourFilter() {
  const [priceRange, setPriceRange] = useState([5000, 50000]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-poppins font-semibold">
          Filters
        </CardTitle>
        <Button variant="ghost" size="sm">
          <RotateCw className="mr-2 h-4 w-4" />
          Reset
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <Label className="font-poppins text-sm font-semibold">
            Destination
          </Label>
          <Select>
            <SelectTrigger className="w-full font-poppins mt-2">
              <SelectValue placeholder="Select destination..." />
            </SelectTrigger>
            <SelectContent>
              {destinations.map((dest) => (
                <SelectItem key={dest} value={dest.toLowerCase()}>
                  {dest}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label className="font-poppins text-sm font-semibold">Duration</Label>
          <RadioGroup defaultValue="any" className="mt-2 space-y-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="any" id="d-any" />
              <Label htmlFor="d-any" className="font-normal">
                Any
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="d-1" />
              <Label htmlFor="d-1" className="font-normal">
                1 Day
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2-3" id="d-2-3" />
              <Label htmlFor="d-2-3" className="font-normal">
                2-3 Days
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="4+" id="d-4" />
              <Label htmlFor="d-4" className="font-normal">
                4+ Days
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label className="font-poppins text-sm font-semibold">
            Price Range (KES)
          </Label>
          <Slider
            min={0}
            max={100000}
            step={5000}
            value={priceRange}
            onValueChange={setPriceRange}
            className="my-2"
          />
          <div className="flex justify-between items-center text-sm text-muted-foreground font-poppins">
            <Input
              className="w-24 h-8"
              value={priceRange[0].toLocaleString()}
              onChange={(e) =>
                setPriceRange([+e.target.value.replace(/,/g, ''), priceRange[1]])
              }
            />
            <span className="px-2">-</span>
            <Input
              className="w-24 h-8"
              value={priceRange[1].toLocaleString()}
              onChange={(e) =>
                setPriceRange([priceRange[0], +e.target.value.replace(/,/g, '')])
              }
            />
          </div>
        </div>

        <Separator />

        <div className="flex items-center space-x-2">
          <Checkbox id="private-tours" />
          <Label
            htmlFor="private-tours"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Private Tours Only
          </Label>
        </div>

        <Button className="w-full hidden lg:inline-flex">Apply Filters</Button>
      </CardContent>
    </Card>
  );
}

    