import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative w-full bg-background py-20 md:py-32">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/80 to-secondary/30 opacity-50" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-primary">
          Discover Unforgettable Events in Kenya
        </h1>
        <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto font-poppins">
          From Nairobi&apos;s vibrant concerts to Mombasa&apos;s beach festivals. Your ultimate guide to what&apos;s happening.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins text-lg px-8 py-6 transition-transform hover:scale-105 hover:shadow-lg">
            Book Now
          </Button>
          <Button size="lg" variant="outline" className="font-poppins text-lg px-8 py-6 transition-transform hover:scale-105 hover:shadow-lg">
            <Sparkles className="mr-2 h-5 w-5" /> See Featured
          </Button>
        </div>
      </div>
    </section>
  );
}
