"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "../ui/button";
import { collection, query, limit, getDocs, orderBy } from "firebase/firestore";
import { firestore } from "@/firebase";
import { Loader2, ShoppingBag, ChevronRight, Plus } from "lucide-react";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
}

export function ShopHighlights() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const q = query(
          collection(firestore, "products"),
          orderBy("createdAt", "desc"),
          limit(3)
        );
        const querySnapshot = await getDocs(q);
        const fetched = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Product[];
        setProducts(fetched);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: `product-${product.id}`,
      name: product.name,
      price: product.price,
      image: product.imageUrl || '',
      quantity: 1,
      variant: { name: product.category || 'Standard' },
    });
    toast({
      title: "Added to Cart",
      description: `${product.name} has been added to your cart.`,
    });
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
        <p className="text-[10px] font-black uppercase tracking-widest text-gold opacity-50">Loading Gear...</p>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <section className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <ShoppingBag className="h-4 w-4 text-gold" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gold">Merch Drop</span>
          </div>
          <h2 className="font-headline text-5xl md:text-7xl font-black text-white italic tracking-tighter uppercase leading-[0.8]">
            The <span className="text-gold">Gear</span>
          </h2>
        </div>
        <p className="text-white/40 font-poppins max-w-xs text-sm">
          Rep your love for live experiences with exclusive Mov33 merchandise.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden group bg-white/5 border-white/5 rounded-[2.5rem] transition-all duration-500 hover:border-gold/30">
            <CardContent className="p-0">
              <div className="relative aspect-square w-full overflow-hidden">
                <Image
                  src={product.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'}
                  alt={product.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
                {product.category && (
                  <div className="absolute top-6 left-6">
                    <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-obsidian/80 px-3 py-1 rounded-full backdrop-blur-sm">
                      {product.category}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start p-8 space-y-4">
              <h3 className="font-headline text-xl font-black italic tracking-tight text-white uppercase group-hover:text-gold transition-colors">{product.name}</h3>
              <div className="flex justify-between items-center w-full">
                <p className="text-2xl font-black italic tracking-tighter text-gold">KES {product.price.toLocaleString()}</p>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-12 w-12 rounded-xl border-white/10 bg-white/5 hover:bg-gold hover:text-obsidian hover:border-gold transition-all"
                  onClick={() => handleAddToCart(product)}
                >
                  <Plus className="h-5 w-5" />
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="text-center pt-8">
        <Link href="/shop" className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-gold italic hover:gap-5 transition-all">
          Explore The Full Collection <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
    </section>
  );
}
