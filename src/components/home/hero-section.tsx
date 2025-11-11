import Image from 'next/image';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

const heroItems = [
  {
    image: PlaceHolderImages.find(p => p.id === 'hero-1')!,
    title: "Unforgettable Live Music",
    description: "Experience the artists you love, live and in person. Get your tickets now.",
    cta: "Explore Concerts",
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'hero-2')!,
    title: "Adventure Awaits",
    description: "Discover breathtaking landscapes and curated tours. Your next journey starts here.",
    cta: "Discover Tours",
  },
  {
    image: PlaceHolderImages.find(p => p.id === 'hero-3')!,
    title: "Own the Night",
    description: "Find the hottest parties and nightlife events in your city.",
    cta: "Explore Nightlife",
  },
];

export function HeroSection() {
  return (
    <section className="relative w-full h-[60vh] md:h-[80vh]">
      <Carousel
        opts={{ loop: true }}
        className="w-full h-full"
      >
        <CarouselContent className="h-full">
          {heroItems.map((item, index) => (
            <CarouselItem key={index} className="h-full">
              <div className="relative h-full w-full">
                <Image
                  src={item.image.imageUrl}
                  alt={item.image.description}
                  fill
                  className="object-cover"
                  priority={index === 0}
                  data-ai-hint={item.image.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-white p-4">
                  <div className="max-w-3xl">
                    <h1 className="font-headline text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tight">
                      {item.title}
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-primary max-w-xl mx-auto">
                      {item.description}
                    </p>
                    <Button size="lg" className="mt-8 bg-accent hover:bg-accent/90 text-accent-foreground font-poppins text-lg px-8 py-6">
                      {item.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 hidden md:inline-flex" />
      </Carousel>
    </section>
  );
}
