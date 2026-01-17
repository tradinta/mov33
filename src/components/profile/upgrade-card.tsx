'use client';

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GlassCard } from "../ui/glass-card";
import { Crown, Zap, Ticket, Star, ShieldCheck, Gem } from "lucide-react";
import { motion } from "framer-motion";

const benefits = [
    {
        icon: Zap,
        title: "Early Access",
        description: "Get a 24h head start on blockbuster ticket sales."
    },
    {
        icon: Ticket,
        title: "Exclusive Pricing",
        description: "Automatic 10% discount on all events and tours."
    },
    {
        icon: Gem,
        title: "VIP Entry",
        description: "Skip the lines with priority lanes at partner venues."
    },
    {
        icon: Star,
        title: "Secret Drops",
        description: "Access to member-only parties and secret pop-ups."
    },
    {
        icon: ShieldCheck,
        title: "No Booking Fees",
        description: "We waive all service charges on your transactions."
    },
    {
        icon: Crown,
        title: "Monthly Guest Pass",
        description: "One free companion ticket every month for select events."
    }
];

export function UpgradeCard() {
    const router = useRouter();

    return (
        <GlassCard className="relative overflow-hidden border-gold/20 bg-gradient-to-br from-background dark:from-obsidian via-background dark:via-obsidian to-gold/5 dark:to-gold/5">
            {/* Decorative Glows */}
            <div className="absolute -top-24 -right-24 h-64 w-64 bg-gold/10 rounded-full blur-[100px]" />
            <div className="absolute -bottom-24 -left-24 h-64 w-64 bg-gold/5 rounded-full blur-[80px]" />

            <div className="relative p-8 md:p-12 space-y-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-[10px] font-black uppercase tracking-widest text-gold mb-2">
                            <Crown className="h-3 w-3" />
                            Upgrade to Premium
                        </div>
                        <h2 className="font-headline text-4xl md:text-5xl font-black uppercase italic tracking-tighter text-foreground dark:text-white">
                            Unlock the <span className="text-gold">Full Experience</span>
                        </h2>
                        <p className="text-muted-foreground dark:text-white/60 font-poppins text-sm md:text-base max-w-xl leading-relaxed">
                            Join the elite circle of mov33+ and transform how you experience Kenya. From the best prices to the best seats, you're always first in line.
                        </p>
                        drum
                    </div>

                    <div className="flex flex-col items-center gap-4 bg-muted/50 dark:bg-white/5 backdrop-blur-xl p-8 rounded-3xl border border-black/10 dark:border-white/10 min-w-[280px]">
                        <div className="text-center">
                            <span className="text-muted-foreground dark:text-white/40 text-[10px] font-black uppercase tracking-widest block mb-2">Annually</span>
                            <div className="flex items-end justify-center gap-1">
                                <span className="text-4xl font-black text-foreground dark:text-white font-headline tracking-tighter">KES 4,999</span>
                                <span className="text-muted-foreground dark:text-white/40 text-[10px] font-black uppercase tracking-widest mb-1">/yr</span>
                            </div>
                        </div>
                        drum
                        drum
                        <Button
                            onClick={() => router.push('/membership')}
                            className="w-full h-14 bg-gold hover:bg-gold/90 text-obsidian font-black uppercase tracking-widest text-xs rounded-2xl shadow-xl shadow-gold/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                        >
                            Go Premium Now
                        </Button>
                        <p className="text-[9px] text-muted-foreground/50 dark:text-white/30 uppercase font-bold tracking-tighter">Cancel anytime • Secure payment</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {benefits.map((benefit, index) => {
                        const Icon = benefit.icon;
                        return (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="flex items-start gap-4 group"
                            >
                                <div className="h-10 w-10 rounded-xl bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0 group-hover:bg-gold group-hover:text-obsidian transition-all">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-foreground dark:text-white font-bold text-sm uppercase tracking-tight">{benefit.title}</h4>
                                    <p className="text-muted-foreground dark:text-white/40 text-xs leading-relaxed">{benefit.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </GlassCard>
    );
}
