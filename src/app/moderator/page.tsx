'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Scan, Users, Clock, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ModeratorDashboard() {
    return (
        <div className="space-y-8 pb-24 md:pb-0">
            <div>
                <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Check-in Terminal</h1>
                <p className="text-muted-foreground">Select an event to start scanning tickets.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <GlassCard className="p-6 border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-kenyan-green/20 flex items-center justify-center text-kenyan-green">
                            <Users className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black tracking-tighter">1,284</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Checked In</div>
                        </div>
                    </div>
                </GlassCard>

                <GlassCard className="p-6 border-white/5">
                    <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-gold/20 flex items-center justify-center text-gold">
                            <Clock className="h-6 w-6" />
                        </div>
                        <div>
                            <div className="text-2xl font-black tracking-tighter">312</div>
                            <div className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold">Expected Now</div>
                        </div>
                    </div>
                </GlassCard>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-bold text-white uppercase tracking-widest flex items-center gap-2">
                    <div className="h-1 w-4 bg-kenyan-green rounded-full" />
                    Active Assignments
                </h2>

                <div className="space-y-3">
                    {[1, 2].map((i) => (
                        <GlassCard key={i} className="p-6 hover:border-white/20 transition-all group">
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <div className="flex gap-4">
                                    <div className="h-16 w-16 rounded-2xl bg-white/5 overflow-hidden flex-shrink-0">
                                        <img
                                            src={`https://picsum.photos/seed/${i + 10}/200/200`}
                                            alt="Event"
                                            className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase tracking-tight">Summer Solstice Festival {i}</h3>
                                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                                            <Clock className="h-3 w-3" />
                                            Today, 18:00 - 04:00
                                        </p>
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold text-muted-foreground">VIP Access</span>
                                            <span className="text-[10px] bg-white/5 border border-white/10 px-2 py-0.5 rounded-full uppercase font-bold text-muted-foreground">Main Entrance</span>
                                        </div>
                                    </div>
                                </div>

                                <Button className="bg-kenyan-green hover:bg-kenyan-green/90 text-white font-bold h-14 rounded-2xl px-8 shadow-xl shadow-kenyan-green/20">
                                    <Scan className="mr-2 h-5 w-5" />
                                    Launch Scanner
                                </Button>
                            </div>
                        </GlassCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
