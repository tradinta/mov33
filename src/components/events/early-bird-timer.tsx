'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface EarlyBirdTimerProps {
    /** The deadline for the early bird pricing */
    deadline: Date;
    /** Original price before early bird discount */
    originalPrice: number;
    /** Discounted early bird price */
    earlyBirdPrice: number;
    /** Discount label (e.g., "20% OFF") */
    discountLabel?: string;
    /** Callback when early bird expires */
    onExpire?: () => void;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
}

export function EarlyBirdTimer({
    deadline,
    originalPrice,
    earlyBirdPrice,
    discountLabel,
    onExpire
}: EarlyBirdTimerProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
    const [isExpired, setIsExpired] = useState(false);
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const deadlineTime = deadline.getTime();
            const difference = deadlineTime - now;

            if (difference <= 0) {
                setIsExpired(true);
                onExpire?.();
                return { days: 0, hours: 0, minutes: 0, seconds: 0 };
            }

            // Set urgent if less than 24 hours left
            setIsUrgent(difference < 24 * 60 * 60 * 1000);

            return {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((difference % (1000 * 60)) / 1000),
            };
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
    }, [deadline, onExpire]);

    const savings = originalPrice - earlyBirdPrice;
    const savingsPercent = Math.round((savings / originalPrice) * 100);

    if (isExpired) {
        return (
            <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                <div className="flex items-center gap-3 text-white/50">
                    <Clock className="h-5 w-5" />
                    <span className="text-sm font-medium">Early bird pricing has ended</span>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-3xl p-6 ${isUrgent
                    ? 'bg-gradient-to-br from-orange-500/20 via-red-500/10 to-transparent border border-orange-500/30'
                    : 'bg-gradient-to-br from-kenyan-green/20 via-gold/10 to-transparent border border-kenyan-green/30'
                }`}
        >
            {/* Pulsing Background for Urgency */}
            {isUrgent && (
                <motion.div
                    animate={{ opacity: [0.1, 0.2, 0.1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="absolute inset-0 bg-orange-500/10"
                />
            )}

            <div className="relative z-10">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${isUrgent ? 'bg-orange-500/20 text-orange-400' : 'bg-kenyan-green/20 text-kenyan-green'
                            }`}>
                            {isUrgent ? <AlertTriangle className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                        </div>
                        <div>
                            <h3 className="font-black text-sm uppercase tracking-widest text-white">
                                {isUrgent ? 'Last Chance!' : 'Early Bird Special'}
                            </h3>
                            <p className="text-[10px] text-white/50 font-medium uppercase tracking-widest">
                                Limited Time Offer
                            </p>
                        </div>
                    </div>
                    {discountLabel && (
                        <Badge className={`${isUrgent
                                ? 'bg-orange-500 text-white'
                                : 'bg-kenyan-green text-white'
                            } font-black text-xs uppercase border-none`}>
                            {discountLabel}
                        </Badge>
                    )}
                </div>

                {/* Timer Grid */}
                <div className="grid grid-cols-4 gap-3 mb-6">
                    {[
                        { value: timeLeft.days, label: 'Days' },
                        { value: timeLeft.hours, label: 'Hours' },
                        { value: timeLeft.minutes, label: 'Mins' },
                        { value: timeLeft.seconds, label: 'Secs' },
                    ].map((item, i) => (
                        <div key={i} className="text-center">
                            <motion.div
                                key={item.value}
                                initial={{ scale: 1.1 }}
                                animate={{ scale: 1 }}
                                className={`text-3xl md:text-4xl font-black italic tracking-tighter ${isUrgent ? 'text-orange-400' : 'text-white'
                                    }`}
                            >
                                {String(item.value).padStart(2, '0')}
                            </motion.div>
                            <div className="text-[9px] font-black uppercase tracking-widest text-white/40 mt-1">
                                {item.label}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pricing Comparison */}
                <div className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/5">
                    <div className="space-y-1">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">You Pay</div>
                        <div className="flex items-center gap-3">
                            <span className={`text-2xl font-black italic tracking-tighter ${isUrgent ? 'text-orange-400' : 'text-kenyan-green'
                                }`}>
                                KES {earlyBirdPrice.toLocaleString()}
                            </span>
                            <span className="text-lg text-white/30 line-through">
                                KES {originalPrice.toLocaleString()}
                            </span>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-[10px] font-black uppercase tracking-widest text-white/40">You Save</div>
                        <div className="flex items-center gap-2 text-kenyan-green">
                            <TrendingUp className="h-4 w-4" />
                            <span className="text-lg font-black">KES {savings.toLocaleString()}</span>
                            <span className="text-xs font-bold opacity-60">({savingsPercent}%)</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

/**
 * A simpler inline version of the early bird badge
 * for use in ticket tier cards
 */
interface EarlyBirdBadgeProps {
    deadline: Date;
    discountPercent: number;
}

export function EarlyBirdBadge({ deadline, discountPercent }: EarlyBirdBadgeProps) {
    const [timeLeft, setTimeLeft] = useState('');
    const [isExpired, setIsExpired] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const deadlineTime = deadline.getTime();
            const difference = deadlineTime - now;

            if (difference <= 0) {
                setIsExpired(true);
                return '';
            }

            const hours = Math.floor(difference / (1000 * 60 * 60));
            const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 24) {
                const days = Math.floor(hours / 24);
                return `${days}d left`;
            }
            return `${hours}h ${minutes}m left`;
        };

        setTimeLeft(calculateTimeLeft());

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 60000); // Update every minute

        return () => clearInterval(timer);
    }, [deadline]);

    if (isExpired) return null;

    return (
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2 bg-kenyan-green/20 text-kenyan-green px-3 py-1.5 rounded-full border border-kenyan-green/30"
        >
            <Zap className="h-3.5 w-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">
                {discountPercent}% OFF • {timeLeft}
            </span>
        </motion.div>
    );
}
