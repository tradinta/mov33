import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

const discoverItems = [
  {
    title: "Events",
    description: "Concerts, festivals, sports, and more.",
    image: PlaceHolderImages.find(p => p.id === 'discover-events')!,
    href: "/events"
  },
  {
    title: "Tours",
    description: "Local gems and grand adventures.",
    image: PlaceHolderImages.find(p => p.id === 'discover-tours')!,
    href: "/tours"
  },
  {
    title: "Shop",
    description: "Rep your love for live experiences.",
    image: PlaceHolderImages.find(p => p.id === 'shop-1')!,
    href: "/shop"
  }
];

export function DiscoverSection() {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Discover Experiences</h2>
        <p className="mt-2 text-lg text-muted-foreground">Find your next great story.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
        {discoverItems.map((item) => (
          <Link href={item.href} key={item.title} className="group block">
            <Card className="overflow-hidden h-full border-0 shadow-lg transition-all duration-300 ease-in-out group-hover:shadow-2xl group-hover:shadow-accent/20 group-hover:-translate-y-2">
              <CardContent className="p-0 relative h-full">
                <div className="relative h-[400px] w-full">
                  <Image
                    src={item.image.imageUrl}
                    alt={item.image.description}
                    fill
                    className="object-cover"
                    data-ai-hint={item.image.imageHint}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 p-6 text-primary">
                  <h3 className="font-headline text-2xl font-bold">{item.title}</h3>
                  <p className="mt-1 text-sm">{item.description}</p>
                  <div className="mt-4 flex items-center font-poppins font-semibold text-accent">
                    Explore
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );
}
