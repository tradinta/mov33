'use client';

import { notFound } from 'next/navigation';
import { shopData, type Product } from '@/lib/shop-data';
import type { Metadata } from 'next';
import { ProductCard } from '@/components/shop/product-card';
import { ImageGallery } from '@/components/events/image-gallery';
import { Separator } from '@/components/ui/separator';
import { ProductDetailPageClient } from '@/components/shop/product-detail-page-client';

type ProductDetailPageProps = {
  params: { id: string };
};

// Note: `generateMetadata` doesn't work in a 'use client' component in the same file.
// We are keeping the page as a client component for now to handle cart context and state.
// For full metadata support, we'd refactor this into a server component fetching data
// and passing it to a client component.

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
    const product = shopData.find(p => p.id === params.id);
    
    if (!product) {
        notFound();
    }
    
    const relatedProducts = shopData.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

    return (
       <>
        <ProductDetailPageClient product={product} />
         {/* Related Products */}
        <div className="bg-background text-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <Separator />
                <div className="py-12">
                    <h2 className="font-headline text-3xl font-bold text-center">You Might Also Like</h2>
                    <div className="mt-8 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
       </>
    );
}