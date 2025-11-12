'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreditCard, Lock, Mail, User, Phone } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

const checkoutSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'A valid phone number is required'),
  cardName: z.string().min(1, 'Name on card is required'),
  cardNumber: z.string().min(19, 'Card number must be 16 digits').max(19, 'Invalid card number'),
  cardExpiry: z.string().regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, 'Invalid expiry date (MM/YY)'),
  cardCvc: z.string().min(3, 'CVC must be 3-4 digits').max(4, 'CVC must be 3-4 digits'),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

// Feature 1: Animated Credit Card Component
function AnimatedCreditCard({ isFlipped, cardDetails }: { isFlipped: boolean, cardDetails: Partial<Pick<CheckoutFormValues, 'cardName' | 'cardNumber' | 'cardExpiry' | 'cardCvc'>> }) {
  return (
    <div className="w-full max-w-sm h-56 [transform-style:preserve-3d] transition-transform duration-500 mx-auto" style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}>
      {/* Front */}
      <div className="absolute w-full h-full [backface-visibility:hidden] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 flex flex-col justify-between text-white shadow-2xl">
        <div className="flex justify-between">
          <div className="w-12 h-8 bg-gray-600 rounded"></div>
          <p className="font-semibold text-lg">VISA</p>
        </div>
        <p className="font-mono tracking-widest text-xl">{cardDetails.cardNumber || '#### #### #### ####'}</p>
        <div className="flex justify-between">
          <div>
            <p className="text-xs">Card Holder</p>
            <p className="font-medium uppercase">{cardDetails.cardName || 'FULL NAME'}</p>
          </div>
          <div>
            <p className="text-xs">Expires</p>
            <p className="font-medium">{cardDetails.cardExpiry || 'MM/YY'}</p>
          </div>
        </div>
      </div>
      {/* Back */}
      <div className="absolute w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-2 flex flex-col justify-center text-white shadow-2xl">
        <div className="w-full h-10 bg-black mt-4"></div>
        <div className="bg-gray-200 mt-4 p-2 text-right">
          <p className="text-black font-mono text-sm">{cardDetails.cardCvc || '123'}</p>
        </div>
      </div>
    </div>
  );
}


