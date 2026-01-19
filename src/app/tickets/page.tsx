'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, orderBy, doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { TicketRecord } from '@/lib/types';
import { Loader2, Ticket, Download, Edit2, DownloadCloud, Share2, MapPin, Calendar, Clock, QrCode } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { format } from 'date-fns';
import { QRCodeSVG } from 'qrcode.react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

export default function TicketCenterPage() {
    const { user, loading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();
    const [tickets, setTickets] = useState<TicketRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingTicket, setEditingTicket] = useState<TicketRecord | null>(null);
    const [newHolderName, setNewHolderName] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
            return;
        }

        const fetchTickets = async () => {
            if (!user) return;
            try {
                const q = query(
                    collection(firestore, 'tickets'),
                    where('userId', '==', user.uid),
                    orderBy('createdAt', 'desc')
                );
                const snap = await getDocs(q);
                const ticketList = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TicketRecord));
                setTickets(ticketList);
            } catch (error) {
                console.error("Error fetching tickets:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, [user, authLoading, router]);

    const handleUpdateTicket = async () => {
        if (!editingTicket || !newHolderName.trim()) return;
        setUpdating(true);
        try {
            await updateDoc(doc(firestore, 'tickets', editingTicket.id), {
                userName: newHolderName
            });

            setTickets(tickets.map(t => t.id === editingTicket.id ? { ...t, userName: newHolderName } : t));
            setEditingTicket(null);
            toast({
                title: "Ticket Updated",
                description: "Ticket holder name has been successfully updated.",
            });
        } catch (error) {
            console.error("Error updating ticket:", error);
            toast({
                title: "Update Failed",
                description: "Could not update ticket details. Please try again.",
                variant: "destructive"
            });
        } finally {
            setUpdating(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-background dark:bg-obsidian flex flex-col items-center justify-center gap-6">
                <Loader2 className="h-10 w-10 animate-spin text-gold" />
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground animate-pulse">Loading Your Tickets...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background dark:bg-obsidian pt-24 pb-20 transition-colors duration-300">
            <div className="container mx-auto px-4 max-w-5xl space-y-12">

                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="font-headline text-4xl font-black uppercase italic tracking-tighter text-foreground dark:text-white mb-2">Ticket Center</h1>
                        <p className="text-muted-foreground text-sm max-w-md">Manage, personalize, and download your event passes.</p>
                    </div>
                    {tickets.length > 0 && (
                        <div className="bg-gold/10 border border-gold/20 px-6 py-3 rounded-2xl flex items-center gap-3">
                            <Ticket className="h-5 w-5 text-gold" />
                            <span className="font-black text-xl text-gold">{tickets.length}</span>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-gold/60">Active Passes</span>
                        </div>
                    )}
                </div>

                {tickets.length > 0 ? (
                    <div className="grid gap-8">
                        {tickets.map(ticket => {
                            const eventDate = ticket.eventDate?.toDate ? ticket.eventDate.toDate() : new Date();
                            const isPast = eventDate < new Date();

                            return (
                                <motion.div
                                    key={ticket.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="relative group"
                                >
                                    <GlassCard className="flex flex-col md:flex-row overflow-hidden border-black/5 dark:border-white/5 hover:border-gold/30 transition-all duration-300 bg-black/[0.02] dark:bg-white/[0.02]">
                                        {/* Left: Event Image & Date */}
                                        <div className="md:w-1/3 relative h-48 md:h-auto min-h-[220px]">
                                            <Image
                                                src={ticket.eventImageUrl || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30"}
                                                alt={ticket.eventName}
                                                fill
                                                className={`object-cover ${isPast ? 'grayscale opacity-60' : ''}`}
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background dark:from-obsidian via-transparent to-transparent opacity-90" />

                                            <div className="absolute top-4 left-4 bg-background/90 dark:bg-obsidian/90 backdrop-blur-md rounded-xl p-3 text-center min-w-[60px] border border-black/10 dark:border-white/10 shadow-lg">
                                                <span className="block text-[9px] uppercase font-black text-gold/80 tracking-widest leading-none mb-1">{format(eventDate, 'MMM')}</span>
                                                <span className="block font-black text-2xl text-foreground dark:text-white leading-none font-headline">{format(eventDate, 'dd')}</span>
                                            </div>
                                        </div>

                                        {/* Right: Ticket Details */}
                                        <div className="p-6 md:p-8 flex-1 flex flex-col relative">
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <Badge variant="outline" className="mb-2 text-[9px] font-black uppercase tracking-widest border-gold/30 text-gold bg-gold/5">
                                                        {ticket.ticketType} Pass
                                                    </Badge>
                                                    <h3 className="font-headline text-2xl font-black text-foreground dark:text-white italic uppercase tracking-tighter leading-tight mb-2">
                                                        {ticket.eventName}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-4 text-xs font-bold uppercase tracking-tight text-muted-foreground">
                                                        <div className="flex items-center gap-1.5">
                                                            <MapPin className="h-3.5 w-3.5 text-gold" /> {ticket.eventLocation}
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <Clock className="h-3.5 w-3.5 text-gold" /> {format(eventDate, 'p')}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="bg-white p-2 rounded-xl shadow-sm hidden md:block">
                                                    <QRCodeSVG value={ticket.qrCode} size={64} />
                                                </div>
                                            </div>

                                            <div className="mt-auto pt-6 border-t border-black/5 dark:border-white/5 flex flex-col md:flex-row items-center justify-between gap-6">
                                                <div className="flex items-center gap-4 w-full md:w-auto">
                                                    <div className="h-10 w-10 rounded-full bg-black/5 dark:bg-white/5 flex items-center justify-center text-foreground dark:text-white font-black text-sm">
                                                        {ticket.userName[0]}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-[9px] uppercase font-black text-muted-foreground tracking-widest">Ticket Holder</p>
                                                        <p className="font-bold text-sm text-foreground dark:text-white truncate max-w-[150px]">{ticket.userName}</p>
                                                    </div>
                                                    <Dialog open={editingTicket?.id === ticket.id} onOpenChange={(open) => {
                                                        if (open) {
                                                            setEditingTicket(ticket);
                                                            setNewHolderName(ticket.userName);
                                                        } else {
                                                            setEditingTicket(null);
                                                        }
                                                    }}>
                                                        <DialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-gold">
                                                                <Edit2 className="h-3.5 w-3.5" />
                                                            </Button>
                                                        </DialogTrigger>
                                                        <DialogContent>
                                                            <DialogHeader>
                                                                <DialogTitle>Personalize Ticket</DialogTitle>
                                                                <DialogDescription>
                                                                    Update the name on this ticket. This name will appear on the entry pass.
                                                                </DialogDescription>
                                                            </DialogHeader>
                                                            <div className="py-4">
                                                                <Label className="mb-2 block">Full Name</Label>
                                                                <Input
                                                                    value={newHolderName}
                                                                    onChange={(e) => setNewHolderName(e.target.value)}
                                                                    placeholder="Enter holder's full name"
                                                                />
                                                            </div>
                                                            <DialogFooter>
                                                                <Button onClick={handleUpdateTicket} disabled={updating} className="bg-gold text-obsidian font-bold">
                                                                    {updating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                                    Save Changes
                                                                </Button>
                                                            </DialogFooter>
                                                        </DialogContent>
                                                    </Dialog>
                                                </div>

                                                <div className="flex gap-3 w-full md:w-auto">
                                                    <Button className="flex-1 md:flex-none bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-foreground dark:text-white font-bold text-xs uppercase tracking-widest h-10 border border-black/10 dark:border-white/10" variant="outline" onClick={() => window.print()}>
                                                        <DownloadCloud className="mr-2 h-4 w-4" /> Download
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </GlassCard>
                                </motion.div>
                            );
                        })}
                    </div>
                ) : (
                    <GlassCard className="text-center py-32 border-dashed border-black/10 dark:border-white/10">
                        <div className="h-20 w-20 bg-black/5 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Ticket className="h-10 w-10 text-muted-foreground/40" />
                        </div>
                        <h3 className="text-2xl font-black uppercase italic tracking-tighter text-foreground dark:text-white">No Tickets Found</h3>
                        <p className="text-muted-foreground mt-2 mb-8 font-poppins text-sm">You haven't purchased any event tickets yet.</p>
                        <Button onClick={() => router.push('/events')} className="bg-gold text-obsidian font-black uppercase tracking-widest text-sm h-12 px-8 rounded-xl shadow-lg shadow-gold/20">
                            Browse Events
                        </Button>
                    </GlassCard>
                )}
            </div>
        </div>
    );
}
