'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, XCircle, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useAuth } from '@/context/auth-context';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Badge } from '@/components/ui/badge';
import { TicketAttendee as Ticket } from '@/lib/types';

export default function AttendancePage() {
    const { profile } = useAuth();
    const [loading, setLoading] = useState(true);
    const [attendees, setAttendees] = useState<Ticket[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!profile?.uid) return;

        const ticketsRef = collection(firestore, 'tickets');
        const q = query(ticketsRef, where('organizerId', '==', profile.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const ticketList = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            } as Ticket));
            setAttendees(ticketList);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching attendance:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [profile?.uid]);

    const filteredAttendees = attendees.filter((a: Ticket) =>
        a.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.ticketId?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const checkedInCount = attendees.filter(a => a.checkedIn).length;

    return (
        <div className="space-y-6 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">Attendance Control</h1>
                    <p className="text-muted-foreground font-poppins text-sm">Monitor real-time check-ins and guest list status.</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl">
                        <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest">Live Attendance</div>
                        <div className="text-xl font-black text-gold">{checkedInCount} / {attendees.length}</div>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Expected</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black">{attendees.length}</div>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Confirmed Bookings</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Checked In</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-kenyan-green">{checkedInCount}</div>
                        <p className="text-[10px] text-kenyan-green uppercase mt-1">Verified Entries</p>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Remaining</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-gold">{attendees.length - checkedInCount}</div>
                        <p className="text-[10px] text-muted-foreground uppercase mt-1">Yet to arrive</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
                <CardHeader className="border-b border-white/5">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div>
                            <CardTitle className="text-lg font-black uppercase tracking-tight">Guest List</CardTitle>
                            <CardDescription className="text-xs font-poppins">Search and verify attendee status manually.</CardDescription>
                        </div>
                        <div className="relative w-full md:w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search by name or ticket ID..."
                                className="pl-10 bg-white/5 border-white/10 rounded-xl font-poppins text-xs h-10"
                                value={searchTerm}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
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
                                    <TableHead className="py-4 text-xs font-bold uppercase tracking-widest">Attendee</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Ticket ID</TableHead>
                                    <TableHead className="text-xs font-bold uppercase tracking-widest">Tier</TableHead>
                                    <TableHead className="text-right text-xs font-bold uppercase tracking-widest">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredAttendees.map((attendee) => (
                                    <TableRow key={attendee.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                                        <TableCell className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-lg bg-gold/10 flex items-center justify-center text-gold font-bold text-xs">
                                                    {attendee.userName?.slice(0, 1) || 'U'}
                                                </div>
                                                <div className="font-bold text-sm text-white/90">{attendee.userName || 'Guest User'}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-[10px] bg-white/5 px-2 py-1 rounded border border-white/5 text-muted-foreground uppercase">
                                                {attendee.ticketId || attendee.id.slice(0, 8)}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="text-[8px] uppercase font-black border-gold/30 text-gold">
                                                {attendee.ticketType || 'Standard'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            {attendee.checkedIn ? (
                                                <div className="flex items-center justify-end gap-2 text-kenyan-green">
                                                    <span className="text-[10px] font-bold uppercase">Verified</span>
                                                    <CheckCircle2 className="h-4 w-4" />
                                                </div>
                                            ) : (
                                                <div className="flex items-center justify-end gap-2 text-muted-foreground">
                                                    <span className="text-[10px] font-bold uppercase">Pending</span>
                                                    <XCircle className="h-4 w-4" />
                                                </div>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {filteredAttendees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-poppins text-sm italic border-none">
                                            {searchTerm ? 'No attendees match your search.' : 'No attendance data yet.'}
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
