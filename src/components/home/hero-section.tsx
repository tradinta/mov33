'use client';
import { Button } from "@/components/ui/button";
import { Sparkles, Ticket } from "lucide-react";

export function HeroSection() {
  return (
    <section 
      className="relative w-full bg-transparent text-[hsl(var(--deep-blue-foreground))] py-24 md:py-36 overflow-hidden"
    >
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
          Discover Unforgettable Experiences
        </h1>
        <p className="mt-6 text-lg md:text-xl text-deep-blue-foreground/80 max-w-3xl mx-auto font-poppins">
          Concerts, Festivals, Sports, and Community Events across Kenya. Your next adventure awaits.
        </p>
        <div className="mt-10 flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins font-semibold text-base md:text-lg px-8 py-6 rounded-full transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:shadow-accent/20"
          >
            <Ticket className="mr-2 h-5 w-5" />
            Book Now
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="font-poppins font-semibold text-base md:text-lg px-8 py-6 rounded-full border-primary/50 text-deep-blue-foreground transition-all duration-300 ease-in-out hover:scale-105 hover:bg-primary/10 hover:shadow-lg"
          >
            <Sparkles className="mr-2 h-5 w-5" /> 
            See Featured
          </Button>
        </div>
      </div>
    </section>
  );
}
