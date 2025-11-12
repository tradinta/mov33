'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCart, CartItem } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from '@/components/ui/sheet';
import { Minus, Plus, ShoppingCart, Trash2, X } from 'lucide-react';
import { Separator } from '../ui/separator';
import { ScrollArea } from '../ui/scroll-area';

function CartItemCard({ item }: { item: CartItem }) {
  const { updateQuantity, removeFromCart } = useCart();

  return (
    <div className="flex items-start gap-4 py-4">
      <Image
        src={item.image}
        alt={item.name}
        width={80}
        height={80}
        className="rounded-md object-cover"
      />
      <div className="flex-1">
        <h4 className="font-semibold text-base">{item.name}</h4>
        <p className="text-sm text-muted-foreground">
          {item.size} / {item.color}
        </p>
        <p className="font-semibold text-base mt-1">KES {item.price.toLocaleString()}</p>
        <div className="flex items-center gap-2 mt-2">
            <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity - 1)}
            >
                <Minus className="h-3 w-3" />
            </Button>
            <span className="w-6 text-center font-bold text-sm">{item.quantity}</span>
            <Button
                variant="outline"
                size="icon"
                className="h-7 w-7"
                onClick={() => updateQuantity(item.id, item.size, item.color, item.quantity + 1)}
            >
                <Plus className="h-3 w-3" />
            </Button>
        </div>
      </div>
      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => removeFromCart(item.id, item.size, item.color)}>
        <X className="h-4 w-4 text-muted-foreground" />
      </Button>
    </div>
  );
}

export function Cart() {
  const { cartItems, cartCount, totalPrice, clearCart } = useCart();

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="relative rounded-full">
          <ShoppingCart className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
              {cartCount}
            </span>
          )}
          <span className="sr-only">Open cart</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full flex-col pr-0 sm:max-w-lg">
        <SheetHeader className="px-6">
          <SheetTitle className="font-headline text-2xl">Your Cart</SheetTitle>
        </SheetHeader>
        <Separator />
        {cartItems.length > 0 ? (
          <>
            <ScrollArea className="flex-1 overflow-y-auto">
                <div className="px-6">
                    {cartItems.map(item => (
                        <CartItemCard key={`${item.id}-${item.size}-${item.color}`} item={item} />
                    ))}
                </div>
            </ScrollArea>
            <Separator />
            <SheetFooter className="bg-background/95 p-6 space-y-4">
                <div className='flex justify-between items-center text-lg font-semibold'>
                    <p>Subtotal</p>
                    <p>KES {totalPrice.toLocaleString()}</p>
                </div>
                <SheetClose asChild>
                    <Button asChild size="lg" className="w-full text-lg font-poppins">
                        <Link href="/checkout">Proceed to Checkout</Link>
                    </Button>
                </SheetClose>
                <Button variant="outline" className="w-full" onClick={clearCart}>
                    <Trash2 className="mr-2 h-4 w-4" /> Clear Cart
                </Button>
            </SheetFooter>
          </>
        ) : (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <ShoppingCart className="h-16 w-16 text-muted-foreground" />
            <h3 className="font-headline text-xl font-semibold">Your cart is empty</h3>
            <p className="text-muted-foreground">Looks like you haven't added anything to your cart yet.</p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}