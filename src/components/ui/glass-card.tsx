import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
    children: React.ReactNode;
    className?: string;
    intensity?: 'low' | 'medium' | 'high';
}

export function GlassCard({ children, className, intensity = 'medium' }: GlassCardProps) {
    const intensityMap = {
        low: 'bg-black/5 dark:bg-white/5 backdrop-blur-sm border-black/5 dark:border-white/10',
        medium: 'bg-black/5 dark:bg-white/10 backdrop-blur-md border-black/10 dark:border-white/20',
        high: 'bg-black/10 dark:bg-white/20 backdrop-blur-lg border-black/20 dark:border-white/30',
    };

    return (
        <div className={cn(
            "rounded-3xl border transition-all duration-300",
            intensityMap[intensity],
            className
        )}>
            {children}
        </div>
    );
}
