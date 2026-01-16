import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight, Compass, Sparkles, ShoppingBag } from "lucide-react";

const discoverItems = [
  {
    title: "Expeditions",
    description: "Concerts, festivals, sports, and elite gatherings.",
    image: PlaceHolderImages.find(p => p.id === 'discover-events')!,
    href: "/events",
    icon: <Sparkles className="h-5 w-5" />
  },
  {
    title: "Discoveries",
    description: "Local gems and grand adventures beyond the ordinary.",
    image: PlaceHolderImages.find(p => p.id === 'discover-tours')!,
    href: "/tours",
    icon: <Compass className="h-5 w-5" />
  },
  {
    title: "The Vault",
    description: "Rep your love with exclusive Mov33 premium gear.",
    image: PlaceHolderImages.find(p => p.id === 'shop-1')!,
    href: "/shop",
    icon: <ShoppingBag className="h-5 w-5" />
  }
];

export function DiscoverSection() {
  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Compass className="h-4 w-4 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Exploration</span>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
            Your <span className="text-gold">Compass</span>
          </h2>
        </div>
        <p className="text-white/40 font-poppins max-w-xs text-sm">
          Navigate through our curated collections of experiences designed for the modern discoverer.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {discoverItems.map((item) => (
          <Link href={item.href} key={item.title} className="group block">
            <Card className="overflow-hidden h-full border-white/5 bg-white/5 rounded-[3rem] transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5 relative group">
              <CardContent className="p-0 relative h-full">
                <div className="relative h-[480px] w-full overflow-hidden">
                  <Image
                    src={item.image.imageUrl}
                    alt={item.image.description}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/40 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 p-10 space-y-4 w-full">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold text-obsidian flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-headline text-3xl font-black italic tracking-tighter text-white uppercase">{item.title}</h3>
                  <p className="text-sm text-white/50 font-poppins leading-relaxed">{item.description}</p>
                  <div className="pt-4 flex items-center font-black uppercase tracking-widest text-[10px] text-gold italic group-hover:gap-3 transition-all">
                    Initialize Access
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
