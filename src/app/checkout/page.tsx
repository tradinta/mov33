'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { Lock, Ticket, User, Mail, Phone, ParkingCircle, Shirt } from 'lucide-react';

const ticketHolderSchema = z.object({
    fullName: z.string().min(1, 'Full name is required'),
    email: z.string().email('Invalid email address'),
});

const checkoutSchema = z.object({
  contactName: z.string().min(1, 'Your name is required'),
  contactEmail: z.string().email('Invalid email address'),
  contactPhone: z.string().min(10, 'A valid phone number is required'),
  ticketHolders: z.array(ticketHolderSchema),
  addOns: z.object({
    parking: z.boolean().default(false),
    tshirt: z.boolean().default(false),
  }).optional(),
  orderNotes: z.string().optional(),
  subscribe: z.boolean().default(false),
  saveDetails: z.boolean().default(false),
});

type CheckoutFormValues = z.infer<typeof checkoutSchema>;

const ADD_ON_PRICES = {
  parking: 500,
  tshirt: 2500,
};

function CheckoutPage() {
    const { cartItems, totalPrice, cartCount, clearCart } = useCart();
    const router = useRouter();
    const [promoCode, setPromoCode] = useState('');
    const [discount, setDiscount] = useState(0);

    const individualTickets = React.useMemo(() => {
        return cartItems.flatMap(item => Array.from({ length: item.quantity }, (_, i) => ({
            ...item,
            uniqueId: `${item.id}-${i}`
        })));
    }, [cartItems]);
    
    const form = useForm<CheckoutFormValues>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            contactName: '',
            contactEmail: '',
            contactPhone: '',
            ticketHolders: individualTickets.map(() => ({ fullName: '', email: '' })),
            addOns: { parking: false, tshirt: false },
            orderNotes: '',
            subscribe: false,
            saveDetails: false,
        }
    });

    const { fields } = useFieldArray({
        control: form.control,
        name: "ticketHolders"
    });

    const watchedAddOns = form.watch('addOns');

    if (cartCount === 0 && typeof window !== 'undefined') {
        router.push('/events');
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
    const addOnTotal = (watchedAddOns?.parking ? ADD_ON_PRICES.parking : 0) + (watchedAddOns?.tshirt ? ADD_ON_PRICES.tshirt : 0);
    const totalBeforeDiscount = subtotal + addOnTotal;
    const discountAmount = totalBeforeDiscount * discount;
    const finalTotal = totalBeforeDiscount - discountAmount;

    const onSubmit = (data: CheckoutFormValues) => {
        console.log('Form submitted:', data);
        // Here you would typically integrate with Paystack or another payment provider
        clearCart();
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
                    <CardHeader>
                        <CardTitle>Your Information</CardTitle>
                        <CardDescription>This information will be used for your receipt.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="contactName" render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="contactEmail" render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} /></FormControl><FormMessage /></FormItem> )} />
                        <FormField control={form.control} name="contactPhone" render={({ field }) => ( <FormItem><FormLabel>Phone Number</FormLabel><FormControl><Input type="tel" {...field} /></FormControl><FormMessage /></FormItem> )} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Ticket Holder Details</CardTitle>
                        <CardDescription>Assign each ticket to an attendee. This name will appear on the ticket.</CardDescription>
                    </CardHeader>
                    <CardContent>
                         <Accordion type="multiple" defaultValue={['item-0']} className="w-full">
                            {fields.map((field, index) => {
                                const originalItem = individualTickets[index];
                                return (
                                    <AccordionItem value={`item-${index}`} key={field.id}>
                                        <AccordionTrigger>
                                            <div className="flex items-center gap-2">
                                                <Ticket className="h-5 w-5 text-accent"/>
                                                <span className="font-semibold">Ticket #{index + 1}</span>
                                                <span className="text-sm text-muted-foreground">({originalItem?.name} - {originalItem?.variant.name})</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pt-4 space-y-4">
                                             <FormField control={form.control} name={`ticketHolders.${index}.fullName`} render={({ field }) => ( <FormItem><FormLabel>Full Name</FormLabel><FormControl><Input {...field} placeholder="e.g., Jane Doe" /></FormControl><FormMessage /></FormItem> )} />
                                             <FormField control={form.control} name={`ticketHolders.${index}.email`} render={({ field }) => ( <FormItem><FormLabel>Email Address</FormLabel><FormControl><Input type="email" {...field} placeholder="jane.doe@example.com" /></FormControl><FormMessage /></FormItem> )} />
                                        </AccordionContent>
                                    </AccordionItem>
                                )
                            })}
                        </Accordion>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader><CardTitle>Event Extras</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="addOns.parking" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base flex items-center gap-2"><ParkingCircle/> Secure Parking Pass</FormLabel>
                                    <FormDescription>Pre-book your parking spot near the venue.</FormDescription>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="font-semibold">KES {ADD_ON_PRICES.parking.toLocaleString()}</span>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </div>
                            </FormItem>
                        )}/>
                         <FormField control={form.control} name="addOns.tshirt" render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                                <div className="space-y-0.5">
                                    <FormLabel className="text-base flex items-center gap-2"><Shirt/> Exclusive Event T-Shirt</FormLabel>
                                    <FormDescription>Pick it up at the event merchandise stand.</FormDescription>
                                </div>
                                 <div className="flex items-center gap-2">
                                    <span className="font-semibold">KES {ADD_ON_PRICES.tshirt.toLocaleString()}</span>
                                    <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl>
                                </div>
                            </FormItem>
                        )}/>
                    </CardContent>
                </Card>
                
                <Card>
                    <CardHeader><CardTitle>Final Details</CardTitle></CardHeader>
                    <CardContent className="space-y-4">
                        <FormField control={form.control} name="orderNotes" render={({ field }) => ( <FormItem><FormLabel>Notes for the Organizer (Optional)</FormLabel><FormControl><Textarea {...field} placeholder="e.g., Accessibility requirements, special requests..." /></FormControl></FormItem> )} />
                         <FormField control={form.control} name="subscribe" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Receive updates from the event organizer about future events.</FormLabel></div></FormItem>)} />
                         <FormField control={form.control} name="saveDetails" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>Save my details for a faster checkout next time.</FormLabel></div></FormItem>)} />
                    </CardContent>
                </Card>

                <Button type="submit" className="w-full bg-accent hover:bg-accent/90" size="lg">
                    <Lock className="mr-2 h-4 w-4" /> Proceed to Payment - KES {finalTotal.toLocaleString()}
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
                                <p className="text-muted-foreground">Ticket Subtotal</p>
                                <p className="font-semibold">KES {subtotal.toLocaleString()}</p>
                            </div>
                             {addOnTotal > 0 && (
                                <div className="flex justify-between">
                                    <p className="text-muted-foreground">Add-ons</p>
                                    <p className="font-semibold">KES {addOnTotal.toLocaleString()}</p>
                                </div>
                            )}
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
                                <p>KES {finalTotal.toLocaleString()}</p>
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
