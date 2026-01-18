'use client';

import React, { useState, useEffect } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Bell, Package, Tag, Info, Check } from 'lucide-react';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, orderBy, onSnapshot, doc, updateDoc, limit } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Notification as NotificationType } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function NotificationCenter() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<NotificationType[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        if (!user) return;

        const q = query(
            collection(firestore, 'notifications'),
            where('userId', '==', user.uid),
            orderBy('createdAt', 'desc'),
            limit(10)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as NotificationType));
            setNotifications(items);
            setUnreadCount(items.filter(n => !n.read).length);
        });

        return () => unsubscribe();
    }, [user]);

    const markAsRead = async (id: string) => {
        try {
            await updateDoc(doc(firestore, 'notifications', id), { read: true });
        } catch (error) {
            console.error("Mark as read failed:", error);
        }
    };

    const getIcon = (type: NotificationType['type']) => {
        switch (type) {
            case 'order': return <Package className="h-4 w-4 text-kenyan-green" />;
            case 'deal': return <Tag className="h-4 w-4 text-gold" />;
            case 'system': return <Info className="h-4 w-4 text-blue-400" />;
            default: return <Bell className="h-4 w-4 text-white/40" />;
        }
    };

    if (!user) return null;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full hover:bg-white/5">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold animate-pulse" />
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[350px] bg-obsidian border-white/10 p-0 overflow-hidden" align="end">
                <div className="p-4 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                    <DropdownMenuLabel className="p-0 text-white font-black uppercase tracking-widest text-[10px]">Notifications</DropdownMenuLabel>
                    {unreadCount > 0 && (
                        <span className="text-[10px] font-black uppercase bg-gold/10 text-gold px-2 py-0.5 rounded-full">
                            {unreadCount} New
                        </span>
                    )}
                </div>

                <div className="max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {notifications.length === 0 ? (
                        <div className="py-12 text-center space-y-2">
                            <Bell className="h-8 w-8 text-white/10 mx-auto" />
                            <p className="text-white/20 text-[10px] font-black uppercase tracking-widest">No notifications yet</p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <DropdownMenuItem
                                key={n.id}
                                className={cn(
                                    "p-4 flex flex-col items-start gap-1 cursor-pointer transition-colors border-l-2 border-transparent",
                                    !n.read ? "bg-white/[0.04] border-gold" : "opacity-60 grayscale-[0.5] hover:opacity-100 hover:bg-white/[0.02]"
                                )}
                                onSelect={() => markAsRead(n.id)}
                            >
                                <div className="flex items-center justify-between w-full">
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-lg bg-white/5 flex items-center justify-center">
                                            {getIcon(n.type)}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-widest text-white/80">{n.title}</span>
                                    </div>
                                    <span className="text-[8px] font-black text-white/20 uppercase">
                                        {formatDistanceToNow(n.createdAt.toDate())} ago
                                    </span>
                                </div>
                                <p className="text-[11px] text-white/40 font-poppins pl-9 leading-relaxed">
                                    {n.message}
                                </p>
                                {n.link && (
                                    <Link href={n.link} className="pl-9 text-[9px] font-black uppercase tracking-widest text-gold hover:underline mt-1">
                                        View Details
                                    </Link>
                                )}
                            </DropdownMenuItem>
                        ))
                    )}
                </div>

                <DropdownMenuSeparator className="bg-white/5" />
                <button className="w-full py-3 text-center text-white/20 hover:text-white text-[9px] font-black uppercase tracking-widest transition-colors bg-white/[0.02]">
                    Clear All Notifications
                </button>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
