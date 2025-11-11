import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Product } from "@/lib/shop-data";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

export function ProductCard({ product }: { product: Product }) {
  return (
    <Card className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square w-full overflow-hidden">
          <Link href="#">
            <Image
              src={product.image.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={product.image.imageHint}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <p className="text-sm text-muted-foreground">{product.category}</p>
        <CardTitle className="mt-1 font-poppins text-lg font-semibold leading-tight">
            <Link href="#">{product.name}</Link>
        </CardTitle>
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between items-center">
        <p className="text-xl font-bold font-headline text-accent">
            KES {product.price.toLocaleString()}
        </p>
        <Button variant="outline" size="icon">
          <ShoppingCart className="h-5 w-5" />
          <span className="sr-only">Add to Cart</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
