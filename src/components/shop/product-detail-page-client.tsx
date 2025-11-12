'use client';

import { notFound } from 'next/navigation';
import { shopData, type Product } from '@/lib/shop-data';
import { ImageGallery } from '@/components/events/image-gallery';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Minus, Plus, ShoppingCart, Star } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useState } from 'react';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';

interface ProductDetailPageClientProps {
  product: Product;
}

export function ProductDetailPageClient({ product }: ProductDetailPageClientProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();

    const [quantity, setQuantity] = useState(1);
    const [selectedColor, setSelectedColor] = useState(product?.colors[0]);
    const [selectedSize, setSelectedSize] = useState(product?.sizes[0]);


    if (!product || !selectedColor || !selectedSize) {
        notFound();
    }

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image.imageUrl,
            quantity: quantity,
            variant: {
                name: `${selectedSize} / ${selectedColor.name}`,
                size: selectedSize,
                color: selectedColor.name,
            }
        });
        toast({
            title: "Added to Cart",
            description: `${product.name} (${selectedSize}, ${selectedColor.name}) has been added to your cart.`,
        });
    };

    return (
        <div className="bg-background text-foreground">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left Column: Image Gallery */}
                    <ImageGallery gallery={product.gallery} />

                    {/* Right Column: Product Info & Actions */}
                    <main>
                        <div className="space-y-6">
                            <div>
                                <Badge variant="outline">{product.category}</Badge>
                                <h1 className="font-headline text-4xl md:text-5xl font-extrabold text-foreground mt-2">
                                    {product.name}
                                </h1>
                                <div className="mt-2 flex items-center gap-2">
                                    <div className="flex items-center text-amber-500">
                                        <Star className="h-5 w-5" />
                                        <Star className="h-5 w-5" />
                                        <Star className="h-5 w-5" />
                                        <Star className="h-5 w-5" />
                                        <Star className="h-5 w-5 text-muted-foreground/50" />
                                    </div>
                                    <span className="text-sm text-muted-foreground">(12 reviews)</span>
                                </div>
                                <p className="font-headline text-3xl font-bold text-accent mt-4">
                                    KES {product.price.toLocaleString()}
                                </p>
                            </div>

                            <p className="text-muted-foreground font-body text-lg leading-relaxed">
                                {product.description}
                            </p>

                            <Separator />

                            {/* Color Selector */}
                            <div>
                                <Label className="font-poppins text-base font-semibold">Color: {selectedColor.name}</Label>
                                <RadioGroup defaultValue={selectedColor.name} onValueChange={(value) => setSelectedColor(product.colors.find(c => c.name === value)!)} className="flex gap-2 mt-2">
                                    {product.colors.map(color => (
                                        <RadioGroupItem
                                            key={color.name}
                                            value={color.name}
                                            id={`color-${color.name}`}
                                            className="h-8 w-8 rounded-full border-2"
                                            style={{ backgroundColor: color.hex, borderColor: 'hsl(var(--border))' }}
                                        />
                                    ))}
                                </RadioGroup>
                            </div>
                            
                            {/* Size Selector */}
                            <div>
                                 <Label className="font-poppins text-base font-semibold">Size</Label>
                                 <RadioGroup defaultValue={selectedSize} onValueChange={setSelectedSize} className="flex gap-2 mt-2">
                                    {product.sizes.map(size => (
                                        <Label key={size} htmlFor={`size-${size}`} className="relative flex items-center justify-center rounded-md border-2 h-12 w-12 cursor-pointer has-[:checked]:bg-primary has-[:checked]:text-primary-foreground has-[:checked]:border-primary transition-colors">
                                            <RadioGroupItem value={size} id={`size-${size}`} className="sr-only" />
                                            <span className='font-bold'>{size}</span>
                                        </Label>
                                    ))}
                                 </RadioGroup>
                            </div>
                            
                            <Separator />

                             {/* Quantity & Add to Cart */}
                            <div className='flex flex-col sm:flex-row gap-4'>
                                <div className='flex items-center gap-3 rounded-full border px-3 py-2'>
                                    <Button variant="ghost" size="icon" className='h-8 w-8 rounded-full' onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                                        <Minus className="h-4 w-4" />
                                    </Button>
                                    <span className='text-lg font-bold w-4 text-center'>{quantity}</span>
                                    <Button variant="ghost" size="icon" className='h-8 w-8 rounded-full' onClick={() => setQuantity(quantity + 1)}>
                                        <Plus className="h-4 w-4" />
                                    </Button>
                                </div>
                                <Button size="lg" className="w-full sm:w-auto flex-1 font-poppins text-lg rounded-full" onClick={handleAddToCart}>
                                    <ShoppingCart className="mr-2 h-5 w-5" /> Add to Cart
                                </Button>
                            </div>
                             <Button size="lg" variant="secondary" className="w-full font-poppins text-lg rounded-full bg-accent text-accent-foreground hover:bg-accent/90">
                                Buy Now
                            </Button>

                             <Accordion type="single" collapsible className="w-full">
                                <AccordionItem value="item-1">
                                    <AccordionTrigger>Product Details</AccordionTrigger>
                                    <AccordionContent>
                                    100% premium cotton. Machine wash cold, tumble dry low. Designed in Nairobi.
                                    </AccordionContent>
                                </AccordionItem>
                                <AccordionItem value="item-2">
                                    <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                                    <AccordionContent>
                                    Free shipping on orders over KES 5,000. Easy 30-day returns.
                                    </AccordionContent>
                                </AccordionItem>
                            </Accordion>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
}
