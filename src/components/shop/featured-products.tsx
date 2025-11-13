
'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { shopData } from '@/lib/shop-data';
import { Card, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ArrowRight } from 'lucide-react';

export function FeaturedProducts() {
  // Get 3 random products to feature
  const featuredProducts = React.useMemo(() => {
    return shopData.slice().sort(() => 0.5 - Math.random()).slice(0, 3);
  }, []);

  return (
    <Carousel
      opts={{
        align: 'start',
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent>
        {featuredProducts.map((product) => (
          <CarouselItem key={product.id}>
            <Card className="overflow-hidden border-none shadow-none rounded-2xl">
              <CardContent className="relative p-0 aspect-[16/9]">
                <Image
                  src={product.image.imageUrl}
                  alt={product.name}
                  fill
                  className="object-cover"
                  data-ai-hint={product.image.imageHint}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8 text-white">
                  <Badge variant="secondary">Featured Product</Badge>
                  <h2 className="font-headline text-3xl md:text-4xl font-bold mt-2 max-w-lg">
                    {product.name}
                  </h2>
                  <p className="mt-2 text-sm max-w-md">
                    {product.description}
                  </p>
                  <Link href={`/shop/${product.id}`}>
                    <Button
                      variant="secondary"
                      className="mt-4 font-poppins"
                    >
                      View Details <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden md:block">
        <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2" />
        <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2" />
      </div>
    </Carousel>
  );
}
