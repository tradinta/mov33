'use client';

import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface GoldCheckmarkProps {
    className?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function GoldCheckmark({ className, size = 'md' }: GoldCheckmarkProps) {
    const sizeClasses = {
        sm: 'h-4 w-4 p-0.5',
        md: 'h-6 w-6 p-1',
        lg: 'h-10 w-10 p-2'
    };

    return (
        <div className={cn(
            "relative flex items-center justify-center rounded-full bg-gradient-to-tr from-[#8A6E2F] via-[#D4AF37] to-[#F9E498] shadow-[0_0_15px_rgba(212,175,55,0.4)] ring-1 ring-white/20",
            sizeClasses[size],
            className
        )}>
            {/* Shine effect */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/40 to-transparent animate-pulse" />
            <Check className="text-obsidian w-full h-full font-black stroke-[4px]" />
        </div>
    );
}
