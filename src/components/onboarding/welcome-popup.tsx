'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Compass, PartyPopper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';

export function WelcomePopup() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get('newuser') === 'true') {
            const timer = setTimeout(() => setIsOpen(true), 1000);
            return () => clearTimeout(timer);
        }
    }, [searchParams]);

    const closePopup = () => {
        setIsOpen(false);
        // Clean up URL
        const params = new URLSearchParams(searchParams.toString());
        params.delete('newuser');
        const newPath = params.toString() ? `/events?${params.toString()}` : '/events';
        router.replace(newPath, { scroll: false });
    };

    const startTour = () => {
        // Functional tour would go here
        closePopup();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="max-w-md w-full"
                    >
                        <GlassCard className="relative p-8 border-gold/20 bg-obsidian/80 overflow-hidden">
                            {/* Background Glow */}
                            <div className="absolute -top-24 -right-24 h-48 w-48 bg-gold opacity-10 blur-[80px]" />

                            <button
                                onClick={closePopup}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-10"
                            >
                                <X className="h-5 w-5 text-white/50" />
                            </button>

                            <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                                <div className="h-20 w-20 rounded-3xl bg-gold/20 flex items-center justify-center relative">
                                    <PartyPopper className="h-10 w-10 text-gold" />
                                    <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-gold animate-pulse" />
                                </div>

                                <div className="space-y-2">
                                    <h2 className="text-3xl font-black uppercase italic tracking-tighter text-white font-headline">
                                        Welcome to <span className="text-gold">MOV33</span>
                                    </h2>
                                    <p className="text-muted-foreground font-poppins text-sm leading-relaxed px-4">
                                        You're now part of Kenya's most exclusive event community.
                                        Ready to discover your next unforgettable experience?
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 gap-3 w-full pt-4">
                                    <Button
                                        onClick={startTour}
                                        className="w-full bg-gold hover:bg-gold/90 text-obsidian font-black uppercase h-14 rounded-2xl shadow-xl shadow-gold/10 hover:shadow-gold/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        <Compass className="h-5 w-5" />
                                        Take a Quick Tour
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={closePopup}
                                        className="w-full text-white/50 hover:text-white font-black uppercase text-[10px] tracking-widest h-12"
                                    >
                                        Maybe Later
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
