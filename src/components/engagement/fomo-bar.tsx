'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, X, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useMarketingConfig } from '@/hooks/use-marketing-config';

export function FomoBar() {
    const { config, loading } = useMarketingConfig();
    const [isVisible, setIsVisible] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);

    useEffect(() => {
        if (loading || !config?.fomoBar?.enabled) {
            setIsVisible(false);
            return;
        }

        const calculateTimeLeft = () => {
            const expiry = new Date(config.fomoBar.expiryDate).getTime();
            const now = new Date().getTime();
            const diff = Math.floor((expiry - now) / 1000);
            return diff > 0 ? diff : 0;
        };

        setTimeLeft(calculateTimeLeft());
        setIsVisible(true);

        const timer = setInterval(() => {
            const remaining = calculateTimeLeft();
            if (remaining <= 0) {
                setIsVisible(false);
                clearInterval(timer);
            }
            setTimeLeft(remaining);
        }, 1000);

        return () => clearInterval(timer);
    }, [config, loading]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    exit={{ y: -100 }}
                    className="fixed top-20 left-0 right-0 z-[40] bg-gold text-obsidian py-2 px-4 shadow-2xl"
                >
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 overflow-hidden">
                            <div className="hidden sm:flex items-center justify-center bg-obsidian text-gold h-8 w-8 rounded-lg shrink-0">
                                <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 overflow-hidden">
                                <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest whitespace-nowrap">
                                    {config?.fomoBar?.message || "Flash Sale: Premium experiences at better prices"}
                                </p>
                                <div className="flex items-center gap-2 bg-obsidian/10 px-3 py-0.5 rounded-full">
                                    <Timer className="h-3 w-3" />
                                    <span className="text-xs font-black font-poppins">{formatTime(timeLeft)} remaining</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {config?.fomoBar?.couponCode && (
                                <div className="hidden md:block bg-obsidian text-white px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-tighter">
                                    Code: {config.fomoBar.couponCode}
                                </div>
                            )}
                            <button
                                onClick={() => setIsVisible(false)}
                                className="p-1 hover:bg-obsidian/10 rounded-full transition-colors"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
