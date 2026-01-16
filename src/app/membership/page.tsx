'use client';

import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Ticket, Star, Rocket, Crown, ShieldCheck, Zap, Gem } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';
import { useCart } from '@/context/cart-context';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';

const standardPerks = [
    "Access to all standard events",
    "Standard customer support",
    "Save your favorite events",
    "Basic profile features"
];

const vipPerks = [
    "Access to exclusive VIP-only events",
    "Early access to ticket sales (24 hours before public)",
    "Dedicated VIP support line",
    "Special discounts on merchandise",
    "Invitations to private meet-and-greets",
    "No booking fees on any tickets",
    "Monthly guest pass for select events"
];

export default function MembershipPage() {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const { profile, user } = useAuth();
    const router = useRouter();

    const handleUpgrade = () => {
        addToCart({
            id: 'membership-premium',
            name: 'Mov33+ Premium Membership',
            price: 4999,
            image: 'https://images.unsplash.com/photo-1635329383610-2f1704e9c70c?q=80&w=2000&auto=format&fit=crop',
            quantity: 1,
            variant: { name: 'Annual Plan' }
        });
        toast({
            title: "Membership Added",
            description: "Go to checkout to activate your premium status.",
        });
        router.push('/checkout');
    };

    const isPremium = profile?.mov33Plus || false;

    return (
        <div className="bg-background dark:bg-obsidian min-h-screen pt-24 pb-20">
            <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-gold/5 to-transparent pointer-events-none" />

            <div className="container mx-auto px-4 max-w-6xl space-y-16 relative z-10">
                {/* Header */}
                <div className="text-center space-y-6 max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 text-xs font-black uppercase tracking-widest text-gold mb-4">
                        <Crown className="h-4 w-4" />
                        The Elite Circle
                    </div>
                    <h1 className="font-headline text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter leading-none">
                        Elevate Your <span className="text-gold">Experience</span>
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl font-poppins max-w-2xl mx-auto leading-relaxed">
                        Unlock a world of untethered access. Mov33+ is more than a membership—it's your key to the city's most exclusive moments.
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Standard Plan */}
                    <GlassCard className="flex flex-col p-8 md:p-10 border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/[0.07] transition-all">
                        <div className="space-y-4 mb-8">
                            <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter text-white">Standard</h3>
                            <p className="text-white/60 text-sm">Your gateway to the events world.</p>
                            <div className="pt-4">
                                <span className="text-4xl font-black text-white tracking-tighter">Free</span>
                            </div>
                        </div>

                        <div className="flex-grow space-y-4 mb-8">
                            {standardPerks.map((perk, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="h-5 w-5 text-white/40 shrink-0 mt-0.5" />
                                    <span className="text-white/60 text-sm">{perk}</span>
                                </div>
                            ))}
                        </div>

                        <Button variant="outline" className="w-full h-14 rounded-2xl border-white/10 bg-transparent text-white/60 font-bold uppercase tracking-widest hover:bg-white/5" disabled>
                            {isPremium ? 'Downgrade' : 'Current Plan'}
                        </Button>
                    </GlassCard>

                    {/* Premium Plan */}
                    <motion.div
                        whileHover={{ y: -10 }}
                        transition={{ duration: 0.3 }}
                    >
                        <GlassCard className="relative flex flex-col p-8 md:p-10 border-gold/30 bg-gradient-to-br from-obsidian via-obsidian to-gold/10 overflow-hidden h-full">
                            <div className="absolute top-0 right-0 px-4 py-1 bg-gold text-obsidian text-[10px] font-black uppercase tracking-widest rounded-bl-2xl">
                                Recommended
                            </div>

                            <div className="space-y-4 mb-8 relative z-10">
                                <div className="flex items-center gap-2 text-gold">
                                    <Crown className="h-6 w-6" />
                                    <span className="font-black uppercase tracking-[0.2em] text-xs">Mov33+</span>
                                </div>
                                <h3 className="font-headline text-3xl font-black uppercase italic tracking-tighter text-white">Premium</h3>
                                <p className="text-white/60 text-sm">For those who demand the exceptional.</p>
                                <div className="pt-4 flex items-baseline gap-1">
                                    <span className="text-4xl font-black text-gold tracking-tighter">KES 4,999</span>
                                    <span className="text-white/40 text-xs font-bold uppercase tracking-widest">/year</span>
                                </div>
                            </div>

                            <div className="flex-grow space-y-4 mb-8 relative z-10">
                                {vipPerks.map((perk, i) => (
                                    <div key={i} className="flex items-start gap-3">
                                        <div className="h-5 w-5 rounded-full bg-gold/20 flex items-center justify-center shrink-0 mt-0.5">
                                            <CheckCircle className="h-3 w-3 text-gold" />
                                        </div>
                                        <span className="text-white text-sm font-medium">{perk}</span>
                                    </div>
                                ))}
                            </div>

                            <Button
                                onClick={handleUpgrade}
                                disabled={isPremium}
                                className="w-full h-14 rounded-2xl bg-gold hover:bg-gold/90 text-obsidian font-black uppercase tracking-widest shadow-xl shadow-gold/20 hover:shadow-gold/30 transition-all relative z-10"
                            >
                                {isPremium ? (
                                    <span className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4" /> Active Plan
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <Rocket className="h-4 w-4" /> Upgrade Now
                                    </span>
                                )}
                            </Button>

                            {/* Decorative Elements */}
                            <div className="absolute -bottom-24 -right-24 h-64 w-64 bg-gold/10 rounded-full blur-[80px]" />
                        </GlassCard>
                    </motion.div>
                </div>

                {/* FAQ or Trust Section could go here */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-white/5">
                    <div className="text-center space-y-2">
                        <ShieldCheck className="h-6 w-6 text-white/20 mx-auto" />
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Secure Payments</p>
                    </div>
                    <div className="text-center space-y-2">
                        <Zap className="h-6 w-6 text-white/20 mx-auto" />
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Instant Activation</p>
                    </div>
                    <div className="text-center space-y-2">
                        <Gem className="h-6 w-6 text-white/20 mx-auto" />
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Exclusive Perks</p>
                    </div>
                    <div className="text-center space-y-2">
                        <Star className="h-6 w-6 text-white/20 mx-auto" />
                        <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Priority Support</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
