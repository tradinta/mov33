'use client';

import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Sparkles, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NotificationEstimateProps {
    category?: string;
    vibeTags?: string[];
    personaTags?: string[];
}

export function NotificationEstimate({ category, vibeTags = [], personaTags = [] }: NotificationEstimateProps) {
    const estimate = useMemo(() => {
        // Base numbers for demonstration
        let count = 0;
        if (category) count += 150;
        count += vibeTags.length * 45;
        count += personaTags.length * 60;

        // Add some "random" but deterministic noise
        const seed = (category?.length || 0) + vibeTags.length + personaTags.length;
        count += (seed % 10) * 12;

        return count;
    }, [category, vibeTags, personaTags]);

    if (estimate === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 10 }}
                className="bg-kenyan-green/10 border border-kenyan-green/20 rounded-2xl p-4 flex items-center justify-between group"
            >
                <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-xl bg-kenyan-green/20 flex items-center justify-center text-kenyan-green group-hover:scale-110 transition-transform">
                        <Users className="h-5 w-5" />
                    </div>
                    <div>
                        <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-white tracking-tighter">~{estimate.toLocaleString()}</span>
                            <Badge className="bg-kenyan-green text-white border-none font-black text-[8px] px-1.5 h-4 uppercase tracking-widest">Active</Badge>
                        </div>
                        <p className="text-[10px] text-white/40 font-black uppercase tracking-widest leading-none mt-1">
                            Estimated Audience Reach
                        </p>
                    </div>
                </div>

                <div className="text-right flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1 text-gold">
                        <Sparkles className="h-3 w-3" />
                        <span className="text-[9px] font-black uppercase tracking-widest italic">High Demand</span>
                    </div>
                    <div className="flex items-center gap-1 text-kenyan-green">
                        <TrendingUp className="h-3 w-3" />
                        <span className="text-[9px] font-black tracking-widest">+12% this week</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
