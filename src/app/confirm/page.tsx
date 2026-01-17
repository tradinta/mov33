'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { CheckCircle, ArrowRight, Star, Sparkles } from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function ConfirmPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const email = searchParams.get('email');
    const [name, setName] = useState<string>('');

    useEffect(() => {
        // Just for visual effect - normally we'd fetch this or have it in session
        if (email) {
            const part = email.split('@')[0];
            setName(part.charAt(0).toUpperCase() + part.slice(1));
        }
    }, [email]);

    return (
        <div className="min-h-screen bg-obsidian flex items-center justify-center p-4 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-gold rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-kenyan-green rounded-full blur-[120px]"></div>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-md w-full text-center relative z-10"
            >
                <div className="mb-8 flex justify-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 12 }}
                        className="h-24 w-24 bg-gold rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(230,184,0,0.3)]"
                    >
                        <CheckCircle className="h-12 w-12 text-obsidian" strokeWidth={3} />
                    </motion.div>
                </div>

                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-black text-white uppercase tracking-tighter mb-4"
                >
                    Email Confirmed!
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="text-white/60 text-lg mb-8"
                >
                    Welcome to the Inner Circle, <span className="text-gold font-bold">{name}</span>. Your account is now verified and ready for the ultimate experience.
                </motion.p>

                <div className="space-y-4">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                    >
                        <Button
                            asChild
                            className="w-full bg-gold text-obsidian hover:bg-gold/90 h-14 text-lg font-bold rounded-xl group transition-all"
                        >
                            <Link href="/">
                                Explore Premium Events
                                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </Button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Button
                            variant="outline"
                            asChild
                            className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10 h-14 text-lg font-bold rounded-xl"
                        >
                            <Link href="/profile">
                                Go to Dashboard
                            </Link>
                        </Button>
                    </motion.div>
                </div>

                {/* Micro-animations icons */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    className="absolute top-0 right-0 opacity-20"
                >
                    <Sparkles className="h-12 w-12 text-gold" />
                </motion.div>
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-10 left-[-20px] opacity-20"
                >
                    <Star className="h-10 w-10 text-kenyan-green" />
                </motion.div>
            </motion.div>
        </div>
    );
}
