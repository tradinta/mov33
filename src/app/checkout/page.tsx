'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, CreditCard, Lock, Mail, User } from 'lucide-react';
import { cn } from '@/lib/utils';


// Dummy Component for the animated credit card
function AnimatedCreditCard({ isFlipped, cardDetails }: { isFlipped: boolean, cardDetails: any }) {
  return (
    <div className="w-full max-w-sm h-56 [transform-style:preserve-3d] transition-transform duration-500" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
      {/* Front */}
      <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 flex flex-col justify-between text-white shadow-2xl">
        <div className="flex justify-between">
          <div className="w-12 h-8 bg-gray-600 rounded"></div>
          <p className="font-semibold text-lg">VISA</p>
        </div>
        <p className="font-mono tracking-widest text-xl">{cardDetails.number || '#### #### #### ####'}</p>
        <div className="flex justify-between">
          <div>
            <p className="text-xs">Card Holder</p>
            <p className="font-medium">{cardDetails.name || 'FULL NAME'}</p>
          </div>
          <div>
            <p className="text-xs">Expires</p>
            <p className="font-medium">{cardDetails.expiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>
      {/* Back */}
      <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2 flex flex-col justify-center text-white shadow-2xl">
        <div className="w-full h-10 bg-black"></div>
        <div className="bg-gray-200 mt-4 p-2 text-right">
          <p className="text-black font-mono text-sm">{cardDetails.cvc || '123'}</p>
        </div>
      </div>
    </div>
  );
}


function CheckoutPage() {
    const { cartItems, totalPrice, cartCount } = useCart();
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    const [cardDetails, setCardDetails] = useState({ name: '', number: '', expiry: '', cvc: '' });

    if (cartCount === 0 && typeof window !== 'undefined') {
        router.push('/shop');
        return null;
    }

    const subtotal = totalPrice;
    const shipping = 500; // Example shipping cost
    const total = subtotal + shipping;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        let formattedValue = value;
        if (name === 'number') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ');
        }
        if (name === 'expiry') {
            formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/');
        }

        setCardDetails(prev => ({ ...prev, [name]: formattedValue }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // In a real app, process payment here
        router.push('/order-success');
    }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* Left side: Form */}
            <div className="order-2 lg:order-1">
                 <div className="flex items-center gap-4 mb-8">
                     <Button variant="outline" size="icon" disabled={currentStep === 1} onClick={() => setCurrentStep(s => s - 1)}>
                        <ArrowLeft />
                     </Button>
                     <h1 className="font-headline text-3xl font-extrabold">Checkout</h1>
                </div>
                <div className="relative">
                     <div className={cn("transition-opacity duration-300", currentStep === 1 ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none")}>
                        <h2 className="font-poppins text-lg font-semibold mb-4">Contact Information</h2>
                         <div className="space-y-4">
                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <div className="relative mt-1">
                                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="you@example.com" className="pl-10"/>
                                </div>
                            </div>
                            <Button onClick={() => setCurrentStep(2)} className="w-full" size="lg">Continue</Button>
                         </div>
                    </div>
                     <div className={cn("transition-opacity duration-300", currentStep === 2 ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none")}>
                        <h2 className="font-poppins text-lg font-semibold mb-4">Payment Details</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                           <AnimatedCreditCard isFlipped={isCardFlipped} cardDetails={cardDetails} />
                            <div>
                                <Label htmlFor="name">Name on Card</Label>
                                <Input id="name" name="name" placeholder="John M. Doe" value={cardDetails.name} onChange={handleInputChange} onFocus={() => setIsCardFlipped(false)} required/>
                            </div>
                            <div>
                                <Label htmlFor="number">Card Number</Label>
                                <Input id="number" name="number" placeholder="0000 0000 0000 0000" maxLength={19} value={cardDetails.number} onChange={handleInputChange} onFocus={() => setIsCardFlipped(false)} required/>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <Label htmlFor="expiry">Expiry</Label>
                                    <Input id="expiry" name="expiry" placeholder="MM/YY" maxLength={5} value={cardDetails.expiry} onChange={handleInputChange} onFocus={() => setIsCardFlipped(false)} required/>
                                </div>
                                <div className="flex-1">
                                    <Label htmlFor="cvc">CVC</Label>
                                    <Input id="cvc" name="cvc" placeholder="123" maxLength={4} value={cardDetails.cvc} onChange={handleInputChange} onFocus={() => setIsCardFlipped(true)} required/>
                                </div>
                            </div>
                            <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                                <Lock className="mr-2 h-4 w-4" /> Pay KES {total.toLocaleString()}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>

             {/* Right side: Order Summary */}
            <div className="order-1 lg:order-2">
                 <Card className="bg-card/50">
                    <CardContent className="p-6">
                        <h2 className="font-poppins text-lg font-semibold mb-4">Order Summary</h2>
                         <div className="space-y-4">
                            {cartItems.map(item => (
                                <div key={`${item.id}-${item.variant.size}-${item.variant.color}`} className="flex items-center gap-4">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden border">
                                        <Image src={item.image} alt={item.name} fill className="object-cover"/>
                                        <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{item.quantity}</span>
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-semibold">{item.name}</p>
                                         <p className="text-sm text-muted-foreground">{item.variant.name}</p>
                                    </div>
                                    <p className="font-semibold">KES {(item.price * item.quantity).toLocaleString()}</p>
                                </div>
                            ))}
                         </div>
                        <Separator className="my-6" />
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p className="font-semibold">KES {subtotal.toLocaleString()}</p>
                            </div>
                             <div className="flex justify-between">
                                <p className="text-muted-foreground">Shipping</p>
                                <p className="font-semibold">KES {shipping.toLocaleString()}</p>
                            </div>
                        </div>
                        <Separator className="my-6" />
                        <div className="flex justify-between font-bold text-lg">
                            <p>Total</p>
                            <p>KES {total.toLocaleString()}</p>
                        </div>
                    </CardContent>
                 </Card>
            </div>

        </div>
    </div>
  )
}

export default CheckoutPage;
