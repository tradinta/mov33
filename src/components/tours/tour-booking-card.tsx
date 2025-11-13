"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Minus, Plus, User } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import type { Tour } from '@/lib/tours-data';

interface TourBookingCardProps {
  tour: Tour;
}

export function TourBookingCard({ tour }: TourBookingCardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [adults, setAdults] = useState(tour.minGuests || 1);

  const total = parseInt(tour.price.replace(/,/g, '')) * adults;

  return (
    <Card className="bg-card/50 backdrop-blur-lg">
      <CardHeader>
        <div className="flex justify-between items-baseline">
            <CardDescription>From</CardDescription>
            <p className="font-headline text-3xl font-bold text-accent">KES {tour.price}</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
            <Label htmlFor="date" className='font-poppins'>Select Date</Label>
            <Popover>
                <PopoverTrigger asChild>
                  <Button
                    id="date"
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
            </Popover>
        </div>
        <div className="grid gap-2">
            <Label className='font-poppins'>Guests</Label>
            <div className='flex items-center justify-between rounded-lg border p-3'>
                <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-muted-foreground'/>
                    <span className='font-semibold'>Adults</span>
                </div>
                <div className='flex items-center gap-3'>
                    <Button variant="outline" size="icon" className='h-8 w-8 rounded-full' onClick={() => setAdults(Math.max(tour.minGuests || 1, adults - 1))}>
                        <Minus className="h-4 w-4" />
                    </Button>
                    <span className='text-lg font-bold w-4 text-center'>{adults}</span>
                    <Button variant="outline" size="icon" className='h-8 w-8 rounded-full' onClick={() => setAdults(Math.min(tour.maxGuests || 10, adults + 1))}>
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
      </CardContent>
      <CardFooter className="flex-col items-stretch gap-4">
        <div className="flex justify-between items-center font-bold text-xl">
            <span>Total</span>
            <span>KES {total.toLocaleString()}</span>
        </div>
        <Button size="lg" className="w-full font-poppins font-semibold text-lg py-6">
          Book Adventure
        </Button>
      </CardFooter>
    </Card>
  );
}

    