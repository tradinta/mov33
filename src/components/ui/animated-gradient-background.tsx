
'use client';

import { cn } from "@/lib/utils";

export function AnimatedGradientBackground({ className }: { className?: string }) {
    return (
        <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
            {/* Soft radial glow */}
            <div 
                className="absolute top-[-20%] right-[-20%] h-[500px] w-[500px] rounded-full opacity-20"
                style={{
                    background: 'radial-gradient(circle, hsl(var(--accent)) 0%, transparent 70%)',
                    filter: 'blur(100px)',
                }}
            />
             {/* Grid pattern overlay */}
            <div className="absolute inset-0 h-full w-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        </div>
    );
}
