
'use client';

import { cn } from "@/lib/utils";

export function AnimatedGradientBackground({ className }: { className?: string }) {
    return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
            <div 
                className="absolute inset-0 z-0 opacity-40 dark:opacity-30"
                style={{
                    backgroundImage: 'conic-gradient(from 90deg at 50% 50%, hsl(var(--accent)) -20%, hsl(var(--muted-gold)) 30%, hsl(var(--secondary)) 50%, hsl(var(--muted-gold)) 70%, hsl(var(--accent)) 120%)',
                    filter: 'blur(100px)',
                }}
            />
            <div className="absolute inset-0 z-10 h-full w-full bg-[linear-gradient(to_right,#8080800c_1px,transparent_1px),linear-gradient(to_bottom,#8080800c_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_60%,transparent_100%)]"></div>
        </div>
    );
}
