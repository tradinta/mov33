'use client';

import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PlusBadgeProps {
    className?: string;
    showText?: boolean;
}

export function PlusBadge({ className, showText = true }: PlusBadgeProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
                "relative inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-gold/20 via-gold/40 to-gold/20 border border-gold/40 shadow-[0_0_20px_rgba(212,175,55,0.2)] backdrop-blur-md overflow-hidden group",
                className
            )}
        >
            {/* Animated Shine Effect */}
            <motion.div
                animate={{
                    x: ['-100%', '200%'],
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "linear",
                }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-12 pointer-events-none"
            />

            <div className="relative flex items-center gap-1.5">
                <div className="relative">
                    <Crown className="h-3.5 w-3.5 text-gold fill-gold animate-pulse" />
                    <motion.div
                        animate={{ scale: [1, 1.5, 1], opacity: [0, 0.5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute inset-0 bg-gold rounded-full blur-sm"
                    />
                </div>

                {showText && (
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white drop-shadow-md">
                        mov33<span className="text-gold">+</span>
                    </span>
                )}

                <Sparkles className="h-3 w-3 text-gold/60 group-hover:text-gold transition-colors" />
            </div>

            {/* Outer Glow */}
            <div className="absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-50" />
        </motion.div>
    );
}
