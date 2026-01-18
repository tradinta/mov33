'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    User,
    MoreVertical,
    Shield,
    Mail,
    Calendar,
    Eye,
    Ban,
    CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { firestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp, limit, where } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui/glass-card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/types';

interface UserData {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: UserRole;
    createdAt: Timestamp;
    isVerified?: boolean;
    isSuspended?: boolean;
    mov33Plus?: boolean;
}

export default function AdminUsersPage() {
    const { profile } = useAuth();
    const [users, setUsers] = useState<UserData[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super-admin';

    useEffect(() => {
        const q = query(
            collection(firestore, 'users'),
            orderBy('createdAt', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as UserData[];
            setUsers(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredUsers = users.filter(u => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
            (u.displayName || '').toLowerCase().includes(searchLower) ||
            (u.email || '').toLowerCase().includes(searchLower) ||
            u.uid.toLowerCase().includes(searchLower);
        const matchesRole = roleFilter === 'all' || u.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadge = (role: UserRole) => {
        const styles: Record<UserRole, string> = {
            'user': 'bg-white/10 text-white/60',
            'organizer': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'moderator': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'admin': 'bg-gold/20 text-gold border-gold/30',
            'super-admin': 'bg-red-500/20 text-red-400 border-red-500/30',
            'influencer': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
            'verification': 'bg-kenyan-green/20 text-kenyan-green border-kenyan-green/30'
        };
        return styles[role] || styles.user;
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
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Audience</h1>
                    <p className="text-muted-foreground mt-2">
                        {isAdmin ? 'Manage platform users and roles.' : 'View platform users (read-only).'}
                    </p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge className="bg-white/10 text-white">
                        {users.length} Total Users
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name, email, or ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 bg-card border-border"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'user', 'organizer', 'moderator', 'admin'] as const).map((r) => (
                        <Button
                            key={r}
                            variant={roleFilter === r ? 'default' : 'outline'}
                            onClick={() => setRoleFilter(r)}
                            size="sm"
                            className="rounded-xl"
                        >
                            {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Users Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredUsers.map((user) => (
                    <GlassCard key={user.uid} className="p-6 border-white/5 hover:border-gold/20 transition-all">
                        <div className="flex items-start justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-12 w-12 border-2 border-white/10">
                                    <AvatarImage src={user.photoURL || ''} />
                                    <AvatarFallback className="bg-gold/20 text-gold font-bold">
                                        {user.displayName?.[0] || user.email?.[0] || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="font-bold truncate max-w-[150px]">
                                            {user.displayName || 'Anonymous'}
                                        </h3>
                                        {user.isVerified && (
                                            <CheckCircle2 className="h-4 w-4 text-blue-400" />
                                        )}
                                        {user.mov33Plus && (
                                            <Badge className="bg-gold/20 text-gold text-[9px] px-1.5 py-0">PLUS</Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {user.email}
                                    </p>
                                </div>
                            </div>

                            {isAdmin && (
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Eye className="h-4 w-4 mr-2" /> View Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <Mail className="h-4 w-4 mr-2" /> Send Message
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem className="text-red-500">
                                            <Ban className="h-4 w-4 mr-2" /> Suspend User
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            )}
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <Badge className={cn("text-[10px]", getRoleBadge(user.role))}>
                                <Shield className="h-3 w-3 mr-1" />
                                {user.role}
                            </Badge>
                            <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                {format(user.createdAt?.toDate?.() || new Date(), 'MMM yyyy')}
                            </div>
                        </div>

                        {user.isSuspended && (
                            <Badge className="mt-3 w-full justify-center bg-red-500/20 text-red-400 border-red-500/30">
                                Account Suspended
                            </Badge>
                        )}
                    </GlassCard>
                ))}
            </div>

            {filteredUsers.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <User className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No users found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters</p>
                </div>
            )}
        </div>
    );
}
