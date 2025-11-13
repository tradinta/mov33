
'use client';
import { useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { shopData } from "@/lib/shop-data";
import { Button } from "@/components/ui/button";
import { ArrowRight, SlidersHorizontal } from "lucide-react";
import type { Metadata } from 'next';
import { ShopFilter } from "@/components/shop/shop-filter";
import { FeaturedProducts } from "@/components/shop/featured-products";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

// export const metadata: Metadata = {
//   title: 'Shop - Official Mov33 Merchandise',
//   description: 'Get the official gear from Mov33. High-quality apparel, accessories, and more to represent your love for live experiences.',
// };

export default function ShopPage() {
  const isMobile = useIsMobile();
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);

  return (
    <div className="bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <ShopFilter />
            </div>
          </aside>

          {/* Main Content Column */}
          <main className="lg:col-span-3">
            <FeaturedProducts />

             {/* Mobile Filter Button */}
            <div className="lg:hidden mb-6 flex justify-between items-center">
                <h2 className="font-headline text-2xl font-bold">All Products</h2>
                <Dialog open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Filters</DialogTitle>
                        </DialogHeader>
                        <ShopFilter />
                        <DialogFooter>
                          <Button onClick={() => setFilterSheetOpen(false)} className="w-full">Apply Filters</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>


            <div className="mt-12">
                 <h2 className="font-headline text-3xl font-bold hidden lg:block">All Products</h2>
                <div className="mt-8 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {shopData.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </div>
            
            <div className="text-center mt-16">
                <Button size="lg" variant="outline">
                    Load More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
