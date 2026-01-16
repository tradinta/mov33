'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, CheckCircle2, XCircle, ExternalLink, Building } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import Link from 'next/link';

interface Organizer {
    uid: string;
    displayName: string;
    email: string;
    photoURL?: string;
    isVerified?: boolean;
    isSuspended?: boolean;
    organizerProfile?: {
        companyName?: string;
        phone?: string;
        eventsCount?: number;
    };
}

export default function OrganizersPage() {
    const [loading, setLoading] = useState(true);
    const [organizers, setOrganizers] = useState<Organizer[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchOrganizers = async () => {
            try {
                const q = query(collection(firestore, 'users'), where('role', '==', 'organizer'));
                const snap = await getDocs(q);
                const list = snap.docs.map(d => ({ uid: d.id, ...d.data() } as Organizer));
                setOrganizers(list);
            } catch (error) {
                console.error("Error fetching organizers:", error);
                toast.error("Failed to load organizers");
            } finally {
                setLoading(false);
            }
        };
        fetchOrganizers();
    }, []);

    const handleVerify = async (uid: string, current: boolean) => {
        try {
            await updateDoc(doc(firestore, 'users', uid), { isVerified: !current });
            setOrganizers(prev => prev.map(o => o.uid === uid ? { ...o, isVerified: !current } : o));
            toast.success(current ? "Verification removed" : "Organizer verified");
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const handleSuspend = async (uid: string, current: boolean) => {
        try {
            await updateDoc(doc(firestore, 'users', uid), { isSuspended: !current });
            setOrganizers(prev => prev.map(o => o.uid === uid ? { ...o, isSuspended: !current } : o));
            toast.success(current ? "Organizer reinstated" : "Organizer suspended");
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const filteredOrganizers = organizers.filter(o =>
        (o.displayName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (o.organizerProfile?.companyName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Organizers</h1>
                <p className="text-zinc-400">Manage event organizers and approve new applications.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{organizers.length}</div>
                        <p className="text-zinc-500 text-sm">Total Organizers</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">{organizers.filter(o => o.isVerified).length}</div>
                        <p className="text-zinc-500 text-sm">Verified</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-yellow-500">{organizers.filter(o => !o.isVerified && !o.isSuspended).length}</div>
                        <p className="text-zinc-500 text-sm">Pending Review</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-500">{organizers.filter(o => o.isSuspended).length}</div>
                        <p className="text-zinc-500 text-sm">Suspended</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input placeholder="Search organizers..." className="pl-9 bg-[#111] border-white/10 text-white h-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Table */}
            <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#161616]">
                        <TableRow className="border-white/5">
                            <TableHead className="text-zinc-500">Organizer</TableHead>
                            <TableHead className="text-zinc-500">Company</TableHead>
                            <TableHead className="text-zinc-500">Status</TableHead>
                            <TableHead className="text-zinc-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredOrganizers.map((org) => (
                            <TableRow key={org.uid} className="border-white/5 hover:bg-white/[0.02]">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-white/10">
                                            <AvatarImage src={org.photoURL} />
                                            <AvatarFallback>{org.displayName?.[0] || 'O'}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <div className="text-white font-medium">{org.displayName || 'Unknown'}</div>
                                            <div className="text-zinc-500 text-xs">{org.email}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2 text-zinc-400">
                                        <Building className="h-4 w-4" />
                                        {org.organizerProfile?.companyName || 'Not Set'}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        {org.isVerified ? (
                                            <Badge className="bg-green-500/10 text-green-400 border-green-500/20">✓ Verified</Badge>
                                        ) : (
                                            <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Pending</Badge>
                                        )}
                                        {org.isSuspended && <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">Suspended</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleVerify(org.uid, org.isVerified || false)} className={cn("h-8 px-3 text-xs", org.isVerified ? "text-green-400" : "text-zinc-400")}>
                                            <CheckCircle2 className="h-3 w-3 mr-1" /> {org.isVerified ? 'Unverify' : 'Verify'}
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleSuspend(org.uid, org.isSuspended || false)} className={cn("h-8 px-3 text-xs", org.isSuspended ? "text-red-400" : "text-zinc-400")}>
                                            <XCircle className="h-3 w-3 mr-1" /> {org.isSuspended ? 'Reinstate' : 'Suspend'}
                                        </Button>
                                        <Link href={`/organizers/${org.uid}`}>
                                            <Button size="sm" variant="ghost" className="h-8 px-2 text-zinc-400"><ExternalLink className="h-4 w-4" /></Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredOrganizers.length === 0 && (
                            <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No organizers found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
