'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Loader2, Star, ExternalLink, MapPin, Clock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';

interface Tour {
    id: string;
    title: string;
    duration: string;
    location: string;
    status: string;
    isFeatured: boolean;
    imageUrl: string;
    price: number;
    views?: number;
}

export default function ToursPage() {
    const [loading, setLoading] = useState(true);
    const [tours, setTours] = useState<Tour[]>([]);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchTours = async () => {
            try {
                const snap = await getDocs(collection(firestore, 'tours'));
                const toursList = snap.docs.map(d => ({ id: d.id, ...d.data() } as Tour));
                setTours(toursList);
            } catch (error) {
                console.error("Error fetching tours:", error);
                toast.error("Failed to load tours");
            } finally {
                setLoading(false);
            }
        };
        fetchTours();
    }, []);

    const handleToggleFeatured = async (id: string, current: boolean) => {
        try {
            await updateDoc(doc(firestore, 'tours', id), { isFeatured: !current });
            setTours(prev => prev.map(t => t.id === id ? { ...t, isFeatured: !current } : t));
            toast.success(current ? "Removed from featured" : "Added to featured");
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const handleToggleStatus = async (id: string, current: string) => {
        const newStatus = current === 'published' ? 'draft' : 'published';
        try {
            await updateDoc(doc(firestore, 'tours', id), { status: newStatus });
            setTours(prev => prev.map(t => t.id === id ? { ...t, status: newStatus } : t));
            toast.success(`Tour ${newStatus}`);
        } catch (e) {
            toast.error("Failed to update");
        }
    };

    const filteredTours = tours.filter(t => (t.title || '').toLowerCase().includes(searchTerm.toLowerCase()));

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Tours & Travel</h1>
                <p className="text-zinc-400">Manage all tours and travel packages.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{tours.length}</div>
                        <p className="text-zinc-500 text-sm">Total Tours</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">{tours.filter(t => t.status === 'published').length}</div>
                        <p className="text-zinc-500 text-sm">Published</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-gold">{tours.filter(t => t.isFeatured).length}</div>
                        <p className="text-zinc-500 text-sm">Featured</p>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
                <Input placeholder="Search tours..." className="pl-9 bg-[#111] border-white/10 text-white h-10" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
            </div>

            {/* Table */}
            <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                <Table>
                    <TableHeader className="bg-[#161616]">
                        <TableRow className="border-white/5">
                            <TableHead className="text-zinc-500">Tour</TableHead>
                            <TableHead className="text-zinc-500">Duration</TableHead>
                            <TableHead className="text-zinc-500">Price</TableHead>
                            <TableHead className="text-zinc-500">Status</TableHead>
                            <TableHead className="text-zinc-500">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTours.map((tour) => (
                            <TableRow key={tour.id} className="border-white/5 hover:bg-white/[0.02]">
                                <TableCell>
                                    <div className="flex items-center gap-3">
                                        <div className="h-12 w-16 rounded-lg overflow-hidden bg-zinc-800 relative">
                                            {tour.imageUrl && <Image src={tour.imageUrl} alt={tour.title} fill className="object-cover" />}
                                        </div>
                                        <div>
                                            <div className="text-white font-medium flex items-center gap-2">
                                                {tour.title}
                                                {tour.isFeatured && <Star className="h-3 w-3 text-gold fill-gold" />}
                                            </div>
                                            <div className="text-zinc-500 text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> {tour.location}</div>
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-zinc-400 text-sm">
                                    <div className="flex items-center gap-1"><Clock className="h-3 w-3" /> {tour.duration}</div>
                                </TableCell>
                                <TableCell className="text-white font-medium">KES {(tour.price || 0).toLocaleString()}</TableCell>
                                <TableCell>
                                    <Badge variant="outline" className={tour.status === 'published' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400'}>
                                        {tour.status}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="ghost" onClick={() => handleToggleFeatured(tour.id, tour.isFeatured)} className={cn("h-8 px-2", tour.isFeatured ? "text-gold" : "text-zinc-400")}>
                                            <Star className="h-4 w-4" />
                                        </Button>
                                        <Button size="sm" variant="ghost" onClick={() => handleToggleStatus(tour.id, tour.status)} className="h-8 px-2 text-zinc-400">
                                            {tour.status === 'published' ? 'Unpublish' : 'Publish'}
                                        </Button>
                                        <Link href={`/tours/${tour.id}`}>
                                            <Button size="sm" variant="ghost" className="h-8 px-2 text-zinc-400"><ExternalLink className="h-4 w-4" /></Button>
                                        </Link>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {filteredTours.length === 0 && (
                            <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">No tours found</TableCell></TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