function CheckoutPage() {
    const { cartItems, totalPrice, cartCount } = useCart();
    const router = useRouter();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);
    const [isCardFlipped, setIsCardFlipped] = useState(false);
    
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: '', lastName: '', email: '', phone: '',
            cardName: '', cardNumber: '', cardExpiry: '', cardCvc: '',
        }
    });
    
    const watchedCardDetails = form.watch(['cardName', 'cardNumber', 'cardExpiry', 'cardCvc']);

    if (cartCount === 0 && typeof window !== 'undefined') {
        router.push('/shop');
        return null;
    }

    const handleApplyPromo = () => {
        if (promoCode.toUpperCase() === 'MOV33') {
            setDiscount(0.10); // 10% discount
        } else {
            setDiscount(0);
        }
    };

    const subtotal = totalPrice;
    const discountAmount = subtotal * discount;
    const total = subtotal - discountAmount;

    const onSubmit = (data: CheckoutFormValues) => {
        console.log('Form submitted:', data);
        router.push('/order-success');
    }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-headline text-3xl font-extrabold mb-8">Checkout</h1>
        <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            
            {/* Left side: Form */}
            <div className="order-2 lg:order-1 space-y-8">
                <Card>
                    <CardHeader><CardTitle>Contact Information</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                            <FormField control={form.control} name="firstName" render={({ field }) => ( <FormItem><FormLabel>First Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                            <FormField control={form.control} name="lastName" render={({ field }) => ( <FormItem><FormLabel>Last Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                        <FormField control={form.control} name="email" render={({ field }) => ( <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="phone" render={({ field }) => ( <FormItem><FormLabel>Phone</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Payment Details</CardTitle></CardHeader>
                    <CardContent className="space-y-6">
                        <AnimatedCreditCard isFlipped={isCardFlipped} cardDetails={{
                            cardName: watchedCardDetails[0],
                            cardNumber: watchedCardDetails[1],
                            cardExpiry: watchedCardDetails[2],
                            cardCvc: watchedCardDetails[3],
                        }}/>
                        <FormField control={form.control} name="cardName" render={({ field }) => ( <FormItem><FormLabel>Name on Card</FormLabel><FormControl><Input {...field} onFocus={() => setIsCardFlipped(false)} /></FormControl><FormMessage /></FormItem> )} />
                        {/* Feature 2: Automatic Card Number Formatting */}
                        <FormField control={form.control} name="cardNumber" render={({ field }) => ( <FormItem><FormLabel>Card Number</FormLabel><FormControl><Input {...field} maxLength={19} onChange={e => field.onChange(e.target.value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 '))} onFocus={() => setIsCardFlipped(false)} /></FormControl><FormMessage /></FormItem> )} />
                        <div className="flex gap-4">
                             {/* Feature 3: Automatic Expiry Date Formatting */}
                             <FormField control={form.control} name="cardExpiry" render={({ field }) => ( <FormItem className="flex-1"><FormLabel>Expiry</FormLabel><FormControl><Input {...field} placeholder="MM/YY" maxLength={5} onChange={e => {
                                const value = e.target.value.replace(/\D/g, '');
                                if (value.length > 2) {
                                    field.onChange(`${value.slice(0,2)}/${value.slice(2,4)}`);
                                } else {
                                    field.onChange(value);
                                }
                             }} onFocus={() => setIsCardFlipped(false)} /></FormControl><FormMessage /></FormItem> )} />
                             {/* Feature 4: CVC focus flips card */}
                             <FormField control={form.control} name="cardCvc" render={({ field }) => ( <FormItem className="flex-1"><FormLabel>CVC</FormLabel><FormControl><Input {...field} maxLength={4} onFocus={() => setIsCardFlipped(true)} onBlur={() => setIsCardFlipped(false)} /></FormControl><FormMessage /></FormItem> )} />
                        </div>
                    </CardContent>
                </Card>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Lock className="mr-2 h-4 w-4" /> Pay KES {total.toLocaleString()}
                </Button>
            </div>

             {/* Right side: Order Summary */}
            <div className="order-1 lg:order-2">
                 <div className="sticky top-24 space-y-6">
                     <Card className="bg-card/50">
                        <CardHeader><CardTitle>Order Summary</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            {cartItems.map(item => (
                                <div key={item.id} className="flex items-center gap-4">
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
                        </CardContent>
                        <Separator />
                        <CardContent className="space-y-4">
                             <div className="flex gap-2">
                                <Input placeholder="Promo code" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} />
                                <Button type="button" variant="outline" onClick={handleApplyPromo}>Apply</Button>
                            </div>
                        </CardContent>
                        <Separator />
                        <CardContent className="space-y-2">
                            <div className="flex justify-between">
                                <p className="text-muted-foreground">Subtotal</p>
                                <p className="font-semibold">KES {subtotal.toLocaleString()}</p>
                            </div>
                            {/* Feature 5: Removed erroneous shipping cost for digital tickets */}
                            {discount > 0 && (
                                <div className="flex justify-between text-green-600 dark:text-green-400">
                                    <p>Discount ({promoCode})</p>
                                    <p className="font-semibold">-KES {discountAmount.toLocaleString()}</p>
                                </div>
                            )}
                        </CardContent>
                        <Separator />
                        <CardContent>
                            <div className="flex justify-between font-bold text-lg">
                                <p>Total</p>
                                <p>KES {total.toLocaleString()}</p>
                            </div>
                        </CardContent>
                     </Card>
                 </div>
            </div>

        </form>
        </Form>
    </div>
  )
}

export default CheckoutPage;

    