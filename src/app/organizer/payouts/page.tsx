'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Wallet, History, ArrowUpRight, TrendingUp, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, orderBy, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Payout } from '@/lib/types';

export default function PayoutsPage() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [payouts, setPayouts] = useState<Payout[]>([]);
    const [balance, setBalance] = useState({ available: 0, pending: 0, totalPaid: 0 });

    useEffect(() => {
        const fetchPayoutData = async () => {
            if (!profile?.uid) return;
            try {
                // 1. Fetch Payout History
                const q = query(
                    collection(firestore, 'payouts'),
                    where('organizerId', '==', profile.uid),
                    orderBy('createdAt', 'desc')
                );
                const snap = await getDocs(q);
                const payoutList = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Payout));
                setPayouts(payoutList);

                // 2. Fetch Balance
                setBalance({
                    available: profile.availableBalance || 0,
                    pending: profile.pendingBalance || 0,
                    totalPaid: profile.totalPayouts || 0
                });

            } catch (error) {
                console.error("Error fetching payout data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchPayoutData();
    }, [profile?.uid, profile?.availableBalance, profile?.pendingBalance, profile?.totalPayouts]);

    const handleRequestPayout = async () => {
        if (!profile?.uid) return;
        if (balance.available < 1000) {
            alert('Minimum payout amount is KES 1,000');
            return;
        }

        try {
            setLoading(true);
            await addDoc(collection(firestore, 'payouts'), {
                organizerId: profile.uid,
                amount: balance.available,
                status: 'pending',
                method: 'M-Pesa',
                recipient: profile.phoneNumber || 'N/A',
                createdAt: serverTimestamp()
            });
            alert('Payout request submitted successfully via M-Pesa!');
            window.location.reload();
        } catch (error) {
            console.error("Error requesting payout:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">Trust & Treasury</h1>
                    <p className="text-muted-foreground font-poppins text-sm">Manage your earnings and schedule secure M-Pesa withdrawals.</p>
                </div>
                <Button
                    onClick={handleRequestPayout}
                    disabled={loading || balance.available < 1000}
                    className="bg-kenyan-green hover:bg-kenyan-green/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg border-b-4 border-kenyan-green/50 active:border-b-0 transition-all border-none"
                >
                    <Wallet className="mr-2 h-5 w-5" /> Request Withdrawal
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-gold/30 transition-colors">
                    <div className="absolute -top-4 -right-4 h-16 w-16 bg-gold/5 rounded-full blur-2xl group-hover:bg-gold/10 transition-colors" />
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            Available Balance <ArrowUpRight className="h-3 w-3 text-gold" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">KES {balance.available.toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <span className="text-[8px] bg-gold/10 text-gold px-2 py-0.5 rounded-full font-black">WITHDRAWABLE</span>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden group hover:border-kenyan-green/30 transition-colors">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            Pending Clearing <History className="h-3 w-3 text-muted-foreground" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white/50">KES {balance.pending.toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-2 font-poppins text-[10px] text-muted-foreground italic">
                            Clears in 48 hours
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-white/5 border-white/10 backdrop-blur-md relative overflow-hidden">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
                            Lifetime Earnings <TrendingUp className="h-3 w-3 text-kenyan-green" />
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-kenyan-green">KES {balance.totalPaid.toLocaleString()}</div>
                        <div className="flex items-center gap-2 mt-2">
                            <CheckCircle2 className="h-3 w-3 text-kenyan-green" />
                            <span className="text-[8px] text-muted-foreground uppercase font-bold">Total Payouts Completed</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-white/5 pb-6">
                    <CardTitle className="text-lg font-black uppercase tracking-tight">Withdrawal History</CardTitle>
                    <CardDescription className="text-xs font-poppins">Comprehensive log of all financial settlements to your account.</CardDescription>
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
                                    <TableHead className="py-4 text-xs font-bold uppercase tracking-widest">Transaction ID</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Amount</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Destination</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Status</TableHead>
                                    <TableHead className="text-right text-xs font-bold uppercase tracking-widest pr-6">Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {payouts.map((p) => (
                                    <TableRow key={p.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="py-4">
                                            <code className="text-[10px] font-bold bg-white/5 px-2 py-1 rounded border border-white/10 text-muted-foreground uppercase">
                                                PAY-{p.id.slice(0, 6)}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <div className="text-sm font-black text-white/90">KES {p.amount?.toLocaleString()}</div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <div className="h-6 w-6 rounded bg-kenyan-green/10 flex items-center justify-center text-kenyan-green text-[8px] font-black">M</div>
                                                <span className="text-[10px] font-bold text-muted-foreground">{p.recipient}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={`text-[10px] font-black uppercase ${p.status === 'completed' ? 'bg-kenyan-green/10 text-kenyan-green' :
                                                p.status === 'pending' ? 'bg-gold/10 text-gold' : 'bg-destructive/10 text-destructive'
                                                }`}>
                                                {p.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right text-xs text-muted-foreground pr-6">
                                            {p.createdAt ? p.createdAt.toDate().toLocaleDateString() : 'Recently'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {payouts.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground font-poppins text-sm italic border-none">
                                            Transaction archive is currently empty.
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
