"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ShoppingCart, Plus } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/cart-context";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  category?: string;
  description?: string;
}

export function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  return (
    <Card className="group overflow-hidden rounded-[2rem] bg-white/5 border-white/5 transition-all duration-500 hover:border-gold/30 hover:shadow-2xl hover:shadow-gold/5">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Link href={`/shop/${product.id}`}>
            <Image
              src={product.imageUrl || 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab'}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-obsidian/60 to-transparent" />
          </Link>
          {product.category && (
            <div className="absolute top-4 left-4">
              <span className="text-[9px] font-black uppercase tracking-widest text-gold bg-obsidian/80 px-3 py-1 rounded-full backdrop-blur-sm">
                {product.category}
              </span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6 pb-3 space-y-2">
        <CardTitle className="font-headline text-lg font-black italic tracking-tight text-white uppercase leading-tight group-hover:text-gold transition-colors">
          <Link href={`/shop/${product.id}`}>{product.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-6 pt-2 flex justify-between items-center">
        <p className="text-xl font-black italic tracking-tighter text-gold">
          KES {product.price.toLocaleString()}
        </p>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10 rounded-xl border-white/10 bg-white/5 hover:bg-gold hover:text-obsidian hover:border-gold transition-all"
          onClick={handleAddToCart}
        >
          <Plus className="h-5 w-5" />
          <span className="sr-only">Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
