'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    Shield,
    MoreVertical,
    UserPlus,
    Ban,
    CheckCircle2,
    Mail,
    Crown,
    ShieldAlert
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { firestore } from '@/firebase';
import { collection, query, where, onSnapshot, Timestamp, doc, updateDoc } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui/glass-card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from '@/components/ui/dropdown-menu';
import { UserRole } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface StaffMember {
    uid: string;
    email: string;
    displayName?: string;
    photoURL?: string;
    role: UserRole;
    createdAt: Timestamp;
    isSuspended?: boolean;
}

export default function AdminManagePage() {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    const isSuperAdmin = profile?.role === 'super-admin';
    const isAdmin = profile?.role === 'admin' || isSuperAdmin;

    useEffect(() => {
        const q = query(
            collection(firestore, 'users'),
            where('role', 'in', ['admin', 'moderator', 'super-admin'])
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                uid: doc.id,
                ...doc.data()
            })) as StaffMember[];
            setStaff(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredStaff = staff.filter(s => {
        const searchLower = searchTerm.toLowerCase();
        return (
            (s.displayName || '').toLowerCase().includes(searchLower) ||
            (s.email || '').toLowerCase().includes(searchLower)
        );
    });

    const changeRole = async (uid: string, newRole: UserRole) => {
        if (!isSuperAdmin) {
            toast({
                title: 'Permission Denied',
                description: 'Only super-admins can change staff roles.',
                variant: 'destructive'
            });
            return;
        }

        try {
            await updateDoc(doc(firestore, 'users', uid), { role: newRole });
            toast({
                title: 'Role Updated',
                description: `User role changed to ${newRole}.`,
            });
        } catch (error) {
            console.error('Error changing role:', error);
            toast({
                title: 'Error',
                description: 'Failed to update role.',
                variant: 'destructive'
            });
        }
    };

    const toggleSuspension = async (uid: string, suspend: boolean) => {
        try {
            await updateDoc(doc(firestore, 'users', uid), { isSuspended: suspend });
            toast({
                title: suspend ? 'Staff Suspended' : 'Staff Reinstated',
                description: suspend ? 'Staff member has been suspended.' : 'Staff member access restored.',
            });
        } catch (error) {
            console.error('Error toggling suspension:', error);
        }
    };

    const getRoleBadge = (role: UserRole) => {
        const styles: Record<string, string> = {
            'super-admin': 'bg-red-500/20 text-red-400 border-red-500/30',
            'admin': 'bg-gold/20 text-gold border-gold/30',
            'moderator': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        };
        return styles[role] || 'bg-white/10 text-white/60';
    };

    const getRoleIcon = (role: UserRole) => {
        switch (role) {
            case 'super-admin': return Crown;
            case 'admin': return Shield;
            default: return ShieldAlert;
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GlassCard className="p-12 text-center border-red-500/30">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
                    <h2 className="text-2xl font-black">Access Denied</h2>
                    <p className="text-muted-foreground mt-2">
                        Only admins can access staff management.
                    </p>
                </GlassCard>
            </div>
        );
    }

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
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Staff Management</h1>
                    <p className="text-muted-foreground mt-2">Manage platform administrators and moderators.</p>
                </div>
                <div className="flex items-center gap-4">
                    <Badge className="bg-gold/20 text-gold border-gold/30">
                        {staff.length} Staff Members
                    </Badge>
                    {isSuperAdmin && (
                        <Button className="bg-gold hover:bg-gold/90 text-obsidian">
                            <UserPlus className="h-4 w-4 mr-2" /> Invite Staff
                        </Button>
                    )}
                </div>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search staff..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-card border-border"
                />
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredStaff.map((member) => {
                    const RoleIcon = getRoleIcon(member.role);
                    const isCurrentUser = member.uid === user?.uid;

                    return (
                        <GlassCard
                            key={member.uid}
                            className={cn(
                                "p-6 border-white/5 relative overflow-hidden",
                                member.isSuspended && "opacity-60"
                            )}
                        >
                            {member.isSuspended && (
                                <div className="absolute top-4 right-4">
                                    <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
                                        Suspended
                                    </Badge>
                                </div>
                            )}

                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar className="h-14 w-14 border-2 border-white/10">
                                        <AvatarImage src={member.photoURL || ''} />
                                        <AvatarFallback className="bg-gold/20 text-gold font-bold text-lg">
                                            {member.displayName?.[0] || member.email?.[0] || 'S'}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <h3 className="font-bold">
                                                {member.displayName || 'Staff Member'}
                                            </h3>
                                            {isCurrentUser && (
                                                <Badge className="bg-blue-500/20 text-blue-400 text-[9px]">You</Badge>
                                            )}
                                        </div>
                                        <p className="text-xs text-muted-foreground truncate max-w-[180px]">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <Badge className={cn("text-[10px]", getRoleBadge(member.role))}>
                                    <RoleIcon className="h-3 w-3 mr-1" />
                                    {member.role}
                                </Badge>

                                {!isCurrentUser && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem>
                                                <Mail className="h-4 w-4 mr-2" /> Send Email
                                            </DropdownMenuItem>
                                            {isSuperAdmin && (
                                                <>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuSub>
                                                        <DropdownMenuSubTrigger>
                                                            <Shield className="h-4 w-4 mr-2" /> Change Role
                                                        </DropdownMenuSubTrigger>
                                                        <DropdownMenuSubContent>
                                                            <DropdownMenuItem onClick={() => changeRole(member.uid, 'moderator')}>
                                                                Moderator
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => changeRole(member.uid, 'admin')}>
                                                                Admin
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => changeRole(member.uid, 'super-admin')}>
                                                                Super Admin
                                                            </DropdownMenuItem>
                                                        </DropdownMenuSubContent>
                                                    </DropdownMenuSub>
                                                    <DropdownMenuSeparator />
                                                    {member.isSuspended ? (
                                                        <DropdownMenuItem
                                                            onClick={() => toggleSuspension(member.uid, false)}
                                                            className="text-kenyan-green"
                                                        >
                                                            <CheckCircle2 className="h-4 w-4 mr-2" /> Reinstate
                                                        </DropdownMenuItem>
                                                    ) : (
                                                        <DropdownMenuItem
                                                            onClick={() => toggleSuspension(member.uid, true)}
                                                            className="text-red-500"
                                                        >
                                                            <Ban className="h-4 w-4 mr-2" /> Suspend
                                                        </DropdownMenuItem>
                                                    )}
                                                </>
                                            )}
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>

                            <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-muted-foreground">
                                Joined {format(member.createdAt?.toDate?.() || new Date(), 'MMM yyyy')}
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {filteredStaff.length === 0 && (
                <div className="text-center py-20 text-muted-foreground">
                    <Shield className="h-16 w-16 mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No staff members found</p>
                </div>
            )}
        </div>
    );
}
