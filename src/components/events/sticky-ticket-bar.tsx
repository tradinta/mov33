"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Ticket } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StickyTicketbarProps {
  eventName: string;
  ticketPrice: string;
}

export function StickyTicketbar({ eventName, ticketPrice }: StickyTicketbarProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      const heroSectionHeight = 550; 
      if (window.scrollY > heroSectionHeight) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  return (
    <div
      className={cn(
        'sticky top-16 z-40 w-full bg-background/80 py-3 backdrop-blur-lg shadow-lg transition-transform duration-300 ease-in-out',
        isVisible ? 'translate-y-0' : '-translate-y-full'
      )}
    >
      <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <p className="text-sm font-poppins text-muted-foreground">Now Viewing</p>
          <h3 className="font-headline text-lg font-bold text-foreground truncate max-w-xs md:max-w-md">
            {eventName}
          </h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:block font-poppins font-bold text-lg text-accent">
            From KES {ticketPrice}
          </span>
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold">
            <Ticket className="mr-2 h-5 w-5" />
            Book Tickets
          </Button>
        </div>
      </div>
    </div>
  );
}
