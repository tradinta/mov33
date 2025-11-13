
'use client';

import { cn } from "@/lib/utils";

export function AnimatedGradientBackground({ className }: { className?: string }) {
    return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
            <div className="absolute inset-0 z-0 h-full w-full bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]"></div>
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_500px_at_50%_200px,#1e293b,transparent)]"></div>
            <div 
                className="absolute -top-1/2 left-1/2 h-[150%] w-[150%] -translate-x-1/2 -translate-y-1/2 animate-[spin_10s_linear_infinite] z-0"
                style={{
                    background: 'conic-gradient(from 90deg at 50% 50%, hsl(var(--primary)) 0%, hsl(var(--accent)) 50%, hsl(var(--primary)) 100%)'
                }}
            />
        </div>
    );
}
