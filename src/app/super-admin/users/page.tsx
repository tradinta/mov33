'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Ban, CheckCircle2, Shield, UserCog } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { UserProfile, UserRole } from '@/lib/types';
import { toast } from 'sonner';

export default function UsersPage() {
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const snap = await getDocs(collection(firestore, 'users'));
                const usersList = snap.docs.map(d => ({ uid: d.id, ...d.data() } as UserProfile));
                setUsers(usersList);
            } catch (error) {
                console.error("Error fetching users:", error);
                toast.error("Failed to load users");
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const handleUpdate = async (uid: string, updates: Partial<UserProfile>) => {
        try {
            await updateDoc(doc(firestore, 'users', uid), updates);
            setUsers(prev => prev.map(u => u.uid === uid ? { ...u, ...updates } : u));
            toast.success("User updated");
        } catch (e) {
            toast.error("Failed to update user");
        }
    };

    const filteredUsers = users.filter(u =>
        (u.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">User Management</h1>
                <p className="text-zinc-400">View and manage all registered users on the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{users.length}</div>
                        <p className="text-zinc-500 text-sm">Total Users</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-gold">{users.filter(u => u.role === 'organizer').length}</div>
                        <p className="text-zinc-500 text-sm">Organizers</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">{users.filter(u => u.isVerified).length}</div>
                        <p className="text-zinc-500 text-sm">Verified</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-500">{users.filter(u => u.isSuspended).length}</div>
                        <p className="text-zinc-500 text-sm">Suspended</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input
                        placeholder="Search by name or email..."
                        className="pl-9 bg-[#111] border-white/10 text-white h-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {/* Table */}
            <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#161616]">
                        <TableRow className="border-white/5">
                            <TableHead className="text-zinc-500">User</TableHead>
                            <TableHead className="text-zinc-500">Role</TableHead>
                            <TableHead className="text-zinc-500">Status</TableHead>
                            <TableHead className="text-zinc-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.map((user) => (
                            <TableRow key={user.uid} className="border-white/5 hover:bg-white/[0.02]">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-9 w-9 border border-white/10">
                                            <AvatarImage src={user.photoURL} />
                                            <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-white font-medium">{user.displayName || 'Anonymous'}</div>
                                            <div className="text-zinc-500 text-xs">{user.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <select
                                        value={user.role}
                                        onChange={(e) => handleUpdate(user.uid, { role: e.target.value as UserRole })}
                                        className="bg-[#1A1A1A] border border-white/10 rounded-lg px-2 py-1 text-xs font-bold uppercase text-white focus:ring-1 focus:ring-gold"
                                    >
                                        <option value="user">User</option>
                                        <option value="organizer">Organizer</option>
                                        <option value="moderator">Moderator</option>
                                        <option value="admin">Admin</option>
                                        <option value="influencer">Influencer</option>
                                        <option value="super-admin">Super Admin</option>
                                    </select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Badge variant="outline" className={user.isVerified ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400'}>
                                            {user.isVerified ? '✓ Verified' : 'Unverified'}
                                        </Badge>
                                        {user.isSuspended && <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">Suspended</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleUpdate(user.uid, { isVerified: !user.isVerified })}
                                            className={cn("h-8 px-3 text-xs", user.isVerified ? "text-green-400" : "text-zinc-400")}
                                        >
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> {user.isVerified ? 'Unverify' : 'Verify'}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleUpdate(user.uid, { isSuspended: !user.isSuspended })}
                                            className={cn("h-8 px-3 text-xs", user.isSuspended ? "text-red-400" : "text-zinc-400")}
                                        >
                                            <Ban className="h-3 w-3 mr-1" /> {user.isSuspended ? 'Unsuspend' : 'Suspend'}
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredUsers.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No users found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
