'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/auth-context';
import { firestore } from '@/firebase';
import { collection, query, getDocs, orderBy, where, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { Loader2, Plus, Search, Filter, MoreVertical, Eye, Edit, Trash2, ShieldCheck, Ticket, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from '@/components/theme-toggle';

interface AdminEvent {
    id: string;
    title: string;
    date: Timestamp;
    status: 'draft' | 'published' | 'cancelled';
    ticketsSold: number;
    revenue?: number;
    organizerName?: string;
    slug?: string;
    isPremium?: boolean;
    isFeatured?: boolean;
}

export default function AdminEventsPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [events, setEvents] = useState<AdminEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'cancelled'>('all');

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const q = query(collection(firestore, 'events'), orderBy('createdAt', 'desc'));
                const snapshot = await getDocs(q);
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as AdminEvent[];
                setEvents(data);
            } catch (error) {
                console.error("Error fetching admin events:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    const filteredEvents = events.filter(ev => {
        const searchLower = searchTerm.toLowerCase();
        const titleMatch = (ev.title || '').toLowerCase().includes(searchLower);
        const orgMatch = (ev.organizerName || '').toLowerCase().includes(searchLower);
        const idMatch = (ev.id || '').toLowerCase().includes(searchLower);

        const matchesSearch = titleMatch || orgMatch || idMatch;
        const matchesStatus = statusFilter === 'all' || ev.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-8">
            <div className="max-w-7xl mx-auto space-y-8">

                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Events Management</h1>
                        <p className="text-muted-foreground mt-2">Manage, moderate, and amplify all platform events.</p>
                    </div>
                    <div className="flex items-center gap-4">
                        {/* Add Event Button? Maybe redirect to organizer flow or specialized admin create */}
                        <Button className="bg-gold text-obsidian hover:bg-gold/90 font-bold" onClick={() => router.push('/organizer/events/new')}>
                            <Plus className="h-4 w-4 mr-2" /> Create Event
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4 bg-card p-4 rounded-2xl border border-border">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search events by title, ID, or organizer..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-background border-border"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant={statusFilter === 'all' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('all')}
                        >
                            All
                        </Button>
                        <Button
                            variant={statusFilter === 'published' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('published')}
                            className={statusFilter === 'published' ? 'bg-kenyan-green hover:bg-kenyan-green/90' : ''}
                        >
                            Published
                        </Button>
                        <Button
                            variant={statusFilter === 'draft' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('draft')}
                        >
                            Drafts
                        </Button>
                        <Button
                            variant={statusFilter === 'cancelled' ? 'default' : 'outline'}
                            onClick={() => setStatusFilter('cancelled')}
                            className={statusFilter === 'cancelled' ? 'bg-red-500 hover:bg-red-600' : ''}
                        >
                            Cancelled
                        </Button>
                    </div>
                </div>

                {/* Events Table/List */}
                <div className="grid gap-4">
                    {filteredEvents.map(event => (
                        <div key={event.id} className="group flex items-center justify-between p-6 bg-card border border-border rounded-2xl hover:border-gold/50 transition-all">
                            <div className="flex items-center gap-6">
                                <div className="h-16 w-16 rounded-xl bg-muted overflow-hidden">
                                    {/* Placeholder or Image */}
                                    <div className="w-full h-full bg-accent flex items-center justify-center text-xs text-muted-foreground font-bold">
                                        IMG
                                    </div>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-xl font-bold truncate max-w-md">{event.title}</h3>
                                        {event.isPremium && <Badge className="bg-gold text-obsidian">Premium</Badge>}
                                        {event.isFeatured && <Badge className="bg-purple-500">Featured</Badge>}
                                    </div>
                                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                        <span>{format(event.date.toDate(), 'PPP')}</span>
                                        <span>•</span>
                                        <span>{event.organizerName || 'Unknown Organizer'}</span>
                                        <span>•</span>
                                        <Badge variant="outline" className={`
                                    ${event.status === 'published' ? 'border-kenyan-green text-kenyan-green' :
                                                event.status === 'cancelled' ? 'border-red-500 text-red-500' : 'border-yellow-500 text-yellow-500'}
                                `}>
                                            {event.status.toUpperCase()}
                                        </Badge>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-right">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Sales</p>
                                    <p className="text-lg font-black">{event.ticketsSold || 0}</p>
                                </div>
                                <div className="text-right hidden md:block">
                                    <p className="text-xs uppercase tracking-widest text-muted-foreground font-bold">Revenue</p>
                                    <p className="text-lg font-black">KES {(event.revenue || 0).toLocaleString()}</p>
                                </div>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-10 px-4 font-bold border-gold/20 hover:bg-gold/10 hover:text-gold"
                                        onClick={() => router.push(`/admin/events/manage/${event.id}`)}
                                    >
                                        Manage
                                    </Button>
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-10 w-10">
                                                <MoreVertical className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                            <DropdownMenuItem onClick={() => window.open(`/events/${event.slug || event.id}`, '_blank')}>
                                                <Eye className="h-4 w-4 mr-2" /> View Live
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => router.push(`/organizer/events/${event.id}`)}>
                                                <Edit className="h-4 w-4 mr-2" /> Edit Details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem className="text-red-500">
                                                <Trash2 className="h-4 w-4 mr-2" /> Delete Event
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>
                            </div>
                        </div>
                    ))}

                    {filteredEvents.length === 0 && (
                        <div className="text-center py-20 text-muted-foreground">
                            <p>No events found matching your criteria.</p>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
