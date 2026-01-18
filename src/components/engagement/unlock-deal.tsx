'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lock, Unlock, Copy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface UnlockDealProps {
    code: string;
    discountDetails: string;
}

export function UnlockDeal({ code, discountDetails }: UnlockDealProps) {
    const [isLocked, setIsLocked] = useState(true);
    const { toast } = useToast();

    const handleUnlock = () => {
        setIsLocked(false);
        toast({
            title: "Deal Unlocked! 🥂",
            description: "You've gained access to special pricing.",
        });
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        toast({
            title: "Copied!",
            description: "Promo code copied to your clipboard.",
        });
    };

    return (
        <div className="relative overflow-hidden rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 group transition-all hover:bg-white/[0.04]">
            <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                <div className={cn(
                    "h-20 w-20 rounded-3xl flex items-center justify-center transition-all duration-700",
                    isLocked ? "bg-white/5 text-white/20" : "bg-gold text-obsidian shadow-2xl shadow-gold/20"
                )}>
                    {isLocked ? (
                        <Lock className="h-10 w-10 animate-pulse" />
                    ) : (
                        <motion.div
                            initial={{ scale: 0.5, rotate: -20 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: "spring", damping: 10 }}
                        >
                            <Unlock className="h-10 w-10" />
                        </motion.div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-white mb-2">
                        {isLocked ? 'Insider Pricing Available' : 'Wait... Here is your deal!'}
                    </h3>
                    <p className="text-white/40 text-sm font-poppins">
                        {isLocked
                            ? 'Special discount reserved for discovering this event early.'
                            : discountDetails}
                    </p>
                </div>

                <AnimatePresence mode="wait">
                    {isLocked ? (
                        <motion.div
                            key="locked"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <Button
                                onClick={handleUnlock}
                                className="bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest text-[10px] h-14 rounded-2xl px-10 border border-white/5 group"
                            >
                                <Sparkles className="mr-2 h-4 w-4 text-gold group-hover:scale-125 transition-transform" />
                                Unlock Reveal
                            </Button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="unlocked"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-gold/10 border border-gold/30 rounded-2xl px-6 py-3 flex items-center gap-6"
                        >
                            <div className="flex flex-col">
                                <span className="text-[8px] uppercase font-black tracking-widest text-gold/60">Promo Code</span>
                                <span className="text-2xl font-black italic tracking-tighter text-gold font-headline leading-none">{code}</span>
                            </div>
                            <Button
                                size="icon"
                                variant="ghost"
                                onClick={handleCopy}
                                className="h-10 w-10 rounded-xl bg-gold text-obsidian hover:bg-gold/80"
                            >
                                <Copy className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Background elements */}
            {!isLocked && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 pointer-events-none"
                >
                    <div className="absolute top-0 right-0 h-32 w-32 bg-gold/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 h-32 w-32 bg-gold/5 rounded-full blur-2xl" />
                </motion.div>
            )}
        </div>
    );
}
