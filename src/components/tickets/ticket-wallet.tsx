'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    QrCode,
    Download,
    Share2,
    Wallet,
    ChevronLeft,
    ChevronRight,
    Calendar,
    MapPin,
    Clock,
    CheckCircle2,
    Smartphone,
    Apple,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { GlassCard } from '@/components/ui/glass-card';
import { TicketRecord } from '@/lib/types';
import { QRCodeSVG } from 'qrcode.react';
import { format } from 'date-fns';
import Image from 'next/image';

interface TicketWalletProps {
    tickets: TicketRecord[];
    onClose?: () => void;
}

export function TicketWallet({ tickets, onClose }: TicketWalletProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const upcomingTickets = tickets.filter(t => {
        const date = t.eventDate?.toDate ? t.eventDate.toDate() : new Date();
        return date >= new Date() && !t.checkedIn;
    });

    const currentTicket = upcomingTickets[currentIndex];

    const nextTicket = () => {
        if (currentIndex < upcomingTickets.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const prevTicket = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const handleAddToWallet = (type: 'apple' | 'google') => {
        // This would integrate with Apple Wallet or Google Pay
        alert(`Adding to ${type === 'apple' ? 'Apple Wallet' : 'Google Pay'}... (Integration coming soon)`);
    };

    const handleDownloadPDF = () => {
        // This would generate and download a PDF ticket
        alert('Downloading PDF ticket... (Integration coming soon)');
    };

    const handleShare = async () => {
        if (navigator.share && currentTicket) {
            try {
                await navigator.share({
                    title: currentTicket.eventName,
                    text: `Check out my ticket for ${currentTicket.eventName}!`,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Share cancelled');
            }
        }
    };

    if (upcomingTickets.length === 0) {
        return (
            <GlassCard className="p-12 text-center border-dashed border-white/10">
                <Wallet className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
                <h3 className="text-xl font-black uppercase italic text-white/50">Your Wallet is Empty</h3>
                <p className="mt-2 text-muted-foreground text-sm font-poppins">
                    Purchase tickets to see them here for easy access.
                </p>
            </GlassCard>
        );
    }

    if (!currentTicket) return null;

    const eventDate = currentTicket.eventDate?.toDate ? currentTicket.eventDate.toDate() : new Date();

    return (
        <div className="fixed inset-0 z-50 bg-obsidian/95 backdrop-blur-xl flex flex-col" ref={containerRef}>
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                        <Wallet className="h-5 w-5 text-gold" />
                    </div>
                    <div>
                        <h2 className="font-black text-lg uppercase tracking-tight text-white">Ticket Wallet</h2>
                        <p className="text-[10px] text-white/40 font-medium uppercase tracking-widest">
                            {upcomingTickets.length} Active Pass{upcomingTickets.length !== 1 ? 'es' : ''}
                        </p>
                    </div>
                </div>
                {onClose && (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={onClose}
                        className="h-10 w-10 rounded-xl text-white/40 hover:text-white hover:bg-white/10"
                    >
                        <X className="h-5 w-5" />
                    </Button>
                )}
            </div>

            {/* Ticket Carousel */}
            <div className="flex-1 flex items-center justify-center p-6 overflow-hidden">
                <div className="relative w-full max-w-md">
                    {/* Navigation Arrows */}
                    {upcomingTickets.length > 1 && (
                        <>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={prevTicket}
                                disabled={currentIndex === 0}
                                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full z-10 h-12 w-12 rounded-full bg-white/5 text-white disabled:opacity-20"
                            >
                                <ChevronLeft className="h-6 w-6" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={nextTicket}
                                disabled={currentIndex === upcomingTickets.length - 1}
                                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full z-10 h-12 w-12 rounded-full bg-white/5 text-white disabled:opacity-20"
                            >
                                <ChevronRight className="h-6 w-6" />
                            </Button>
                        </>
                    )}

                    {/* Ticket Card - Flippable */}
                    <motion.div
                        className="perspective-1000"
                        style={{ perspective: 1000 }}
                    >
                        <motion.div
                            animate={{ rotateY: isFlipped ? 180 : 0 }}
                            transition={{ duration: 0.6, type: 'spring', stiffness: 100 }}
                            className="relative preserve-3d cursor-pointer"
                            style={{ transformStyle: 'preserve-3d' }}
                            onClick={() => setIsFlipped(!isFlipped)}
                        >
                            {/* Front of Ticket */}
                            <div
                                className="backface-hidden"
                                style={{ backfaceVisibility: 'hidden' }}
                            >
                                <Card className="bg-gradient-to-br from-obsidian via-zinc-900 to-obsidian border-gold/20 rounded-[2rem] overflow-hidden shadow-2xl shadow-gold/10">
                                    {/* Event Image Header */}
                                    <div className="relative h-40 overflow-hidden">
                                        <Image
                                            src={currentTicket.eventImageUrl || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30'}
                                            alt={currentTicket.eventName}
                                            fill
                                            className="object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/50 to-transparent" />

                                        {/* Status Badge */}
                                        <Badge className="absolute top-4 right-4 bg-kenyan-green text-white font-black text-[10px] uppercase border-none">
                                            <CheckCircle2 className="mr-1 h-3 w-3" /> Valid
                                        </Badge>
                                    </div>

                                    {/* Ticket Content */}
                                    <div className="p-6 space-y-6">
                                        {/* Event Name */}
                                        <div>
                                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-gold/30 text-gold bg-gold/5 mb-2">
                                                {currentTicket.ticketType}
                                            </Badge>
                                            <h3 className="font-headline text-2xl font-black text-white italic uppercase tracking-tighter leading-tight">
                                                {currentTicket.eventName}
                                            </h3>
                                        </div>

                                        {/* Event Details */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Calendar className="h-4 w-4 text-gold" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Date</span>
                                                </div>
                                                <p className="font-bold text-white">{format(eventDate, 'EEE, MMM d')}</p>
                                            </div>
                                            <div className="space-y-1">
                                                <div className="flex items-center gap-2 text-white/40">
                                                    <Clock className="h-4 w-4 text-gold" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest">Time</span>
                                                </div>
                                                <p className="font-bold text-white">{format(eventDate, 'h:mm a')}</p>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-white/40">
                                                <MapPin className="h-4 w-4 text-gold" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Location</span>
                                            </div>
                                            <p className="font-bold text-white">{currentTicket.eventLocation}</p>
                                        </div>

                                        {/* Perforated Line */}
                                        <div className="relative py-4">
                                            <div className="absolute left-0 right-0 top-1/2 border-t-2 border-dashed border-white/10" />
                                            <div className="absolute -left-6 top-1/2 -translate-y-1/2 h-6 w-6 bg-obsidian rounded-full" />
                                            <div className="absolute -right-6 top-1/2 -translate-y-1/2 h-6 w-6 bg-obsidian rounded-full" />
                                        </div>

                                        {/* QR Preview */}
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-white/40">Holder</p>
                                                <p className="font-bold text-white">{currentTicket.userName}</p>
                                            </div>
                                            <div className="text-center">
                                                <div className="bg-white p-2 rounded-xl">
                                                    <QRCodeSVG value={currentTicket.qrCode} size={60} level="H" />
                                                </div>
                                                <p className="text-[9px] text-white/30 mt-1 font-medium">Tap to enlarge</p>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Back of Ticket (QR Code) */}
                            <div
                                className="absolute inset-0 backface-hidden"
                                style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
                            >
                                <Card className="h-full bg-white rounded-[2rem] flex flex-col items-center justify-center p-8 shadow-2xl">
                                    <div className="text-center mb-6">
                                        <h4 className="font-headline text-xl font-black uppercase text-obsidian italic tracking-tighter">
                                            Entry Pass
                                        </h4>
                                        <p className="text-sm text-obsidian/60 font-poppins">
                                            Present this code at the entrance
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-2xl shadow-inner">
                                        <QRCodeSVG
                                            value={currentTicket.qrCode}
                                            size={200}
                                            level="H"
                                            includeMargin={false}
                                        />
                                    </div>

                                    <p className="mt-6 text-xs text-obsidian/40 font-mono uppercase tracking-wider">
                                        ID: {currentTicket.id.slice(0, 12)}...
                                    </p>

                                    <p className="text-[10px] text-obsidian/60 mt-4 font-poppins text-center">
                                        Tap to flip back
                                    </p>
                                </Card>
                            </div>
                        </motion.div>
                    </motion.div>

                    {/* Pagination Dots */}
                    {upcomingTickets.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {upcomingTickets.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => { setCurrentIndex(idx); setIsFlipped(false); }}
                                    className={`h-2 rounded-full transition-all ${idx === currentIndex
                                            ? 'w-6 bg-gold'
                                            : 'w-2 bg-white/20 hover:bg-white/40'
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Actions Footer */}
            <div className="p-6 border-t border-white/5 space-y-4">
                {/* Add to Wallet */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={() => handleAddToWallet('apple')}
                        className="h-14 rounded-2xl border-white/10 bg-white/5 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10"
                    >
                        <Apple className="mr-2 h-5 w-5" /> Add to Wallet
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleAddToWallet('google')}
                        className="h-14 rounded-2xl border-white/10 bg-white/5 text-white font-bold uppercase text-[10px] tracking-widest hover:bg-white/10"
                    >
                        <Smartphone className="mr-2 h-5 w-5" /> Google Pay
                    </Button>
                </div>

                {/* Secondary Actions */}
                <div className="grid grid-cols-2 gap-3">
                    <Button
                        variant="outline"
                        onClick={handleDownloadPDF}
                        className="h-12 rounded-xl border-white/10 bg-white/5 text-white/60 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white"
                    >
                        <Download className="mr-2 h-4 w-4" /> Download PDF
                    </Button>
                    <Button
                        variant="outline"
                        onClick={handleShare}
                        className="h-12 rounded-xl border-white/10 bg-white/5 text-white/60 font-bold uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white"
                    >
                        <Share2 className="mr-2 h-4 w-4" /> Share
                    </Button>
                </div>
            </div>
        </div>
    );
}

/**
 * Compact floating button to open the ticket wallet
 */
interface WalletFabProps {
    ticketCount: number;
    onClick: () => void;
}

export function WalletFab({ ticketCount, onClick }: WalletFabProps) {
    if (ticketCount === 0) return null;

    return (
        <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClick}
            className="fixed bottom-6 right-6 z-40 h-16 w-16 rounded-full bg-gold text-obsidian shadow-2xl shadow-gold/30 flex items-center justify-center"
        >
            <Wallet className="h-7 w-7" />
            <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-kenyan-green text-white text-xs font-black flex items-center justify-center border-2 border-obsidian">
                {ticketCount}
            </span>
        </motion.button>
    );
}
