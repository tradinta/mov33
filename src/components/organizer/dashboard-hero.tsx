'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/auth-context';
import { Sun, Cloud, Moon } from 'lucide-react';

export function DashboardHero() {
    const { profile } = useAuth();
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const hours = time.getHours();
    const greeting = hours < 12 ? 'Good Morning' : hours < 18 ? 'Good Afternoon' : 'Good Evening';

    // Simple visual logic for "Weather" icon based on time of day since we don't have a real weather API yet
    const WeatherIcon = hours > 6 && hours < 18 ? (hours < 17 ? Sun : Cloud) : Moon;
    const tempEstimate = hours > 6 && hours < 18 ? "24°C" : "18°C";

    return (
        <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/5 p-8 md:p-12 shadow-2xl">
            {/* Background Glows */}
            <div className="absolute top-0 right-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 bg-gold/10 blur-[100px] rounded-full pointer-events-none" />
            <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/3 translate-y-1/3 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />

            <div className="relative z-10 flex flex-col md:flex-row justify-between md:items-center gap-8">
                <div className="space-y-4">
                    <div className="space-y-1">
                        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                            {greeting}, {profile?.displayName?.split(' ')[0] || 'Organizer'}
                        </h1>
                        <p className="text-white/40 font-poppins font-medium">Ready to make today productive? 🚀</p>
                    </div>
                </div>

                <div className="flex flex-col items-start md:items-end space-y-2">
                    <div className="flex items-center gap-4">
                        <WeatherIcon className="h-12 w-12 text-gold animate-pulse" />
                        <span className="text-5xl font-black text-white tracking-widest">
                            {tempEstimate}
                        </span>
                    </div>
                    <div className="text-right">
                        <div className="text-4xl font-black text-white/90 font-mono tracking-widest">
                            {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-sm font-bold uppercase tracking-[0.2em] text-white/30">
                            {time.toLocaleDateString([], { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
