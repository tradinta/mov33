'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Plus, Trash2, Power, PowerOff, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Promocode as PromocodeType, UserProfile } from '@/lib/types';

export default function PromocodesPage() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [codes, setCodes] = useState<PromocodeType[]>([]);
    const [influencers, setInfluencers] = useState<UserProfile[]>([]);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [newCode, setNewCode] = useState({
        code: '',
        discountValue: '',
        discountType: 'percentage' as 'percentage' | 'fixed',
        influencerId: '',
        commissionValue: '',
        commissionType: 'percentage' as 'percentage' | 'fixed'
    });

    useEffect(() => {
        const fetchData = async () => {
            if (!profile?.uid) return;
            try {
                // Fetch Promocodes
                const qCodes = query(collection(firestore, 'promocodes'), where('organizerId', '==', profile.uid));
                const snapCodes = await getDocs(qCodes);
                const fetchedCodes = snapCodes.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as PromocodeType));
                setCodes(fetchedCodes);

                // Fetch Influencers
                const qInf = query(collection(firestore, 'users'), where('role', '==', 'influencer'));
                const snapInf = await getDocs(qInf);
                setInfluencers(snapInf.docs.map(doc => ({
                    uid: doc.id,
                    ...doc.data()
                } as UserProfile)));

            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [profile?.uid]);

    const handleCreateCode = async () => {
        if (!newCode.code || !newCode.discountValue || !profile?.uid) return;
        try {
            const codeData = {
                code: newCode.code.toUpperCase(),
                discountValue: Number(newCode.discountValue),
                discountType: newCode.discountType,
                organizerId: profile.uid,
                active: true,
                createdAt: serverTimestamp(),
                usageCount: 0,
                influencerId: newCode.influencerId || null,
                commissionValue: newCode.commissionValue ? Number(newCode.commissionValue) : null,
                commissionType: newCode.influencerId ? newCode.commissionType : null
            };
            const docRef = await addDoc(collection(firestore, 'promocodes'), codeData);
            setCodes([{
                id: docRef.id,
                code: codeData.code,
                discountValue: codeData.discountValue,
                discountType: codeData.discountType as 'percentage' | 'fixed',
                active: true,
                usageCount: 0,
                organizerId: profile.uid,
                createdAt: Timestamp.now(),
                influencerId: codeData.influencerId || undefined,
                commissionValue: codeData.commissionValue || undefined,
                commissionType: codeData.commissionType as any
            }, ...codes]);
            setIsCreateOpen(false);
            setNewCode({
                code: '',
                discountValue: '',
                discountType: 'percentage',
                influencerId: '',
                commissionValue: '',
                commissionType: 'percentage'
            });
        } catch (error) {
            console.error("Error creating promocode:", error);
        }
    };

    const toggleStatus = async (id: string, currentStatus: boolean) => {
        try {
            await updateDoc(doc(firestore, 'promocodes', id), { active: !currentStatus });
            setCodes(codes.map((c: PromocodeType) => c.id === id ? { ...c, active: !currentStatus } : c));
        } catch (error) {
            console.error("Error toggling status:", error);
        }
    };

    const deleteCode = async (id: string) => {
        if (!confirm('Are you sure you want to delete this promocode?')) return;
        try {
            await deleteDoc(doc(firestore, 'promocodes', id));
            setCodes(codes.filter((c: PromocodeType) => c.id !== id));
        } catch (error) {
            console.error("Error deleting promocode:", error);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">Revenue Boosters</h1>
                    <p className="text-muted-foreground font-poppins text-sm">Create and manage viral discount codes for your events.</p>
                </div>

                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-gold hover:bg-gold/90 text-obsidian font-bold rounded-xl h-12 px-6">
                            <Plus className="mr-2 h-5 w-5" /> Generate Code
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-obsidian border-white/10 text-white max-w-md">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase tracking-tight">New Campaign Code</DialogTitle>
                            <DialogDescription className="text-xs">Create a discount code to drive ticket sales.</DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="code" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Promotion Code</Label>
                                    <Input
                                        id="code"
                                        placeholder="E.G. EARLYBIRD20"
                                        className="bg-white/5 border-white/10 h-12 uppercase font-black"
                                        value={newCode.code}
                                        onChange={(e) => setNewCode({ ...newCode, code: e.target.value })}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="grid gap-2">
                                        <Label htmlFor="discount" className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Discount Value</Label>
                                        <Input
                                            id="discount"
                                            type="number"
                                            placeholder="20"
                                            className="bg-white/5 border-white/10 h-12"
                                            value={newCode.discountValue}
                                            onChange={(e) => setNewCode({ ...newCode, discountValue: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Discount Type</Label>
                                        <div className="flex bg-white/5 p-1 rounded-xl h-12 border border-white/10">
                                            <button
                                                type="button"
                                                onClick={() => setNewCode({ ...newCode, discountType: 'percentage' })}
                                                className={`flex-1 rounded-lg text-[10px] font-bold transition-all ${newCode.discountType === 'percentage' ? 'bg-gold text-obsidian' : 'text-muted-foreground'}`}
                                            >
                                                %
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setNewCode({ ...newCode, discountType: 'fixed' })}
                                                className={`flex-1 rounded-lg text-[10px] font-bold transition-all ${newCode.discountType === 'fixed' ? 'bg-gold text-obsidian' : 'text-muted-foreground'}`}
                                            >
                                                KES
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t border-white/5" />
                                </div>
                                <div className="relative flex justify-center text-[10px] uppercase font-black tracking-[0.2em] text-gold/50 bg-obsidian px-3">
                                    Influencer Linkage
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Assign Influencer (Optional)</Label>
                                    <select
                                        className="bg-white/5 border-white/10 h-12 rounded-xl px-4 text-sm focus:outline-none focus:ring-1 focus:ring-gold/50"
                                        value={newCode.influencerId}
                                        onChange={(e) => setNewCode({ ...newCode, influencerId: e.target.value })}
                                    >
                                        <option value="" className="bg-obsidian">None - Public Code</option>
                                        {influencers.map(inf => (
                                            <option key={inf.uid} value={inf.uid} className="bg-obsidian">
                                                {inf.displayName || inf.email}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {newCode.influencerId && (
                                    <div className="grid grid-cols-2 gap-4 animate-in slide-in-from-top-2 duration-300">
                                        <div className="grid gap-2">
                                            <Label htmlFor="commission" className="text-[10px] uppercase font-bold tracking-widest text-gold/70">Influencer Share</Label>
                                            <Input
                                                id="commission"
                                                type="number"
                                                placeholder="10"
                                                className="bg-gold/5 border-gold/20 h-12 text-gold focus:border-gold"
                                                value={newCode.commissionValue}
                                                onChange={(e) => setNewCode({ ...newCode, commissionValue: e.target.value })}
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-[10px] uppercase font-bold tracking-widest text-gold/70">Share Type</Label>
                                            <div className="flex bg-white/5 p-1 rounded-xl h-12 border border-white/10">
                                                <button
                                                    type="button"
                                                    onClick={() => setNewCode({ ...newCode, commissionType: 'percentage' })}
                                                    className={`flex-1 rounded-lg text-[10px] font-bold transition-all ${newCode.commissionType === 'percentage' ? 'bg-gold text-obsidian' : 'text-muted-foreground'}`}
                                                >
                                                    %
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setNewCode({ ...newCode, commissionType: 'fixed' })}
                                                    className={`flex-1 rounded-lg text-[10px] font-bold transition-all ${newCode.commissionType === 'fixed' ? 'bg-gold text-obsidian' : 'text-muted-foreground'}`}
                                                >
                                                    KES
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleCreateCode} className="w-full bg-kenyan-green hover:bg-kenyan-green/90 text-white font-black h-14 rounded-xl shadow-xl shadow-kenyan-green/10 uppercase tracking-widest">
                                Launch Campaign
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Active Campaigns</CardTitle>
                    <CardDescription className="text-xs font-poppins">Performance tracking for your active and past promotional codes.</CardDescription>
                </CardHeader>
                <CardContent className="p-0">
                    {loading ? (
                        <div className="flex items-center justify-center p-12">
                            <Loader2 className="h-8 w-8 animate-spin text-gold/50" />
                        </div>
                    ) : (
                        <Table>
                            <TableHeader className="bg-white/[0.02]">
                                <TableRow className="border-white/5 hover:bg-transparent">
                                    <TableHead className="py-4 text-xs font-bold uppercase tracking-widest">Code</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Incentive</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest text-gold/80">Partner</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Performance</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="text-right text-xs font-bold uppercase tracking-widest">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {codes.map((c) => (
                                    <TableRow key={c.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="py-5">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center text-gold">
                                                    <Ticket className="h-5 w-5" />
                                                </div>
                                                <div className="font-black text-sm uppercase tracking-tighter group-hover:text-gold transition-colors">{c.code}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold text-white/90">
                                                {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `KES ${c.discountValue} OFF`}
                                            </div>
                                            <div className="text-[10px] text-muted-foreground uppercase mt-0.5">Campaign Disc.</div>
                                        </TableCell>
                                        <TableCell>
                                            {c.influencerId ? (
                                                <div className="space-y-1">
                                                    <div className="text-xs font-bold text-gold/90 truncate max-w-[120px]">
                                                        {influencers.find(i => i.uid === c.influencerId)?.displayName || 'Influencer'}
                                                    </div>
                                                    <div className="text-[10px] text-muted-foreground uppercase font-medium">
                                                        {c.commissionValue}{c.commissionType === 'percentage' ? '%' : ' KES'} Share
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="text-[10px] uppercase font-bold text-muted-foreground/50 tracking-widest">
                                                    Global
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-xs font-bold text-kenyan-green">{c.usageCount || 0} Redemptions</div>
                                            <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 mt-0.5">
                                                <Sparkles className="h-2 w-2 text-gold/50" /> High Performance
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[10px] font-bold uppercase ${c.active ? 'bg-kenyan-green/10 text-kenyan-green border-kenyan-green/20' : 'bg-white/5 text-muted-foreground border-white/10'}`}>
                                                {c.active ? 'Active' : 'Paused'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className={`h-9 w-9 p-0 rounded-lg hover:bg-white/5 ${c.active ? 'text-muted-foreground' : 'text-kenyan-green'}`}
                                                    onClick={() => toggleStatus(c.id, c.active)}
                                                >
                                                    {c.active ? <PowerOff className="h-4 w-4" /> : <Power className="h-4 w-4" />}
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    className="h-9 w-9 p-0 rounded-lg text-destructive hover:bg-destructive/10 hover:text-destructive"
                                                    onClick={() => deleteCode(c.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {codes.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-poppins text-sm italic border-none">
                                            No active discount campaigns.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
