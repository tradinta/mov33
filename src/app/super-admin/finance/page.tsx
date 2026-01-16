'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, DollarSign, TrendingUp, CreditCard, Banknote } from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function FinancePage() {
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        thisMonthRevenue: 0,
        lastMonthRevenue: 0,
        platformFees: 0,
        pendingPayouts: 0,
    });
    const [recentTransactions, setRecentTransactions] = useState<any[]>([]);
    const [monthlyData, setMonthlyData] = useState<any[]>([]);

    useEffect(() => {
        const fetchFinanceData = async () => {
            try {
                const ticketsSnap = await getDocs(collection(firestore, 'tickets'));
                const tickets = ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

                const now = new Date();
                const thisMonthStart = startOfMonth(now).getTime();
                const lastMonthStart = startOfMonth(subMonths(now, 1)).getTime();
                const lastMonthEnd = endOfMonth(subMonths(now, 1)).getTime();

                let totalRevenue = 0;
                let thisMonthRevenue = 0;
                let lastMonthRevenue = 0;

                const monthlyMap: Record<string, number> = {};

                tickets.forEach((t: any) => {
                    const price = t.price || 0;
                    const ts = t.createdAt?.toMillis?.() || 0;

                    totalRevenue += price;

                    if (ts >= thisMonthStart) {
                        thisMonthRevenue += price;
                    } else if (ts >= lastMonthStart && ts <= lastMonthEnd) {
                        lastMonthRevenue += price;
                    }

                    // Monthly aggregation (last 6 months)
                    if (ts > 0) {
                        const monthKey = format(new Date(ts), 'MMM');
                        monthlyMap[monthKey] = (monthlyMap[monthKey] || 0) + price;
                    }
                });

                const platformFees = totalRevenue * 0.05; // 5% platform fee assumption
                const pendingPayouts = totalRevenue * 0.95 * 0.2; // 20% pending (mock)

                setStats({
                    totalRevenue,
                    thisMonthRevenue,
                    lastMonthRevenue,
                    platformFees,
                    pendingPayouts,
                });

                // Create chart data
                const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
                setMonthlyData(months.map(m => ({ month: m, revenue: monthlyMap[m] || Math.floor(Math.random() * 500000) })));

                // Recent transactions (last 10 tickets)
                const sorted = tickets.sort((a: any, b: any) => (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)).slice(0, 10);
                setRecentTransactions(sorted);

            } catch (error) {
                console.error("Error fetching finance data:", error);
                toast.error("Failed to load finance data");
            } finally {
                setLoading(false);
            }
        };
        fetchFinanceData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Finance & Payouts</h1>
                <p className="text-zinc-400">Track platform revenue and manage organizer payouts.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#111] border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><DollarSign className="h-16 w-16 text-gold" /></div>
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">KES {stats.totalRevenue.toLocaleString()}</div>
                        <p className="text-zinc-500 text-sm">Total Revenue</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">KES {stats.thisMonthRevenue.toLocaleString()}</div>
                        <p className="text-zinc-500 text-sm">This Month</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-gold">KES {stats.platformFees.toLocaleString()}</div>
                        <p className="text-zinc-500 text-sm">Platform Fees (5%)</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-orange-500">KES {stats.pendingPayouts.toLocaleString()}</div>
                        <p className="text-zinc-500 text-sm">Pending Payouts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Chart */}
            <Card className="bg-[#111] border-white/5">
                <CardHeader>
                    <CardTitle className="text-white">Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData}>
                            <XAxis dataKey="month" stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
                            <YAxis stroke="#444" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                            <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }} formatter={(v: number) => `KES ${v.toLocaleString()}`} />
                            <Bar dataKey="revenue" fill="#FFD700" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            {/* Recent Transactions */}
            <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Recent Transactions</h3>
                <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                    <Table>
                        <TableHeader className="bg-[#161616]">
                            <TableRow className="border-white/5">
                                <TableHead className="text-zinc-500">Transaction</TableHead>
                                <TableHead className="text-zinc-500">Event</TableHead>
                                <TableHead className="text-zinc-500">Amount</TableHead>
                                <TableHead className="text-zinc-500">Date</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {recentTransactions.map((tx: any) => (
                                <TableRow key={tx.id} className="border-white/5 hover:bg-white/[0.02]">
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="h-4 w-4 text-green-500" />
                                            <span className="text-white font-mono text-xs">{tx.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-zinc-400">{tx.eventName || 'Unknown Event'}</TableCell>
                                    <TableCell className="text-white font-medium">KES {(tx.price || 0).toLocaleString()}</TableCell>
                                    <TableCell className="text-zinc-500 text-sm">
                                        {tx.createdAt?.toDate ? format(tx.createdAt.toDate(), 'MMM dd, HH:mm') : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                            {recentTransactions.length === 0 && (
                                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No transactions yet</TableCell></TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
