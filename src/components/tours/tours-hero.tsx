import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Map, Search } from "lucide-react";
import Image from "next/image";

export function ToursHero() {
  const heroImage = PlaceHolderImages.find(p => p.id === 'tour-hero');

  return (
    <section className="relative h-[60vh] w-full flex items-center justify-center text-white bg-black">
      {heroImage && (
        <Image
          src={heroImage.imageUrl}
          alt={heroImage.description}
          fill
          className="object-cover opacity-60"
          data-ai-hint={heroImage.imageHint}
          priority
        />
      )}
      <div className="relative z-10 text-center p-4">
        <h1 className="font-headline text-5xl md:text-7xl font-extrabold tracking-tight">
          Your Adventure Awaits
        </h1>
        <p className="mt-4 text-lg md:text-xl text-primary-foreground/90 max-w-2xl mx-auto font-poppins">
          Discover curated safaris, city explorations, and coastal escapes across Kenya.
        </p>
        <div className="mt-8 mx-auto max-w-2xl bg-background/90 p-3 rounded-full shadow-lg flex items-center gap-2">
            <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input 
                    placeholder="Search destination or activity (e.g., 'Amboseli', 'Hiking')" 
                    className="pl-10 border-0 bg-transparent focus-visible:ring-0 text-base text-foreground"
                />
            </div>
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-semibold">
                Find Tours
            </Button>
        </div>
      </div>
    </section>
  );
}
