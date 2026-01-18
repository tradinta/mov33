'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    MessageCircle,
    X,
    Send,
    Phone,
    Loader2,
    CheckCircle2,
    Clock,
    Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
    getDocs,
    limit
} from 'firebase/firestore';
import { cn } from '@/lib/utils';

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

const WHATSAPP_NUMBER = '+254700000000'; // Replace with actual WhatsApp number

export function SupportWidget() {
    const { user, profile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [view, setView] = useState<'menu' | 'chat' | 'whatsapp'>('menu');
    const [ticket, setTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Check for existing open ticket
    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(firestore, 'support_tickets'),
            where('userId', '==', user.uid),
            where('status', 'in', ['open', 'in_progress']),
            limit(1)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const doc = snapshot.docs[0];
                setTicket({ id: doc.id, ...doc.data() } as SupportTicket);
            } else {
                setTicket(null);
            }
        });

        return () => unsubscribe();
    }, [user]);

    // Listen for messages when ticket exists
    useEffect(() => {
        if (!ticket) {
            setMessages([]);
            return;
        }

        const q = query(
            collection(firestore, 'support_messages'),
            where('ticketId', '==', ticket.id),
            orderBy('createdAt', 'asc')
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as SupportMessage[];
            setMessages(msgs);

            // Scroll to bottom
            setTimeout(() => {
                scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        });

        return () => unsubscribe();
    }, [ticket]);

    const startChat = async () => {
        if (!user || !profile) return;
        setLoading(true);

        try {
            // Create new ticket
            const ticketRef = await addDoc(collection(firestore, 'support_tickets'), {
                userId: user.uid,
                userEmail: profile.email,
                userName: profile.displayName || 'User',
                status: 'open',
                assignedTo: null,
                createdAt: Timestamp.now(),
                updatedAt: Timestamp.now()
            });

            // Add welcome message
            await addDoc(collection(firestore, 'support_messages'), {
                ticketId: ticketRef.id,
                senderId: 'system',
                senderType: 'mod',
                senderName: 'Mov33 Support',
                message: 'Hello! 👋 Thanks for reaching out. A support agent will be with you shortly. Feel free to describe your issue.',
                createdAt: Timestamp.now()
            });

            setView('chat');
        } catch (error) {
            console.error('Error starting chat:', error);
        } finally {
            setLoading(false);
        }
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !ticket || !user || !profile) return;
        setSending(true);

        try {
            await addDoc(collection(firestore, 'support_messages'), {
                ticketId: ticket.id,
                senderId: user.uid,
                senderType: 'user',
                senderName: profile.displayName || 'User',
                message: newMessage.trim(),
                createdAt: Timestamp.now()
            });

            // Update ticket timestamp
            await updateDoc(doc(firestore, 'support_tickets', ticket.id), {
                updatedAt: Timestamp.now()
            });

            setNewMessage('');
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSending(false);
        }
    };

    const openWhatsApp = () => {
        const message = encodeURIComponent('Hi! I need help with Mov33.');
        window.open(`https://wa.me/${WHATSAPP_NUMBER.replace('+', '')}?text=${message}`, '_blank');
    };

    if (!user) return null;

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300",
                    isOpen ? "bg-white/10 backdrop-blur-xl border border-white/20" : "bg-gold hover:bg-gold/90"
                )}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
            >
                {isOpen ? (
                    <X className="h-6 w-6 text-white" />
                ) : (
                    <MessageCircle className="h-6 w-6 text-obsidian" />
                )}
                {ticket && !isOpen && (
                    <span className="absolute -top-1 -right-1 h-4 w-4 bg-kenyan-green rounded-full border-2 border-obsidian animate-pulse" />
                )}
            </motion.button>

            {/* Widget Panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-24 right-6 z-50 w-[380px] h-[520px] bg-obsidian border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-white/10 bg-gradient-to-r from-gold/10 to-transparent">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-2xl bg-gold flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-obsidian" />
                                </div>
                                <div>
                                    <h3 className="font-black text-white text-lg tracking-tight">Mov33 Support</h3>
                                    <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest">
                                        {ticket ? (ticket.status === 'open' ? 'Waiting for agent' : 'Chat active') : 'How can we help?'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-hidden">
                            {view === 'menu' && !ticket && (
                                <div className="p-6 space-y-4">
                                    <p className="text-sm text-white/60">
                                        Choose how you'd like to get help:
                                    </p>

                                    <Button
                                        onClick={startChat}
                                        disabled={loading}
                                        className="w-full h-14 bg-gold/10 hover:bg-gold/20 text-gold border border-gold/20 rounded-2xl justify-start px-6"
                                    >
                                        {loading ? (
                                            <Loader2 className="h-5 w-5 mr-3 animate-spin" />
                                        ) : (
                                            <MessageCircle className="h-5 w-5 mr-3" />
                                        )}
                                        <div className="text-left">
                                            <span className="font-bold block">Live Chat</span>
                                            <span className="text-[10px] text-gold/60">Chat with a support agent</span>
                                        </div>
                                    </Button>

                                    <Button
                                        onClick={openWhatsApp}
                                        className="w-full h-14 bg-kenyan-green/10 hover:bg-kenyan-green/20 text-kenyan-green border border-kenyan-green/20 rounded-2xl justify-start px-6"
                                    >
                                        <Phone className="h-5 w-5 mr-3" />
                                        <div className="text-left">
                                            <span className="font-bold block">WhatsApp</span>
                                            <span className="text-[10px] text-kenyan-green/60">Get help on WhatsApp</span>
                                        </div>
                                    </Button>

                                    <div className="pt-4 border-t border-white/5">
                                        <p className="text-[10px] text-white/30 text-center">
                                            Available Mon-Sat, 9AM-6PM EAT
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(view === 'chat' || ticket) && (
                                <div className="flex flex-col h-full">
                                    <ScrollArea className="flex-1 p-4">
                                        <div className="space-y-4">
                                            {messages.map((msg) => (
                                                <div
                                                    key={msg.id}
                                                    className={cn(
                                                        "flex",
                                                        msg.senderType === 'user' ? 'justify-end' : 'justify-start'
                                                    )}
                                                >
                                                    <div
                                                        className={cn(
                                                            "max-w-[80%] rounded-2xl px-4 py-3",
                                                            msg.senderType === 'user'
                                                                ? 'bg-gold text-obsidian rounded-br-sm'
                                                                : 'bg-white/10 text-white rounded-bl-sm'
                                                        )}
                                                    >
                                                        {msg.senderType === 'mod' && (
                                                            <p className="text-[10px] font-bold mb-1 opacity-60">
                                                                {msg.senderName}
                                                            </p>
                                                        )}
                                                        <p className="text-sm">{msg.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            <div ref={scrollRef} />
                                        </div>
                                    </ScrollArea>

                                    {/* Input */}
                                    <div className="p-4 border-t border-white/10">
                                        <div className="flex gap-2">
                                            <Input
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                                                placeholder="Type your message..."
                                                className="flex-1 bg-white/5 border-white/10 rounded-xl text-white placeholder:text-white/30"
                                            />
                                            <Button
                                                onClick={sendMessage}
                                                disabled={sending || !newMessage.trim()}
                                                className="h-10 w-10 rounded-xl bg-gold hover:bg-gold/90 text-obsidian"
                                            >
                                                {sending ? (
                                                    <Loader2 className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Send className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
