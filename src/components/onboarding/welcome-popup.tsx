'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Compass, PartyPopper, ChevronRight, ChevronLeft, Calendar, Award, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useAuth } from '@/context/auth-context';

const tourSlides = [
    {
        icon: <Calendar className="h-10 w-10 text-gold" />,
        title: "Elite Events",
        description: "Discover Kenya's most exclusive coastal retreats, nightlife, and premium experiences.",
    },
    {
        icon: <Award className="h-10 w-10 text-kenyan-green" />,
        title: "VIP Access",
        description: "Join our membership program to unlock front-row seats, VIP lounges, and private invites.",
    },
    {
        icon: <ShieldCheck className="h-10 w-10 text-blue-500" />,
        title: "Secure Booking",
        description: "Seamless payments via M-Pesa and Card. Your tickets are verified and instantly available.",
    }
];

export function WelcomePopup() {
    const router = useRouter();
    const { user } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'welcome' | 'tour'>('welcome');
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        // Only show to unauthenticated users who haven't seen it yet
        const hasSeenOnboarding = localStorage.getItem('mov33_onboarding_seen');

        if (!user && !hasSeenOnboarding) {
            const timer = setTimeout(() => setIsOpen(true), 2000); // 2s delay for better UX
            return () => clearTimeout(timer);
        }
    }, [user]);

    const closePopup = () => {
        setIsOpen(false);
        localStorage.setItem('mov33_onboarding_seen', 'true');
    };

    const startTour = () => {
        setView('tour');
    };

    const nextSlide = () => {
        if (currentSlide < tourSlides.length - 1) {
            setCurrentSlide(prev => prev + 1);
        } else {
            closePopup();
        }
    };

    const prevSlide = () => {
        if (currentSlide > 0) {
            setCurrentSlide(prev => prev - 1);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="max-w-md w-full"
                    >
                        <GlassCard className="relative p-8 border-white/10 bg-obsidian/90 overflow-hidden shadow-2xl">
                            {/* Animated Background Orbs */}
                            <motion.div
                                animate={{
                                    scale: [1, 1.2, 1],
                                    opacity: [0.1, 0.2, 0.1]
                                }}
                                transition={{ duration: 4, repeat: Infinity }}
                                className="absolute -top-24 -right-24 h-64 w-64 bg-gold rounded-full blur-[100px]"
                            />

                            <button
                                onClick={closePopup}
                                className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors z-[60]"
                            >
                                <X className="h-5 w-5 text-white/30 hover:text-white" />
                            </button>

                            <AnimatePresence mode="wait">
                                {view === 'welcome' ? (
                                    <motion.div
                                        key="welcome"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col items-center text-center space-y-8 relative z-50 py-4"
                                    >
                                        <div className="h-24 w-24 rounded-[2rem] bg-gold/10 border border-gold/20 flex items-center justify-center relative group">
                                            <PartyPopper className="h-12 w-12 text-gold transition-transform group-hover:scale-110" />
                                            <motion.div
                                                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
                                                transition={{ duration: 2, repeat: Infinity }}
                                            >
                                                <Sparkles className="absolute -top-3 -right-3 h-8 w-8 text-gold" />
                                            </motion.div>
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-white font-headline leading-none">
                                                Elite <span className="text-gold">Kenya</span> Experience
                                            </h2>
                                            <p className="text-muted-foreground font-poppins text-base leading-relaxed px-2">
                                                Welcome to <span className="text-white font-bold">mov33</span>. Join the inner circle to access Kenya's most curated events.
                                            </p>
                                        </div>

                                        <div className="flex flex-col gap-3 w-full">
                                            <Button
                                                onClick={startTour}
                                                className="w-full bg-gold hover:bg-gold/90 text-obsidian font-black uppercase h-16 rounded-2xl shadow-xl shadow-gold/10 transition-all flex items-center justify-center gap-3 text-sm tracking-widest"
                                            >
                                                <Compass className="h-5 w-5" />
                                                Take a Quick Tour
                                            </Button>
                                            <Button
                                                variant="ghost"
                                                onClick={closePopup}
                                                className="w-full text-white/40 hover:text-white font-black uppercase text-[10px] tracking-[0.2em] h-12"
                                            >
                                                Enter the Experience
                                            </Button>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="tour"
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="flex flex-col items-center text-center space-y-8 relative z-50 py-4"
                                    >
                                        <div className="h-24 w-24 rounded-[2rem] bg-white/5 border border-white/10 flex items-center justify-center">
                                            {tourSlides[currentSlide].icon}
                                        </div>

                                        <div className="space-y-4">
                                            <h2 className="text-3xl font-black uppercase tracking-tighter text-white font-headline">
                                                {tourSlides[currentSlide].title}
                                            </h2>
                                            <p className="text-muted-foreground font-poppins text-sm leading-relaxed px-4 min-h-[60px]">
                                                {tourSlides[currentSlide].description}
                                            </p>
                                        </div>

                                        {/* Progress Dots */}
                                        <div className="flex gap-2">
                                            {tourSlides.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={`h-1.5 transition-all duration-300 rounded-full ${i === currentSlide ? 'w-8 bg-gold' : 'w-2 bg-white/10'}`}
                                                />
                                            ))}
                                        </div>

                                        <div className="flex gap-3 w-full">
                                            {currentSlide > 0 && (
                                                <Button
                                                    variant="outline"
                                                    onClick={prevSlide}
                                                    className="flex-1 border-white/10 bg-white/5 text-white font-bold uppercase h-16 rounded-2xl"
                                                >
                                                    <ChevronLeft className="h-5 w-5 mr-2" />
                                                    Back
                                                </Button>
                                            )}
                                            <Button
                                                onClick={nextSlide}
                                                className="flex-[2] bg-gold hover:bg-gold/90 text-obsidian font-black uppercase h-16 rounded-2xl"
                                            >
                                                {currentSlide === tourSlides.length - 1 ? 'Get Started' : 'Next'}
                                                <ChevronRight className="h-5 w-5 ml-2" />
                                            </Button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </GlassCard>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
