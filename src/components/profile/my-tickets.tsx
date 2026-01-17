'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Share2, MapPin, Calendar, Clock, QrCode, CheckCircle2, Ticket } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";
import { TicketRecord } from "@/lib/types";
import { format } from "date-fns";
import { QRCodeSVG } from 'qrcode.react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '../ui/badge';
import { GlassCard } from '../ui/glass-card';

function TicketCard({ ticket }: { ticket: TicketRecord }) {
    const [isExpanded, setIsExpanded] = React.useState(false);

    const eventDate = ticket.eventDate?.toDate ? ticket.eventDate.toDate() : new Date();
    const isPast = eventDate < new Date();

    return (
        <motion.div layout>
            <GlassCard
                className={`flex flex-col md:flex-row overflow-hidden hover:shadow-2xl hover:shadow-gold/5 transition-all duration-500 border-black/5 dark:border-white/5 group ${ticket.checkedIn ? 'opacity-80' : ''}`}
            >
                <div className="md:w-1/3 relative h-48 md:h-auto min-h-[220px] overflow-hidden">
                    <Image
                        src={ticket.eventImageUrl || "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800"}
                        alt={ticket.eventName}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/20 to-transparent"></div>

                    {/* Date Badge on Image */}
                    <div className="absolute top-4 left-4 bg-background/80 dark:bg-obsidian/80 backdrop-blur-md rounded-xl p-2 text-center min-w-[50px] border border-black/10 dark:border-white/10 shadow-lg">
                        <span className="block text-[8px] uppercase font-black text-gold/80 tracking-widest">{format(eventDate, 'MMM')}</span>
                        <span className="block font-black text-xl text-foreground dark:text-white leading-tight font-headline">{format(eventDate, 'dd')}</span>
                    </div>

                    {ticket.checkedIn && (
                        <div className="absolute inset-0 bg-kenyan-green/20 backdrop-blur-[2px] flex items-center justify-center">
                            <Badge className="bg-kenyan-green text-white font-black uppercase text-xs px-4 py-1.5 rounded-full shadow-lg">
                                <CheckCircle2 className="mr-2 h-4 w-4" /> Already Verified
                            </Badge>
                        </div>
                    )}
                </div>

                <div className="p-8 flex flex-col justify-between flex-1 relative">
                    <div className="space-y-4">
                        <div className="flex justify-between items-start">
                            <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-gold/30 text-gold bg-gold/5">
                                {ticket.ticketType}
                            </Badge>
                            <code className="text-[9px] font-mono text-muted-foreground bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded border border-black/5 dark:border-white/5 uppercase">
                                ID: {ticket.id.slice(0, 8)}
                            </code>
                        </div>

                        <div>
                            <h3 className="font-headline text-2xl font-black text-foreground dark:text-white italic uppercase tracking-tighter leading-tight group-hover:text-gold transition-colors">
                                {ticket.eventName}
                            </h3>
                            <div className="flex flex-wrap gap-4 mt-3 text-muted-foreground font-poppins">
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight">
                                    <MapPin className="h-3.5 w-3.5 text-gold" />
                                    <span>{ticket.eventLocation}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-tight">
                                    <Clock className="h-3.5 w-3.5 text-gold" />
                                    <span>{format(eventDate, 'hh:mm a')}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-1">Holder</span>
                            <span className="font-bold text-sm text-foreground/90 dark:text-white/90">{ticket.userName}</span>
                        </div>

                        <div className="flex gap-3">
                            {!isPast && !ticket.checkedIn && (
                                <Button
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="bg-gold hover:bg-gold/90 text-obsidian font-black uppercase text-xs rounded-xl px-6 h-12 shadow-lg shadow-gold/10 flex gap-2"
                                >
                                    <QrCode className="h-4 w-4" />
                                    {isExpanded ? 'Hide Pass' : 'View Pass'}
                                </Button>
                            )}
                            <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-muted-foreground hover:text-foreground dark:hover:text-white transition-all">
                                <Download className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                </div>
            </GlassCard>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden mt-4"
                    >
                        <GlassCard className="p-8 border-gold/20 bg-gold/5 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                            <div className="bg-white p-4 rounded-2xl shadow-xl border border-black/5">
                                <QRCodeSVG
                                    value={ticket.qrCode}
                                    size={160}
                                    level="H"
                                    includeMargin={false}
                                />
                            </div>
                            <div className="flex-1 text-center md:text-left space-y-4">
                                <h4 className="font-headline text-lg font-black uppercase text-gold italic">Entry Verification Pass</h4>
                                <p className="text-muted-foreground text-xs font-poppins leading-relaxed max-w-sm">
                                    Please present this QR code at the entrance. Our staff will scan it to verify your entry. Do not share this code with anyone.
                                </p>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4">
                                    <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest h-9 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground dark:text-white">
                                        <Share2 className="mr-2 h-3.5 w-3.5" /> Share Pass
                                    </Button>
                                    <Button variant="outline" size="sm" className="text-[10px] font-black uppercase tracking-widest h-9 border-black/10 dark:border-white/10 bg-black/5 dark:bg-white/5 text-foreground dark:text-white">
                                        Email PDF
                                    </Button>
                                </div>
                            </div>
                        </GlassCard>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export function MyTickets({ tickets = [] }: { tickets?: TicketRecord[] }) {
    const upcomingTickets = tickets.filter(t => {
        const date = t.eventDate?.toDate ? t.eventDate.toDate() : new Date();
        return date >= new Date();
    });

    const pastTickets = tickets.filter(t => {
        const date = t.eventDate?.toDate ? t.eventDate.toDate() : new Date();
        return date < new Date();
    });

    return (
        <div className="space-y-16">
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-1.5 w-12 bg-gold rounded-full" />
                    <h2 className="font-headline text-3xl font-black uppercase italic tracking-tighter text-foreground dark:text-white">Upcoming Experiences</h2>
                </div>

                {upcomingTickets.length > 0 ? (
                    <div className="grid gap-8">
                        {upcomingTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
                    </div>
                ) : (
                    <GlassCard className="text-center py-20 border-dashed border-black/10 dark:border-white/10 bg-black/[0.02] dark:bg-white/[0.02]">
                        <Ticket className="mx-auto h-16 w-16 text-muted-foreground/30 mb-6" />
                        <h3 className="text-xl font-black uppercase italic text-muted-foreground/50 dark:text-white/50">Your pocket is empty</h3>
                        <p className="mt-2 text-muted-foreground text-sm font-poppins">Why not explore the latest events and tours?</p>
                        <Button className="mt-8 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground dark:text-white font-bold uppercase text-[10px] tracking-widest px-8 rounded-xl h-12 border border-black/10 dark:border-white/10 transition-all">
                            Explore Now
                        </Button>
                    </GlassCard>
                )}
            </div>

            {pastTickets.length > 0 && (
                <div className="space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="h-1.5 w-12 bg-black/20 dark:bg-white/20 rounded-full" />
                        <h2 className="font-headline text-2xl font-black uppercase italic tracking-tighter text-muted-foreground/40 dark:text-white/40">Past Memories</h2>
                    </div>
                    <div className="grid gap-8">
                        {pastTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
                    </div>
                </div>
            )}
        </div>
    );
}
