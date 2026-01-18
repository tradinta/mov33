'use client';

import React, { useEffect, useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, Gift, X, Timer } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMarketingConfig } from '@/hooks/use-marketing-config';

export function ExitIntentPopup() {
    const { config, loading } = useMarketingConfig();
    const [isOpen, setIsOpen] = useState(false);
    const [hasBeenShown, setHasBeenShown] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        if (loading || !config?.exitIntent?.enabled) return;

        const dismissed = localStorage.getItem('exit_intent_dismissed');
        const now = new Date().getTime();

        // Don't show if dismissed in the last 24 hours
        if (dismissed && now - parseInt(dismissed) < 24 * 60 * 60 * 1000) {
            setHasBeenShown(true);
            return;
        }

        const handleMouseLeave = (e: MouseEvent) => {
            if (e.clientY < 0 && !hasBeenShown) {
                setIsOpen(true);
                setHasBeenShown(true);
            }
        };

        document.addEventListener('mouseleave', handleMouseLeave);
        return () => document.removeEventListener('mouseleave', handleMouseLeave);
    }, [hasBeenShown, loading, config]);

    const handleCopy = () => {
        const code = config?.exitIntent?.discountCode || 'MOV33VIP';
        navigator.clipboard.writeText(code);
        toast({
            title: "Copied!",
            description: "Promo code copied to your clipboard.",
        });
    };

    const handleDismiss = () => {
        setIsOpen(false);
        localStorage.setItem('exit_intent_dismissed', new Date().getTime().toString());
    };

    return (
        <Dialog open={isOpen} onOpenChange={(open) => {
            if (!open) handleDismiss();
        }}>
            <DialogContent className="sm:max-w-[450px] bg-obsidian border-white/10 text-white p-0 overflow-hidden">
                <div className="relative p-8">
                    {/* Background Pattern */}
                    <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 bg-gold/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 bg-kenyan-green/10 rounded-full blur-[100px]" />

                    <DialogHeader className="relative z-10 text-center space-y-4">
                        <div className="mx-auto h-20 w-20 rounded-3xl bg-gold/10 flex items-center justify-center mb-2">
                            <Gift className="h-10 w-10 text-gold" />
                        </div>
                        <DialogTitle className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                            Wait! Don't go <br />
                            <span className="text-gold">Empty Handed</span>
                        </DialogTitle>
                        <DialogDescription className="text-white/60 font-poppins pt-2">
                            {config?.exitIntent?.message || "We saw you looking! Use this exclusive code to get a special discount on your first event."}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="mt-10 relative z-10 space-y-6">
                        <div className="bg-white/5 border border-dashed border-white/20 p-6 rounded-3xl text-center group transition-all hover:border-gold/50">
                            <div className="text-[10px] uppercase font-black tracking-widest text-white/40 mb-2">Your Secret Code</div>
                            <div className="text-5xl font-black italic tracking-tighter text-gold mb-4 font-headline">{config?.exitIntent?.discountCode || 'MOV33VIP'}</div>
                            <Button
                                onClick={handleCopy}
                                className="w-full bg-white/10 hover:bg-gold hover:text-obsidian font-black uppercase tracking-widest text-xs h-12 rounded-2xl transition-all"
                            >
                                <Copy className="mr-2 h-4 w-4" />
                                Copy & Redeem
                            </Button>
                        </div>

                        <div className="flex items-center justify-center gap-4 py-2 opacity-60">
                            <div className="flex items-center gap-2">
                                <Timer className="h-4 w-4 text-gold" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Limited Offer</span>
                            </div>
                            <div className="h-4 w-[1px] bg-white/10" />
                            <div className="text-[10px] font-black uppercase tracking-widest">Valid for 24h</div>
                        </div>

                        <Button
                            variant="ghost"
                            onClick={handleDismiss}
                            className="w-full text-white/30 hover:text-white uppercase font-black text-[10px] tracking-widest transition-colors h-10"
                        >
                            No thanks, maybe later
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
