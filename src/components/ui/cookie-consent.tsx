'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function CookieConsent() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Check if user has already acknowledged
        const acknowledged = localStorage.getItem('cookie-acknowledged');
        if (!acknowledged) {
            // Small delay for better UX
            const timer = setTimeout(() => setIsVisible(true), 2000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAcknowledge = () => {
        localStorage.setItem('cookie-acknowledged', 'true');
        setIsVisible(false);
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0, y: 100, x: 100, rotate: 10 }}
                    animate={{ opacity: 1, y: 0, x: 0, rotate: 0 }}
                    exit={{ opacity: 0, y: 50, scale: 0.9 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    className="fixed bottom-6 right-6 z-50 max-w-sm"
                >
                    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-obsidian/60 backdrop-blur-xl shadow-2xl p-6">
                        {/* Gradient Glow */}
                        <div className="absolute -top-10 -right-10 h-32 w-32 bg-gold/10 blur-3xl rounded-full pointer-events-none" />

                        <div className="flex items-start gap-4">
                            <div className="h-10 w-10 shrink-0 rounded-xl bg-gold/10 flex items-center justify-center">
                                <Cookie className="h-5 w-5 text-gold" />
                            </div>

                            <div className="space-y-3">
                                <div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-white mb-1">
                                        Cookie Notice
                                    </h3>
                                    <p className="text-xs text-muted-foreground font-poppins leading-relaxed">
                                        We use cookies to make your experience smooth. You can manage them in your browser settings at any time.
                                    </p>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Button
                                        onClick={handleAcknowledge}
                                        size="sm"
                                        className="bg-gold hover:bg-gold/90 text-obsidian font-black uppercase text-[10px] tracking-widest h-8 px-6 rounded-lg shadow-lg shadow-gold/20"
                                    >
                                        Got it
                                    </Button>
                                    <button
                                        onClick={handleAcknowledge}
                                        className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-white transition-colors"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            </div>

                            <button
                                onClick={handleAcknowledge}
                                className="absolute top-4 right-4 text-white/20 hover:text-white transition-colors"
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
