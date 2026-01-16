'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Star, Eye, ExternalLink, Calendar, MapPin } from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import { format } from 'date-fns';
import Link from 'next/link';
import Image from 'next/image';

interface AdminEvent {
    id: string;
    title: string;
    date: any;
    location: string;
    status: string;
    isFeatured: boolean;
    imageUrl: string;
    price: number;
    views?: number;
    ticketsSold?: number;
}

export default function EventsGlobalPage() {
    const [loading, setLoading] = useState(true);
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const snap = await getDocs(collection(firestore, 'events'));
                const eventsList = snap.docs.map(d => ({ id: d.id, ...d.data() } as AdminEvent));
                setEvents(eventsList);
            } catch (error) {
                console.error("Error fetching events:", error);
                toast.error("Failed to load events");
            } finally {
                setLoading(false);
            }
        };
        fetchEvents();
    }, []);

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(firestore, 'events', id), { isFeatured: !current });
            setEvents(prev => prev.map(e => e.id === id ? { ...e, isFeatured: !current } : e));
            toast.success(current ? "Removed from featured" : "Added to featured");
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const handleToggleStatus = async (id: string, current: string) => {
        const newStatus = current === 'published' ? 'draft' : 'published';
        try {
            await updateDoc(doc(firestore, 'events', id), { status: newStatus });
            setEvents(prev => prev.map(e => e.id === id ? { ...e, status: newStatus } : e));
            toast.success(`Event ${newStatus}`);
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const filteredEvents = events.filter(ev => {
        const matchesSearch = (ev.title || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Events Global</h1>
                <p className="text-zinc-400">Manage all events across the platform.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{events.length}</div>
                        <p className="text-zinc-500 text-sm">Total Events</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">{events.filter(e => e.status === 'published').length}</div>
                        <p className="text-zinc-500 text-sm">Published</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-gold">{events.filter(e => e.isFeatured).length}</div>
                        <p className="text-zinc-500 text-sm">Featured</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-zinc-400">{events.filter(e => e.status === 'draft').length}</div>
                        <p className="text-zinc-500 text-sm">Drafts</p>
                    </CardContent>
                </Card>
            </div>

            {/* Filters */}
            <div className="flex gap-4 flex-wrap">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                    <Input placeholder="Search events..." className="pl-9 bg-[#111] border-white/10 text-white h-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                </div>
                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-[#111] border border-white/10 rounded-lg px-4 py-2 text-white text-sm">
                    <option value="all">All Status</option>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                </select>
            </div>

            {/* Table */}
            <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#161616]">
                        <TableRow className="border-white/5">
                            <TableHead className="text-zinc-500">Event</TableHead>
                            <TableHead className="text-zinc-500">Date</TableHead>
                            <TableHead className="text-zinc-500">Status</TableHead>
                            <TableHead className="text-zinc-500">Views</TableHead>
                            <TableHead className="text-zinc-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEvents.map((event) => (
                            <TableRow key={event.id} className="border-white/5 hover:bg-white/[0.02]">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-16 rounded-lg overflow-hidden bg-zinc-800 relative">
                                            {event.imageUrl && <Image src={event.imageUrl} alt={event.title} fill className="object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium flex items-center gap-2">
                                                {event.title}
                                                {event.isFeatured && <Star className="h-3 w-3 text-gold fill-gold" />}
                                            </div>
                                            <div className="text-zinc-500 text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> {event.location}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-zinc-400 text-sm">
                                    {event.date?.toDate ? format(event.date.toDate(), 'MMM dd, yyyy') : 'N/A'}
                                </TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={event.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400'}>
                                        {event.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="text-zinc-400">{event.views || 0}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleToggleFeatured(event.id, event.isFeatured)} className={cn("h-8 px-2", event.isFeatured ? "text-gold" : "text-zinc-400")}>
                                            <Star className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(event.id, event.status)} className="h-8 px-2 text-zinc-400">
                                            {event.status === 'published' ? 'Unpublish' : 'Publish'}
                                        </Button>
                                        <Link href={`/admin/events/manage/${event.id}`}>
                                            <Button size="sm" variant="ghost" className="h-8 px-2 text-zinc-400"><ExternalLink className="h-4 w-4" /></Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredEvents.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">No events found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
