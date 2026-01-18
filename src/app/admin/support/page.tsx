'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    Search,
    Loader2,
    Send,
    User,
    Clock,
    CheckCircle2,
    AlertCircle,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';
import { firestore } from '@/firebase';
import {
    collection,
    addDoc,
    query,
    where,
    orderBy,
    onSnapshot,
    Timestamp,
    doc,
    updateDoc,
    getDocs
} from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui/glass-card';

interface SupportTicket {
    id: string;
    userId: string;
    userEmail: string;
    userName: string;
    status: 'open' | 'in_progress' | 'resolved';
    assignedTo: string | null;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

interface SupportMessage {
    id: string;
    ticketId: string;
    senderId: string;
    senderType: 'user' | 'mod';
    senderName: string;
    message: string;
    createdAt: Timestamp;
}

export default function AdminSupportPage() {
    const { user, profile } = useAuth();
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [filter, setFilter] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('open');
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch all tickets
    useEffect(() => {
        const q = query(
            collection(firestore, 'support_tickets'),
            orderBy('updatedAt', 'desc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupportTicket[];
            setTickets(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Listen for messages of selected ticket
    useEffect(() => {
        if (!selectedTicket) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(firestore, 'support_messages'),
            where('ticketId', '==', selectedTicket.id),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupportMessage[];
            setMessages(msgs);

            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return () => unsubscribe();
    }, [selectedTicket]);

    const filteredTickets = tickets.filter(t =>
        filter === 'all' || t.status === filter
    );

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedTicket || !user || !profile) return;
        setSending(true);

        try {
            await addDoc(collection(firestore, 'support_messages'), {
                ticketId: selectedTicket.id,
                senderId: user.uid,
                senderType: 'mod',
                senderName: profile.displayName || 'Support Agent',
                message: newMessage.trim(),
                createdAt: Timestamp.now()
            });

            // Update ticket status and timestamp
            await updateDoc(doc(firestore, 'support_tickets', selectedTicket.id), {
                status: 'in_progress',
                assignedTo: user.uid,
                updatedAt: Timestamp.now()
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const resolveTicket = async () => {
        if (!selectedTicket) return;

        try {
            await updateDoc(doc(firestore, 'support_tickets', selectedTicket.id), {
                status: 'resolved',
                updatedAt: Timestamp.now()
            });

            await addDoc(collection(firestore, 'support_messages'), {
                ticketId: selectedTicket.id,
                senderId: 'system',
                senderType: 'mod',
                senderName: 'System',
                message: '✅ This ticket has been marked as resolved. Thank you for contacting Mov33 Support!',
                createdAt: Timestamp.now()
            });
        } catch (error) {
            console.error('Error resolving ticket:', error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'open': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'resolved': return 'bg-kenyan-green/20 text-kenyan-green border-kenyan-green/30';
            default: return 'bg-white/10 text-white/60';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Support Tickets</h1>
                    <p className="text-muted-foreground mt-2">Manage user support requests in real-time.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        {tickets.filter(t => t.status === 'open').length} Open
                    </Badge>
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                        {tickets.filter(t => t.status === 'in_progress').length} In Progress
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
                {(['all', 'open', 'in_progress', 'resolved'] as const).map((f) => (
                    <Button
                        key={f}
                        variant={filter === f ? 'default' : 'outline'}
                        onClick={() => setFilter(f)}
                        className={cn(
                            "rounded-xl",
                            filter === f && f === 'open' && 'bg-yellow-500 text-black',
                            filter === f && f === 'in_progress' && 'bg-blue-500',
                            filter === f && f === 'resolved' && 'bg-kenyan-green'
                        )}
                    >
                        {f === 'in_progress' ? 'In Progress' : f.charAt(0).toUpperCase() + f.slice(1)}
                    </Button>
                ))}
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
                {/* Tickets List */}
                <GlassCard className="lg:col-span-1 p-0 overflow-hidden border-white/5">
                    <div className="p-4 border-b border-white/10">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search tickets..."
                                className="pl-10 bg-white/5 border-white/10"
                            />
                        </div>
                    </div>
                    <ScrollArea className="h-[520px]">
                        <div className="p-2 space-y-2">
                            {filteredTickets.map((ticket) => (
                                <button
                                    key={ticket.id}
                                    onClick={() => setSelectedTicket(ticket)}
                                    className={cn(
                                        "w-full text-left p-4 rounded-xl transition-all duration-200",
                                        selectedTicket?.id === ticket.id
                                            ? 'bg-gold/10 border border-gold/30'
                                            : 'bg-white/5 hover:bg-white/10 border border-transparent'
                                    )}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-bold truncate max-w-[150px]">{ticket.userName}</span>
                                        <Badge className={cn("text-[10px]", getStatusColor(ticket.status))}>
                                            {ticket.status.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{ticket.userEmail}</p>
                                    <div className="flex items-center gap-1 mt-2 text-[10px] text-white/40">
                                        <Clock className="h-3 w-3" />
                                        {format(ticket.updatedAt.toDate(), 'MMM d, h:mm a')}
                                    </div>
                                </button>
                            ))}

                            {filteredTickets.length === 0 && (
                                <div className="text-center py-12 text-muted-foreground">
                                    <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                    <p>No tickets found</p>
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </GlassCard>

                {/* Chat View */}
                <GlassCard className="lg:col-span-2 p-0 overflow-hidden border-white/5 flex flex-col">
                    {selectedTicket ? (
                        <>
                            {/* Chat Header */}
                            <div className="p-4 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="h-10 w-10 rounded-full bg-gold/20 flex items-center justify-center">
                                        <User className="h-5 w-5 text-gold" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold">{selectedTicket.userName}</h3>
                                        <p className="text-xs text-muted-foreground">{selectedTicket.userEmail}</p>
                                    </div>
                                </div>
                                {selectedTicket.status !== 'resolved' && (
                                    <Button
                                        onClick={resolveTicket}
                                        className="bg-kenyan-green hover:bg-kenyan-green/90 text-white"
                                    >
                                        <CheckCircle2 className="h-4 w-4 mr-2" />
                                        Mark Resolved
                                    </Button>
                                )}
                            </div>

                            {/* Messages */}
                            <ScrollArea className="flex-1 p-4">
                                <div className="space-y-4">
                                    {messages.map((msg) => (
                                        <div
                                            key={msg.id}
                                            className={cn(
                                                "flex",
                                                msg.senderType === 'mod' ? 'justify-end' : 'justify-start'
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[70%] rounded-2xl px-4 py-3",
                                                    msg.senderType === 'mod'
                                                        ? 'bg-gold text-obsidian rounded-br-sm'
                                                        : 'bg-white/10 text-white rounded-bl-sm'
                                                )}
                                            >
                                                {msg.senderType === 'user' && (
                                                    <p className="text-[10px] font-bold mb-1 opacity-60">
                                                        {msg.senderName}
                                                    </p>
                                                )}
                                                <p className="text-sm">{msg.message}</p>
                                                <p className={cn(
                                                    "text-[9px] mt-1",
                                                    msg.senderType === 'mod' ? 'text-obsidian/50' : 'text-white/30'
                                                )}>
                                                    {format(msg.createdAt.toDate(), 'h:mm a')}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                    <div ref={scrollRef} />
                                </div>
                            </ScrollArea>

                            {/* Input */}
                            {selectedTicket.status !== 'resolved' && (
                                <div className="p-4 border-t border-white/10">
                                    <div className="flex gap-2">
                                        <Input
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                            placeholder="Type your response..."
                                            className="flex-1 bg-white/5 border-white/10 rounded-xl"
                                        />
                                        <Button
                                            onClick={sendMessage}
                                            disabled={sending || !newMessage.trim()}
                                            className="h-10 px-6 rounded-xl bg-gold hover:bg-gold/90 text-obsidian"
                                        >
                                            {sending ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <>
                                                    Send <Send className="h-4 w-4 ml-2" />
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex items-center justify-center text-muted-foreground">
                            <div className="text-center">
                                <MessageCircle className="h-16 w-16 mx-auto mb-4 opacity-20" />
                                <p className="font-bold">Select a ticket to start responding</p>
                                <p className="text-sm mt-1">Choose from the list on the left</p>
                            </div>
                        </div>
                    )}
                </GlassCard>
            </div>
        </div>
    );
}
