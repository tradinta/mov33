'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCart } from '@/context/cart-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { Lock, ParkingCircle, ShieldCheck, Smartphone, Send, CreditCard, Loader2, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { motion, AnimatePresence } from 'framer-motion';
import { firestore } from '@/firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import { Promocode } from '@/lib/types';
import { cn } from '@/lib/utils';

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
type PaymentGateway = 'card' | 'mpesa';
type PaymentStep = 'details' | 'gateway' | 'processing';

const ADD_ON_PRICES = {
    parking: 500,
    tshirt: 2500,
};

function CheckoutPage() {
    const { cartItems, totalPrice, cartCount, clearCart } = useCart();
    const router = useRouter();
    const { toast } = useToast();
    const [promoCode, setPromoCode] = useState('');
    const [appliedPromo, setAppliedPromo] = useState<Promocode | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentStep, setPaymentStep] = useState<PaymentStep>('details');
    const [paymentGateway, setPaymentGateway] = useState<PaymentGateway>('card');
    const [processingMessage, setProcessingMessage] = useState('');
    const [checkoutId, setCheckoutId] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

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
            contactPhone: '254',
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

    // Cleanup polling on unmount
    useEffect(() => {
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
            }
        };
    }, []);

    if (cartCount === 0 && typeof window !== 'undefined') {
        router.push('/events');
        return null;
    }

    const handleApplyPromo = async () => {
        if (!promoCode) return;
        try {
            const q = query(collection(firestore, 'promocodes'), where('code', '==', promoCode.toUpperCase()), where('active', '==', true));
            const snap = await getDocs(q);

            if (snap.empty) {
                toast({
                    title: "Invalid Code",
                    description: "This promo code doesn't exist or is inactive.",
                    variant: "destructive"
                });
                setAppliedPromo(null);
                return;
            }

            const promoData = { id: snap.docs[0].id, ...snap.docs[0].data() } as Promocode;
            setAppliedPromo(promoData);
            toast({
                title: "Code Applied!",
                description: `You've received a ${promoData.discountType === 'percentage' ? promoData.discountValue + '%' : 'KES ' + promoData.discountValue} discount.`,
            });
        } catch (error) {
            console.error("Promo error:", error);
            toast({
                title: "Verification Failed",
                description: "Could not verify promo code. Try again.",
                variant: "destructive"
            });
        }
    };

    const subtotal = totalPrice;
    const addOnTotal = (watchedAddOns?.parking ? ADD_ON_PRICES.parking : 0) + (watchedAddOns?.tshirt ? ADD_ON_PRICES.tshirt : 0);
    const totalBeforeDiscount = subtotal + addOnTotal;

    let discountAmount = 0;
    if (appliedPromo) {
        if (appliedPromo.discountType === 'percentage') {
            discountAmount = totalBeforeDiscount * (appliedPromo.discountValue / 100);
        } else {
            discountAmount = appliedPromo.discountValue;
        }
    }

    const finalTotal = totalBeforeDiscount - discountAmount;

    const onSubmit = (data: CheckoutFormValues) => {
        setPaymentStep('gateway');
    };

    const startPolling = (id: string) => {
        setCheckoutId(id);
        let attempts = 0;
        const maxAttempts = 60; // 2 minutes max

        pollingRef.current = setInterval(async () => {
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(pollingRef.current!);
                setIsProcessing(false);
                toast({
                    title: "Payment Timeout",
                    description: "We couldn't verify your payment. Please check your order history.",
                    variant: "destructive"
                });
                return;
            }

            try {
                const res = await fetch(`/api/payments/status/${id}`);
                const data = await res.json();

                if (data.status === 'paid') {
                    clearInterval(pollingRef.current!);
                    setProcessingMessage('Payment confirmed! Generating tickets...');
                    await new Promise(r => setTimeout(r, 1500));
                    clearCart();
                    router.push(`/order-success?orderId=${data.orderId}`);
                }
            } catch (error) {
                console.error('Polling error:', error);
            }
        }, 2000);
    };

    const handleMpesaPay = async () => {
        setIsProcessing(true);
        setPaymentStep('processing');
        setProcessingMessage('Sending STK Push to your phone...');

        try {
            const formData = form.getValues();
            const reference = `MOV-${Date.now().toString().slice(-8)}`;

            // 1. Initiate STK Push
            const response = await fetch('/api/payments/stkpush', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    phoneNumber: formData.contactPhone,
                    amount: Math.round(finalTotal),
                    reference
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to trigger M-Pesa push');
            }

            // 2. Create Order in Firestore
            await addDoc(collection(firestore, 'orders'), {
                contactName: formData.contactName,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                items: cartItems,
                ticketHolders: formData.ticketHolders,
                subtotal,
                addOnTotal,
                discountAmount,
                total: finalTotal,
                status: 'pending',
                paymentGateway: 'mpesa',
                promoCode: appliedPromo?.code || null,
                promocodeId: appliedPromo?.id || null,
                influencerId: appliedPromo?.influencerId || null,
                checkoutRequestId: result.checkoutRequestId,
                createdAt: serverTimestamp()
            });

            setProcessingMessage('Waiting for you to enter your PIN...');
            toast({
                title: "Push Sent!",
                description: "Check your phone to complete payment.",
            });

            // Start polling for payment confirmation
            startPolling(result.checkoutRequestId);

        } catch (error: any) {
            setIsProcessing(false);
            setPaymentStep('gateway');
            toast({
                title: "Payment Failed",
                description: error.message || "An error occurred. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handlePaystackPay = async () => {
        setIsProcessing(true);
        setPaymentStep('processing');
        setProcessingMessage('Initializing secure payment...');

        try {
            const formData = form.getValues();
            const reference = `MOV-${Date.now().toString().slice(-8)}`;

            // 1. Create Order in Firestore first
            const orderRef = await addDoc(collection(firestore, 'orders'), {
                contactName: formData.contactName,
                contactEmail: formData.contactEmail,
                contactPhone: formData.contactPhone,
                items: cartItems,
                ticketHolders: formData.ticketHolders,
                subtotal,
                addOnTotal,
                discountAmount,
                total: finalTotal,
                status: 'pending',
                paymentGateway: 'paystack',
                promoCode: appliedPromo?.code || null,
                promocodeId: appliedPromo?.id || null,
                influencerId: appliedPromo?.influencerId || null,
                paystackReference: reference,
                createdAt: serverTimestamp()
            });

            // 2. Initialize Paystack transaction
            const response = await fetch('/api/payments/paystack/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.contactEmail,
                    amount: Math.round(finalTotal),
                    reference,
                    orderId: orderRef.id,
                })
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Failed to initialize payment');
            }

            setProcessingMessage('Redirecting to secure payment page...');

            // 3. Redirect to Paystack
            window.location.href = result.authorizationUrl;

        } catch (error: any) {
            setIsProcessing(false);
            setPaymentStep('gateway');
            toast({
                title: "Payment Failed",
                description: error.message || "An error occurred. Please try again.",
                variant: "destructive"
            });
        }
    };

    return (
        <div className="min-h-screen bg-obsidian text-white py-12">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 mb-12"
                >
                    <div className="h-12 w-12 rounded-2xl bg-kenyan-green flex items-center justify-center shadow-lg shadow-kenyan-green/20">
                        <ShieldCheck className="text-white h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Secure Checkout</h1>
                        <p className="text-muted-foreground font-medium">Your tickets are reserved for the next 15 minutes.</p>
                    </div>
                </motion.div>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">

                        {/* Left side: Form */}
                        <div className="order-2 lg:order-1 space-y-10">
                            <AnimatePresence mode="wait">
                                {paymentStep === 'details' && (
                                    <motion.div
                                        key="details"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="space-y-10"
                                    >
                                        <GlassCard className="p-8 border-white/5">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-2 w-6 bg-kenyan-green rounded-full" />
                                                <h2 className="text-xl font-bold uppercase tracking-widest italic">Personal Information</h2>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-poppins">
                                                <FormField control={form.control} name="contactName" render={({ field }) => (<FormItem><FormLabel className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Full Name</FormLabel><FormControl><Input className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-gold/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="contactEmail" render={({ field }) => (<FormItem><FormLabel className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Email Address</FormLabel><FormControl><Input type="email" className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-gold/50" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                <FormField control={form.control} name="contactPhone" render={({ field }) => (<FormItem className="md:col-span-2"><FormLabel className="text-muted-foreground uppercase text-[10px] font-black tracking-widest">Phone Number</FormLabel><FormControl><Input type="tel" className="bg-white/5 border-white/5 h-12 rounded-xl focus:border-gold/50 text-xl font-black tracking-tighter" {...field} /></FormControl><FormDescription className="text-[10px] italic">Required for M-Pesa and order updates.</FormDescription><FormMessage /></FormItem>)} />
                                            </div>
                                        </GlassCard>

                                        <GlassCard className="p-8 border-white/5">
                                            <div className="flex items-center gap-3 mb-6">
                                                <div className="h-2 w-6 bg-gold rounded-full" />
                                                <h2 className="text-xl font-bold uppercase tracking-widest italic">Add-ons & Extras</h2>
                                            </div>
                                            <div className="space-y-4">
                                                <FormField control={form.control} name="addOns.parking" render={({ field }) => (
                                                    <div className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${field.value ? 'bg-kenyan-green/10 border-kenyan-green/30' : 'bg-white/5 border-white/5'}`}>
                                                        <div className="flex items-center gap-4">
                                                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${field.value ? 'bg-kenyan-green text-white' : 'bg-white/5 text-muted-foreground'}`}>
                                                                <ParkingCircle className="h-5 w-5" />
                                                            </div>
                                                            <div>
                                                                <div className="font-bold text-sm">Secure Parking</div>
                                                                <div className="text-[10px] text-muted-foreground">Reserved spot at the venue</div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-4">
                                                            <span className="font-black text-sm tracking-tighter">KES {ADD_ON_PRICES.parking.toLocaleString()}</span>
                                                            <FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} className="h-6 w-6 rounded-lg border-white/20 data-[state=checked]:bg-kenyan-green" /></FormControl>
                                                        </div>
                                                    </div>
                                                )} />
                                            </div>
                                        </GlassCard>

                                        <Button type="submit" className="w-full bg-kenyan-green hover:bg-kenyan-green/90 text-white font-black text-xl h-20 rounded-3xl shadow-2xl shadow-kenyan-green/20 group uppercase tracking-tight">
                                            <Lock className="mr-3 h-6 w-6" />
                                            Continue to Payment - KES {finalTotal.toLocaleString()}
                                        </Button>
                                    </motion.div>
                                )}

                                {paymentStep === 'gateway' && (
                                    <motion.div
                                        key="gateway"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className="space-y-8"
                                    >
                                        <GlassCard className="p-8 border-white/5">
                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center gap-3">
                                                    <div className="h-2 w-6 bg-gold rounded-full" />
                                                    <h2 className="text-xl font-bold uppercase tracking-widest italic">Choose Payment Method</h2>
                                                </div>
                                                <button type="button" onClick={() => setPaymentStep('details')} className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground hover:text-white">
                                                    Back
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 mb-8">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentGateway('card')}
                                                    className={cn(
                                                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group",
                                                        paymentGateway === 'card'
                                                            ? "border-gold bg-gold/10"
                                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors",
                                                        paymentGateway === 'card' ? "bg-gold text-obsidian" : "bg-white/10 text-white"
                                                    )}>
                                                        <CreditCard className="h-8 w-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-black uppercase tracking-tight">Card / Mobile</div>
                                                        <div className="text-[10px] text-muted-foreground">Visa, Mastercard, Apple Pay</div>
                                                    </div>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentGateway('mpesa')}
                                                    className={cn(
                                                        "p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 group",
                                                        paymentGateway === 'mpesa'
                                                            ? "border-kenyan-green bg-kenyan-green/10"
                                                            : "border-white/10 bg-white/5 hover:border-white/20"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "h-16 w-16 rounded-2xl flex items-center justify-center transition-colors",
                                                        paymentGateway === 'mpesa' ? "bg-kenyan-green text-white" : "bg-white/10 text-white"
                                                    )}>
                                                        <Smartphone className="h-8 w-8" />
                                                    </div>
                                                    <div className="text-center">
                                                        <div className="font-black uppercase tracking-tight">M-Pesa</div>
                                                        <div className="text-[10px] text-muted-foreground">STK Push to {form.getValues('contactPhone')}</div>
                                                    </div>
                                                </button>
                                            </div>

                                            <div className="bg-white/5 p-6 rounded-3xl border border-white/5 text-center mb-8">
                                                <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-black mb-2">Amount to Pay</div>
                                                <div className="text-5xl font-black tracking-tighter italic text-gold">KES {finalTotal.toLocaleString()}</div>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={paymentGateway === 'mpesa' ? handleMpesaPay : handlePaystackPay}
                                                disabled={isProcessing}
                                                className={cn(
                                                    "w-full font-black text-xl h-20 rounded-3xl shadow-2xl disabled:opacity-50",
                                                    paymentGateway === 'mpesa'
                                                        ? "bg-kenyan-green hover:bg-kenyan-green/90 text-white shadow-kenyan-green/20"
                                                        : "bg-gold hover:bg-gold/90 text-obsidian shadow-gold/20"
                                                )}
                                            >
                                                {paymentGateway === 'mpesa' ? (
                                                    <>
                                                        <Send className="mr-3 h-6 w-6" />
                                                        Trigger STK Push
                                                    </>
                                                ) : (
                                                    <>
                                                        <CreditCard className="mr-3 h-6 w-6" />
                                                        Pay with Card
                                                    </>
                                                )}
                                            </Button>
                                        </GlassCard>

                                        <div className="flex justify-center gap-8">
                                            <div className="flex items-center gap-2 opacity-40">
                                                <div className="h-2 w-2 rounded-full bg-gold" />
                                                <span className="text-[10px] uppercase font-black">PCI DSS Secure</span>
                                            </div>
                                            <div className="flex items-center gap-2 opacity-40">
                                                <div className="h-2 w-2 rounded-full bg-kenyan-green" />
                                                <span className="text-[10px] uppercase font-black">Encrypted</span>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {paymentStep === 'processing' && (
                                    <motion.div
                                        key="processing"
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="space-y-8"
                                    >
                                        <GlassCard className="p-12 border-gold/20 flex flex-col items-center text-center">
                                            <div className="h-32 w-32 rounded-full bg-gold/10 flex items-center justify-center mb-8 relative">
                                                {isProcessing ? (
                                                    <>
                                                        <Loader2 className="h-16 w-16 text-gold animate-spin" />
                                                        <motion.div
                                                            className="absolute inset-0 rounded-full border-4 border-gold/30"
                                                            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                                            transition={{ repeat: Infinity, duration: 2 }}
                                                        />
                                                    </>
                                                ) : (
                                                    <CheckCircle2 className="h-16 w-16 text-kenyan-green" />
                                                )}
                                            </div>

                                            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
                                                {isProcessing ? 'Processing Payment' : 'Payment Complete'}
                                            </h2>
                                            <p className="text-muted-foreground max-w-sm">
                                                {processingMessage}
                                            </p>

                                            {isProcessing && paymentGateway === 'mpesa' && (
                                                <div className="mt-8 text-[10px] uppercase tracking-widest text-gold/60 font-black animate-pulse">
                                                    Waiting for confirmation...
                                                </div>
                                            )}
                                        </GlassCard>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Right side: Order Summary */}
                        <div className="order-1 lg:order-2">
                            <div className="sticky top-24">
                                <GlassCard className="border-white/5 bg-white/[0.02]">
                                    <div className="p-8 space-y-8">
                                        <h3 className="text-lg font-bold uppercase tracking-widest italic">Cart Summary</h3>
                                        <div className="space-y-6">
                                            {cartItems.map(item => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="relative h-20 w-20 rounded-2xl overflow-hidden border border-white/10 group">
                                                        <Image src={item.image} alt={item.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        <span className="absolute -top-1 -right-1 bg-gold text-obsidian text-[10px] font-black rounded-full h-6 w-6 flex items-center justify-center border-2 border-obsidian z-20">
                                                            {item.quantity}
                                                        </span>
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-black text-sm uppercase tracking-tight">{item.name}</p>
                                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{item.variant.name}</p>
                                                    </div>
                                                    <p className="font-black tracking-tighter">KES {(item.price * item.quantity).toLocaleString()}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="pt-4 border-t border-white/5 space-y-4">
                                            <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Promo Code</div>
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="REDEEM"
                                                    className="bg-white/5 border-white/5 h-10 rounded-xl focus:border-gold/50 font-black uppercase tracking-tighter"
                                                    value={promoCode}
                                                    onChange={(e) => setPromoCode(e.target.value)}
                                                />
                                                <Button
                                                    type="button"
                                                    onClick={handleApplyPromo}
                                                    className="bg-gold hover:bg-gold/90 text-obsidian font-bold rounded-xl h-10 px-4 text-xs"
                                                >
                                                    Apply
                                                </Button>
                                            </div>
                                        </div>

                                        <Separator className="bg-white/5" />
                                        <div className="space-y-4 font-poppins text-xs font-bold uppercase tracking-widest">
                                            <div className="flex justify-between text-muted-foreground">
                                                <span>Tickets Subtotal</span>
                                                <span className="text-white">KES {subtotal.toLocaleString()}</span>
                                            </div>
                                            {addOnTotal > 0 && (
                                                <div className="flex justify-between text-muted-foreground">
                                                    <span>Add-ons</span>
                                                    <span className="text-white">KES {addOnTotal.toLocaleString()}</span>
                                                </div>
                                            )}
                                            {appliedPromo && (
                                                <div className="flex justify-between text-kenyan-green">
                                                    <span>Discount ({appliedPromo.code})</span>
                                                    <span>-KES {discountAmount.toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="pt-4 mt-4 border-t border-dashed border-white/10">
                                            <div className="flex justify-between items-end">
                                                <span className="text-xs uppercase font-black text-muted-foreground tracking-widest">Total Payable</span>
                                                <div className="text-3xl font-black tracking-tight italic text-gold">KES {finalTotal.toLocaleString()}</div>
                                            </div>
                                        </div>
                                    </div>
                                </GlassCard>
                            </div>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export default CheckoutPage;
