'use client';

import { motion } from 'framer-motion';
import { Users, TrendingUp, Ticket, Flame } from 'lucide-react';

interface WhosGoingProps {
    ticketsSold: number;
    capacity: number;
    recentPurchases?: { name: string; time: string }[];
}

export function WhosGoing({ ticketsSold, capacity, recentPurchases = [] }: WhosGoingProps) {
    const percentSold = capacity > 0 ? (ticketsSold / capacity) * 100 : 0;
    const isAlmostSoldOut = percentSold >= 80;
    const isTrending = ticketsSold > 50;

    // Generate placeholder avatars based on ticket count
    const avatarCount = Math.min(ticketsSold, 5);
    const remainingCount = ticketsSold - avatarCount;

    return (
        <div className="bg-white/[0.03] border border-white/5 rounded-[2rem] p-6 md:p-8 overflow-hidden relative">
            <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gold" />
                        </div>
                        <div>
                            <h3 className="font-black text-lg uppercase italic tracking-tight text-white">Who's Going</h3>
                            <p className="text-[10px] font-medium uppercase tracking-widest text-white/40">Social Proof</p>
                        </div>
                    </div>
                    {isTrending && (
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="flex items-center gap-1.5 bg-orange-500/10 text-orange-400 px-3 py-1.5 rounded-full border border-orange-500/20"
                        >
                            <Flame className="h-3.5 w-3.5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Trending</span>
                        </motion.div>
                    )}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <Ticket className="h-4 w-4 text-gold" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Tickets Sold</span>
                        </div>
                        <div className="flex items-end gap-2">
                            <span className="text-3xl font-black text-white italic tracking-tighter">{ticketsSold.toLocaleString()}</span>
                            {capacity > 0 && <span className="text-white/30 text-sm font-medium mb-1">/ {capacity.toLocaleString()}</span>}
                        </div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-4 border border-white/5">
                        <div className="flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-kenyan-green" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-white/40">Capacity</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`text-3xl font-black italic tracking-tighter ${isAlmostSoldOut ? 'text-orange-400' : 'text-kenyan-green'}`}>
                                {percentSold.toFixed(0)}%
                            </span>
                            <span className="text-white/30 text-sm font-medium">filled</span>
                        </div>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                    <div className="h-3 bg-white/5 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentSold}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className={`h-full rounded-full ${isAlmostSoldOut
                                ? 'bg-gradient-to-r from-orange-500 to-red-500'
                                : 'bg-gradient-to-r from-kenyan-green to-gold'}`}
                        />
                    </div>
                    {isAlmostSoldOut && (
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-[10px] font-black uppercase tracking-widest text-orange-400 text-center"
                        >
                            🔥 Almost Sold Out! Don't miss out.
                        </motion.p>
                    )}
                </div>

                {/* Avatar Stack */}
                {ticketsSold > 0 && (
                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center">
                            <div className="flex -space-x-3">
                                {Array.from({ length: avatarCount }).map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ scale: 0, x: -10 }}
                                        animate={{ scale: 1, x: 0 }}
                                        transition={{ delay: i * 0.1 }}
                                        className="h-10 w-10 rounded-full border-2 border-obsidian bg-gradient-to-br from-gold/50 to-orange-500/50 flex items-center justify-center text-white text-xs font-bold"
                                        style={{ zIndex: avatarCount - i }}
                                    >
                                        {String.fromCharCode(65 + i)}
                                    </motion.div>
                                ))}
                            </div>
                            {remainingCount > 0 && (
                                <span className="ml-3 text-sm font-bold text-white/60">
                                    +{remainingCount.toLocaleString()} others
                                </span>
                            )}
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gold">Join Them →</span>
                    </div>
                )}

                {/* Recent Purchases (Live Feed) */}
                {recentPurchases.length > 0 && (
                    <div className="pt-4 border-t border-white/5">
                        <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-3">Recent Activity</p>
                        <div className="space-y-2">
                            {recentPurchases.slice(0, 3).map((purchase, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.15 }}
                                    className="flex items-center gap-3 text-sm"
                                >
                                    <div className="h-2 w-2 rounded-full bg-kenyan-green animate-pulse" />
                                    <span className="text-white/60">
                                        <span className="font-bold text-white">{purchase.name}</span> just got tickets
                                    </span>
                                    <span className="text-white/30 text-xs ml-auto">{purchase.time}</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Background Glow */}
            <div className="absolute -top-10 -right-10 h-40 w-40 bg-gold/5 rounded-full blur-[80px]" />
        </div>
    );
}
