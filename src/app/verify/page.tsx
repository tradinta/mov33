'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
    CheckCircle2,
    XCircle,
    Smartphone,
    User,
    Calendar,
    Ticket as TicketIcon,
    Loader2,
    ShieldCheck,
    RefreshCcw
} from 'lucide-react';
import { collection, query, where, getDocs, updateDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { TicketRecord } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/auth-context';

export default function VerifyPage() {
    const [scanResult, setScanResult] = useState<string | null>(null);
    const [ticket, setTicket] = useState<TicketRecord | null>(null);
    const [loading, setLoading] = useState(false);
    const [isScanning, setIsScanning] = useState(true);
    const { profile } = useAuth();
    const { toast } = useToast();
    const scannerRef = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        if (isScanning && !scannerRef.current) {
            scannerRef.current = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );
            scannerRef.current.render(onScanSuccess, onScanFailure);
        }

        return () => {
            if (scannerRef.current) {
                scannerRef.current.clear().catch(err => console.error("Scanner clear error", err));
                scannerRef.current = null;
            }
        };
    }, [isScanning]);

    async function onScanSuccess(decodedText: string) {
        if (loading) return;
        setScanResult(decodedText);
        setIsScanning(false);
        if (scannerRef.current) {
            await scannerRef.current.clear();
            scannerRef.current = null;
        }
        fetchTicket(decodedText);
    }

    function onScanFailure(error: any) {
        // Quietly fail or log for debug
    }

    const fetchTicket = async (qrCode: string) => {
        setLoading(true);
        try {
            const q = query(collection(firestore, 'tickets'), where('qrCode', '==', qrCode));
            const snap = await getDocs(q);

            if (snap.empty) {
                toast({
                    title: "Ticket Not Found",
                    description: "This QR code does not match any valid tickets.",
                    variant: "destructive"
                });
                setTicket(null);
            } else {
                setTicket({ id: snap.docs[0].id, ...snap.docs[0].data() } as TicketRecord);
            }
        } catch (error) {
            console.error("Fetch ticket error:", error);
            toast({
                title: "Error",
                description: "Failed to verify ticket. Please try again.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async () => {
        if (!ticket || ticket.checkedIn) return;
        setLoading(true);
        try {
            await updateDoc(doc(firestore, 'tickets', ticket.id), {
                checkedIn: true,
                checkedInAt: serverTimestamp()
            });
            setTicket(prev => prev ? { ...prev, checkedIn: true } : null);
            toast({
                title: "Check-in Successful",
                description: `${ticket.userName} has been verified.`,
            });
        } catch (error) {
            console.error("Check-in error:", error);
            toast({
                title: "Error",
                description: "Failed to complete check-in.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const resetScanner = () => {
        setScanResult(null);
        setTicket(null);
        setIsScanning(true);
    };

    return (
        <div className="min-h-screen bg-obsidian text-white py-12 px-4">
            <div className="max-w-md mx-auto space-y-8">
                <div className="flex items-center gap-4 mb-8">
                    <div className="h-12 w-12 rounded-2xl bg-gold flex items-center justify-center shadow-lg shadow-gold/20">
                        <ShieldCheck className="text-obsidian h-7 w-7" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">Staff Portal</h1>
                        <p className="text-muted-foreground text-xs font-bold uppercase tracking-widest">Ticket Verification</p>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {isScanning ? (
                        <motion.div
                            key="scanner"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="relative"
                        >
                            <GlassCard className="p-4 border-white/5 overflow-hidden">
                                <div id="reader" className="w-full rounded-xl overflow-hidden" />
                                <div className="mt-4 text-center">
                                    <p className="text-sm text-muted-foreground font-medium">Position the QR code within the frame</p>
                                </div>
                            </GlassCard>

                            {/* Scanning Overlay Animation */}
                            <div className="absolute inset-0 pointer-events-none p-4">
                                <motion.div
                                    className="w-full h-1 bg-gold/50 shadow-[0_0_15px_rgba(212,175,55,0.5)] rounded-full"
                                    animate={{ top: ['10%', '90%', '10%'] }}
                                    transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                    style={{ position: 'absolute', left: 0, width: '100%' }}
                                />
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="result"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-6"
                        >
                            {loading ? (
                                <div className="flex flex-col items-center justify-center py-20 gap-4">
                                    <Loader2 className="h-12 w-12 text-gold animate-spin" />
                                    <p className="font-black uppercase tracking-widest text-xs italic">Verifying Secure Token...</p>
                                </div>
                            ) : ticket ? (
                                <div className="space-y-6">
                                    <GlassCard className={`p-8 border-white/5 relative overflow-hidden ${ticket.checkedIn ? 'bg-kenyan-green/5 border-kenyan-green/20' : ''}`}>
                                        <div className="flex justify-between items-start mb-8">
                                            <Badge variant="outline" className={`text-[10px] font-black uppercase border-gold/30 text-gold`}>
                                                {ticket.ticketType}
                                            </Badge>
                                            <div className="text-right">
                                                <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Status</div>
                                                <div className={`text-sm font-black uppercase italic ${ticket.checkedIn ? 'text-kenyan-green' : 'text-gold'}`}>
                                                    {ticket.checkedIn ? 'Checked In' : 'Ready'}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-gold" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Attendee</div>
                                                    <div className="text-xl font-black uppercase italic text-white">{ticket.userName}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <TicketIcon className="h-6 w-6 text-gold" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Event</div>
                                                    <div className="text-lg font-bold text-white/90">{ticket.eventName}</div>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
                                                    <Calendar className="h-6 w-6 text-gold" />
                                                </div>
                                                <div>
                                                    <div className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Check-in Time</div>
                                                    <div className="text-sm font-medium text-white/80">
                                                        {ticket.checkedInAt ? (ticket.checkedInAt as Timestamp).toDate().toLocaleString() : 'Not checked in yet'}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-10">
                                            <Button
                                                className={`w-full h-16 rounded-2xl font-black uppercase text-lg shadow-xl transition-all ${ticket.checkedIn ? 'bg-white/5 text-muted-foreground border-white/5' : 'bg-kenyan-green hover:bg-kenyan-green/90 shadow-kenyan-green/20'}`}
                                                disabled={ticket.checkedIn || loading}
                                                onClick={handleCheckIn}
                                            >
                                                {ticket.checkedIn ? (
                                                    <div className="flex items-center gap-2">
                                                        <CheckCircle2 className="h-6 w-6" />
                                                        Verified Entry
                                                    </div>
                                                ) : (
                                                    'Verify & Check In'
                                                )}
                                            </Button>
                                        </div>
                                    </GlassCard>

                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl border-white/10 font-bold uppercase text-xs tracking-widest flex gap-2"
                                        onClick={resetScanner}
                                    >
                                        <RefreshCcw className="h-4 w-4" />
                                        Scan Another Ticket
                                    </Button>
                                </div>
                            ) : (
                                <div className="text-center space-y-6 py-12">
                                    <div className="h-20 w-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto">
                                        <XCircle className="h-10 w-10 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black uppercase italic text-white">Invalid Ticket</h3>
                                        <p className="text-muted-foreground text-sm mt-2">This code could not be verified in our system.</p>
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full h-14 rounded-2xl border-white/10 font-bold uppercase text-xs tracking-widest"
                                        onClick={resetScanner}
                                    >
                                        Try Again
                                    </Button>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
