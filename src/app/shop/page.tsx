import { ShopFilter } from "@/components/shop/shop-filter";
import { ProductCard } from "@/components/shop/product-card";
import { shopData } from "@/lib/shop-data";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shop - Official Mov33 Merchandise',
  description: 'Get the official gear from Mov33. High-quality apparel, accessories, and more to represent your love for live experiences.',
};

function ShopHero() {
    return (
        <section className="w-full bg-card border-b py-20 md:py-28">
            <div className="container mx-auto px-4 text-center">
                <h1 className="font-headline text-4xl md:text-6xl font-extrabold tracking-tight">
                    Mov33 Official Store
                </h1>
                <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Rep your love for live experiences with our exclusive collection of apparel, accessories, and gear.
                </p>
            </div>
        </section>
    )
}

export default function ShopPage() {
  return (
    <div className="bg-background">
      <ShopHero />
      <ShopFilter />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {shopData.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        <div className="text-center mt-16">
            <Button size="lg" variant="outline">
                Load More <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
        </div>
      </div>
    </div>
  );
}
