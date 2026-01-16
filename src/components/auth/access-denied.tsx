'use client';

import { ShieldAlert, AlertTriangle, Skull, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { motion } from 'framer-motion';

export function AccessDenied({ requiredRole }: { requiredRole?: string }) {
    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4">
            <div className="relative max-w-lg w-full">
                {/* Pulsing background glow */}
                <div className="absolute inset-0 bg-red-500/20 blur-3xl rounded-full animate-pulse" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', duration: 0.5 }}
                    className="relative bg-[#111] border-2 border-red-500/50 rounded-3xl p-8 text-center shadow-2xl shadow-red-500/20"
                >
                    {/* Icon */}
                    <motion.div
                        initial={{ rotate: -10 }}
                        animate={{ rotate: [0, -5, 5, -5, 0] }}
                        transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                        className="mx-auto mb-6 h-24 w-24 rounded-full bg-red-500/10 border-2 border-red-500/30 flex items-center justify-center"
                    >
                        <ShieldAlert className="h-12 w-12 text-red-500" />
                    </motion.div>

                    {/* Title */}
                    <h1 className="text-3xl font-black text-red-500 uppercase tracking-tight mb-2">
                        Access Denied
                    </h1>

                    {/* Subtitle */}
                    <p className="text-zinc-400 mb-6">
                        You do not have permission to access this area.
                        {requiredRole && (
                            <span className="block mt-2 text-red-400 font-mono text-sm">
                                Required: <span className="uppercase font-bold">{requiredRole}</span>
                            </span>
                        )}
                    </p>

                    {/* Warning Box */}
                    <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-4 mb-6 text-left">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div className="text-sm text-zinc-400">
                                <p className="font-bold text-red-400 mb-1">Security Notice</p>
                                <p>This access attempt has been logged. Repeated unauthorized access attempts may result in account suspension.</p>
                            </div>
                        </div>
                    </div>

                    {/* Logged Info */}
                    <div className="text-xs text-zinc-600 font-mono mb-6 space-y-1">
                        <p>Timestamp: {new Date().toISOString()}</p>
                        <p>Event: UNAUTHORIZED_ACCESS_ATTEMPT</p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 justify-center">
                        <Link href="/">
                            <Button variant="outline" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800">
                                Go Home
                            </Button>
                        </Link>
                        <Link href="/profile">
                            <Button className="bg-red-500 hover:bg-red-600 text-white">
                                My Account
                            </Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
