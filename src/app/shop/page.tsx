'use client';

import React, { useEffect, useState } from "react";
import { ProductCard } from "@/components/shop/product-card";
import { Button } from "@/components/ui/button";
import { ArrowRight, SlidersHorizontal, Loader2, ShoppingBag } from "lucide-react";
import { ShopFilter } from "@/components/shop/shop-filter";
import { FeaturedProducts } from "@/components/shop/featured-products";
import { useIsMobile } from "@/hooks/use-mobile";
import { collection, query, getDocs, orderBy, limit, startAfter, QueryDocumentSnapshot, DocumentData } from "firebase/firestore";
import { firestore } from "@/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
  quantity?: number;
}

export default function ShopPage() {
  const isMobile = useIsMobile();
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const PAGE_SIZE = 9;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(firestore, "products"),
          orderBy("createdAt", "desc"),
          limit(PAGE_SIZE)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(fetched);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        setHasMore(querySnapshot.docs.length >= PAGE_SIZE);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const loadMore = async () => {
    if (!lastDoc || loadingMore) return;
    setLoadingMore(true);
    try {
      const q = query(
        collection(firestore, "products"),
        orderBy("createdAt", "desc"),
        startAfter(lastDoc),
        limit(PAGE_SIZE)
      );
      const querySnapshot = await getDocs(q);
      const fetched = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Product[];
      setProducts(prev => [...prev, ...fetched]);
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length >= PAGE_SIZE);
    } catch (error) {
      console.error("Error loading more products:", error);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <div className="bg-obsidian min-h-screen pt-24 pb-20">
      <div className="container mx-auto px-4 md:px-12">

        {/* Header */}
        <div className="mb-16 space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Official Merch</span>
          </div>
          <h1 className="font-headline text-5xl md:text-8xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
            The <span className="text-gold">Vault</span>
          </h1>
          <p className="text-white/40 font-poppins max-w-md text-sm">
            Premium gear for the modern discoverer. Rep your love for live experiences.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block lg:col-span-3">
            <div className="sticky top-32 bg-white/[0.02] border border-white/5 rounded-[2.5rem] p-8">
              <ShopFilter />
            </div>
          </aside>

          {/* Main Content Column */}
          <main className="lg:col-span-9">
            <FeaturedProducts />

            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-8 flex justify-between items-center">
              <h2 className="font-headline text-2xl font-black text-white italic uppercase tracking-tight">All Products</h2>
              <Dialog open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="rounded-xl border-white/10 bg-white/5">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filters
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] bg-obsidian border-white/10 rounded-[2rem]">
                  <DialogHeader>
                    <DialogTitle className="font-headline font-black text-white uppercase italic">Filters</DialogTitle>
                  </DialogHeader>
                  <ShopFilter />
                  <DialogFooter>
                    <Button onClick={() => setFilterSheetOpen(false)} className="w-full bg-gold text-obsidian font-black rounded-xl">Apply Filters</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>


            <div className="mt-16">
              <h2 className="font-headline text-3xl font-black hidden lg:block text-white uppercase italic tracking-tight mb-10">All Products</h2>

              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="h-10 w-10 animate-spin text-gold" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Loading Collection...</p>
                </div>
              ) : products.length === 0 ? (
                <div className="text-center py-20 border border-dashed border-white/10 rounded-[3rem]">
                  <ShoppingBag className="h-12 w-12 text-white/10 mx-auto mb-4" />
                  <p className="text-white/30 font-poppins">No products available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              )}
            </div>

            {hasMore && products.length > 0 && (
              <div className="text-center mt-16">
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-2xl border-white/10 bg-white/5 font-black uppercase text-xs tracking-widest hover:bg-gold hover:text-obsidian hover:border-gold transition-all"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  {loadingMore ? 'Loading...' : 'Load More'}
                  {!loadingMore && <ArrowRight className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
