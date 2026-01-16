"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar as CalendarIcon, Minus, Plus, User, ShoppingCart } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Tour } from '@/lib/types';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface TourBookingCardProps {
  tour: Tour;
}

export function TourBookingCard({ tour }: TourBookingCardProps) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [adults, setAdults] = useState(tour.minGuests || 1);
  const { addToCart } = useCart();
  const { toast } = useToast();
  const router = useRouter();

  const total = tour.price * adults;

  const handleAddToCart = () => {
    addToCart({
      id: `tour-${tour.id}`,
      name: tour.name,
      price: tour.price,
      image: tour.imageUrl || '',
      quantity: adults,
      variant: { name: `Tour Discovery - ${adults} Guest(s)` },
    });
    toast({
      title: "Added to Cart",
      description: `Successfully added ${tour.name} for ${adults} guests.`,
    });
  };

  const handleProceedToCheckout = () => {
    handleAddToCart();
    router.push('/checkout');
  }

  return (
    <Card className="bg-white/[0.03] border-white/5 rounded-[2.5rem] overflow-hidden backdrop-blur-xl">
      <CardHeader className="p-8 pb-4">
        <div className="flex justify-between items-baseline">
          <CardDescription className="text-[10px] font-black uppercase tracking-widest text-white/30 italic">From Price</CardDescription>
          <p className="font-headline text-4xl font-black text-gold italic tracking-tighter">KES {tour.price.toLocaleString()}</p>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-8">
        <div className="grid gap-4">
          <Label htmlFor="date" className='text-[10px] font-black uppercase text-white/40 tracking-widest'>Select Expedition Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date"
                variant={"outline"}
                className={cn(
                  "w-full h-14 rounded-2xl border-white/5 bg-white/5 justify-start text-left font-bold text-sm",
                  !date && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-3 h-5 w-5 text-gold" />
                {date ? format(date, "PPP") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 bg-obsidian border-white/10" align="start">
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
        <div className="grid gap-4">
          <Label className='text-[10px] font-black uppercase text-white/40 tracking-widest'>Number of Guests</Label>
          <div className='flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4 h-14'>
            <div className='flex items-center gap-3'>
              <div className="h-8 w-8 rounded-lg bg-white/5 flex items-center justify-center">
                <User className='h-4 w-4 text-gold' />
              </div>
              <span className='font-bold text-sm uppercase tracking-tight'>Adults</span>
            </div>
            <div className='flex items-center gap-4'>
              <Button variant="ghost" size="icon" className='h-10 w-10 rounded-xl hover:bg-white/10 text-white' onClick={() => setAdults(Math.max(tour.minGuests || 1, adults - 1))}>
                <Minus className="h-4 w-4" />
              </Button>
              <span className='text-xl font-black w-6 text-center text-white italic'>{adults}</span>
              <Button variant="ghost" size="icon" className='h-10 w-10 rounded-xl hover:bg-white/10 text-white' onClick={() => setAdults(Math.min(tour.maxGuests || 10, adults + 1))}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-8 pt-0 flex-col items-stretch gap-6">
        <div className="flex justify-between items-center py-6 border-t border-dashed border-white/10">
          <span className="text-xs font-black uppercase tracking-widest text-white/30">Total Expedition</span>
          <span className="text-3xl font-black italic tracking-tighter text-gold">KES {total.toLocaleString()}</span>
        </div>
        <div className="space-y-4">
          <Button size="lg" className="w-full h-16 bg-gold text-obsidian font-black uppercase tracking-widest text-sm rounded-2xl shadow-2xl shadow-gold/20 hover:scale-[1.02] active:scale-[0.98] transition-all" onClick={handleProceedToCheckout}>
            Book Expedition Now
          </Button>
          <Button size="lg" variant="outline" className="w-full h-16 rounded-2xl border-white/10 bg-white/5 font-black uppercase text-[10px] tracking-widest hover:bg-white/10 transition-colors" onClick={handleAddToCart}>
            <ShoppingCart className="mr-3 h-5 w-5" />
            Add to Cart
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

