'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp, deleteDoc, collection, getDocs, setDoc, addDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    ArrowLeft, Save, Trash2, ExternalLink, RefreshCw, Star,
    Crown, AlertTriangle, Users, Ticket, BarChart3, Mail, Download, Search, CheckCircle2
} from 'lucide-react';
import { generateSlug, ensureUniqueSlug } from '@/lib/slug';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

import { useParams } from 'next/navigation';

interface ManageEventPageProps {
    params: { id: string };
}

// Mock Data for Analytics
const SALES_DATA = [
    { name: 'Day 1', sales: 4000 },
    { name: 'Day 2', sales: 3000 },
    { name: 'Day 3', sales: 5000 },
    { name: 'Day 4', sales: 2780 },
    { name: 'Day 5', sales: 1890 },
    { name: 'Day 6', sales: 2390 },
    { name: 'Today', sales: 3490 },
];
const TICKET_TYPES_DATA = [
    { name: 'Regular', value: 400, color: '#00FA9A' }, // Kenyan Green
    { name: 'VIP', value: 100, color: '#FFD700' }, // Gold
    { name: 'VVIP', value: 50, color: '#8884d8' },
];

export default function ManageEventPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id; // Safe access

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [event, setEvent] = useState<any>(null);
    const [newSlug, setNewSlug] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Sub-data states
    const [attendees, setAttendees] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]); // Ticket Configuration

    const fetchEvent = useCallback(async () => {
        if (!id) return;
        try {
            const docRef = doc(firestore, 'events', id);
            const snap = await getDoc(docRef);
            if (snap.exists()) {
                const data = { id: snap.id, ...snap.data() };
                setEvent(data);
                setNewSlug(data.slug || '');
            } else if (id === 'jwTDVMTYo4J8AWRUw9tw') {
                // Auto-seed this requested ID if missing
                const mockEvent = {
                    title: "Nairobi Tech Week 2026",
                    description: "The biggest tech convergence in East Africa. Join thousands of developers, founders, and investors.",
                    date: Timestamp.fromDate(new Date('2026-06-15T09:00:00')),
                    location: "Sarit Centre",
                    price: 1500,
                    capacity: 2000,
                    ticketsSold: 583,
                    status: 'published',
                    imageUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80",
                    isPremium: true,
                    isFeatured: true,
                    slug: 'nairobi-tech-week-2026',
                    revenue: 425000,
                    views: 12503
                };
                await setDoc(docRef, mockEvent);
                setEvent({ id, ...mockEvent });
                setNewSlug(mockEvent.slug);
                toast.success("Demo Event Created!");
            } else {
                toast.error("Event not found");
                router.push('/admin/events');
            }
        } catch (e) {
            console.error(e);
            toast.error("Error loading event");
        } finally {
            setLoading(false);
        }
    }, [id, router]);

    useEffect(() => {
        fetchEvent();
        // Simulate fetching attendees if real data implementation existed
        // For now, we seed some mock attendees if empty list just for the UI demo
        setAttendees([
            { id: '1', name: 'John Doe', email: 'john@example.com', ticketType: 'VIP', status: 'checked-in', purchaseDate: new Date() },
            { id: '2', name: 'Jane Smith', email: 'jane@test.com', ticketType: 'Regular', status: 'pending', purchaseDate: new Date() },
            { id: '3', name: 'Alice Johnson', email: 'alice@corp.co', ticketType: 'Regular', status: 'pending', purchaseDate: new Date() },
        ]);
    }, [fetchEvent]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(firestore, 'events', params.id);

            let finalSlug = newSlug.trim();
            if (finalSlug && finalSlug !== event.slug) {
                finalSlug = await ensureUniqueSlug(finalSlug, 'events');
            }

            await updateDoc(docRef, {
                ...event,
                slug: finalSlug,
                updatedAt: Timestamp.now(),
                price: Number(event.price),
                capacity: Number(event.capacity),
            });

            setEvent(prev => ({ ...prev, slug: finalSlug }));
            setNewSlug(finalSlug);
            toast.success("Event updated successfully");
        } catch (e) {
            console.error(e);
            toast.error("Failed to save changes");
        } finally {
            setSaving(false);
        }
    };

    const handleSlugGen = () => {
        if (event.title) setNewSlug(generateSlug(event.title));
    };

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

    if (loading) return <div className="h-screen flex items-center justify-center bg-obsidian text-gold"><Loader2 className="animate-spin h-10 w-10" /></div>;

    return (
        <div className="min-h-screen pb-20 space-y-8">

            {/* Top Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" onClick={() => router.push('/admin/events')}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">{event.title}</h1>
                        <div className="flex items-center gap-3 text-muted-foreground mt-1">
                            <span className="font-mono text-xs">{event.id}</span>
                            <Badge variant={event.status === 'published' ? 'default' : 'secondary'} className={event.status === 'published' ? 'bg-kenyan-green' : ''}>
                                {event.status?.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" onClick={() => window.open(`/events/${event.slug || event.id}`, '_blank')}>
                        <ExternalLink className="h-4 w-4 mr-2" /> View Live
                    </Button>
                    <Button onClick={handleSave} disabled={saving} className="bg-gold text-obsidian font-bold">
                        {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="bg-muted p-1">
                    <TabsTrigger value="overview" className="gap-2"><BarChart3 className="h-4 w-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="details" className="gap-2"><Save className="h-4 w-4" /> Edit Details</TabsTrigger>
                    <TabsTrigger value="attendees" className="gap-2"><Users className="h-4 w-4" /> Attendees</TabsTrigger>
                    <TabsTrigger value="tickets" className="gap-2"><Ticket className="h-4 w-4" /> Tickets</TabsTrigger>
                </TabsList>

                {/* OVERVIEW / ANALYTICS TAB */}
                <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black text-kenyan-green">KES 425,000</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tickets Sold</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black">583 <span className="text-sm font-normal text-muted-foreground">/ {event.capacity || 1000}</span></div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Check-ins</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black">102 <span className="text-sm font-normal text-muted-foreground text-gold">(18%)</span></div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black">{event.views || 0}</div></CardContent>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                        {/* Main Chart */}
                        <Card className="col-span-4">
                            <CardHeader>
                                <CardTitle>Sales Velocity</CardTitle>
                                <CardDescription>Ticket sales over the last 7 days.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={SALES_DATA}>
                                        <defs>
                                            <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#FFD700" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#FFD700" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                                        <XAxis dataKey="name" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                                        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `K${value}`} />
                                        <Tooltip contentStyle={{ backgroundColor: '#111', borderColor: '#333' }} />
                                        <Area type="monotone" dataKey="sales" stroke="#FFD700" fillOpacity={1} fill="url(#colorSales)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Donut Chart */}
                        <Card className="col-span-3">
                            <CardHeader>
                                <CardTitle>Ticket Distribution</CardTitle>
                                <CardDescription>Sales by Ticket Type.</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[300px] flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={TICKET_TYPES_DATA}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {TICKET_TYPES_DATA.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* EDIT DETAILS TAB (Previous Form) */}
                <TabsContent value="details" className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="md:col-span-2 space-y-8">
                            <Card>
                                <CardHeader><CardTitle>Core Information</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Event Title</Label>
                                        <Input value={event.title} onChange={e => setEvent({ ...event, title: e.target.value })} className="font-bold text-lg" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="flex justify-between"><span>Slug (URL)</span><span className="text-xs text-muted-foreground">/events/{newSlug}</span></Label>
                                        <div className="flex gap-2">
                                            <Input value={newSlug} onChange={e => setNewSlug(e.target.value)} className="font-mono bg-muted" />
                                            <Button variant="outline" size="icon" onClick={handleSlugGen} title="Generate from Title"><RefreshCw className="h-4 w-4" /></Button>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Date</Label>
                                            <Input type="datetime-local" value={event.date?.toDate().toISOString().slice(0, 16)} onChange={e => setEvent({ ...event, date: Timestamp.fromDate(new Date(e.target.value)) })} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Venue</Label>
                                            <Input value={event.location} onChange={e => setEvent({ ...event, location: e.target.value })} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Description</Label>
                                        <Textarea rows={6} value={event.description} onChange={e => setEvent({ ...event, description: e.target.value })} />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader><CardTitle>Media</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Cover Image</Label>
                                        <div className="flex gap-4">
                                            <Input value={event.imageUrl} onChange={e => setEvent({ ...event, imageUrl: e.target.value })} />
                                            {event.imageUrl && <div className="h-10 w-16 rounded overflow-hidden"><img src={event.imageUrl} className="h-full w-full object-cover" /></div>}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <Card>
                                <CardHeader><CardTitle>Visibility</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <Label>Published</Label>
                                        <Switch checked={event.status === 'published'} onCheckedChange={(c) => setEvent({ ...event, status: c ? 'published' : 'draft' })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Premium</Label>
                                        <Switch checked={event.isPremium} onCheckedChange={(c) => setEvent({ ...event, isPremium: c })} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <Label>Featured</Label>
                                        <Switch checked={event.isFeatured} onCheckedChange={(c) => setEvent({ ...event, isFeatured: c })} />
                                    </div>
                                </CardContent>
                            </Card>
                            <Button variant="destructive" className="w-full" onClick={() => { if (confirm('Delete?')) deleteDoc(doc(firestore, 'events', params.id)).then(() => router.push('/admin/events')); }}>
                                <Trash2 className="mr-2 h-4 w-4" /> Delete Event
                            </Button>
                        </div>
                    </div>
                </TabsContent>

                {/* ATTENDEES TAB */}
                <TabsContent value="attendees" className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Guest List</CardTitle>
                                <CardDescription>Manage your attendees and check-ins.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative w-64">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Search guests..." className="pl-8" />
                                </div>
                                <Button variant="outline"><Download className="mr-2 h-4 w-4" /> Export CSV</Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Guest</TableHead>
                                        <TableHead>Ticket Type</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {attendees.map((attendee) => (
                                        <TableRow key={attendee.id}>
                                            <TableCell>
                                                <div className="font-bold">{attendee.name}</div>
                                                <div className="text-xs text-muted-foreground">{attendee.email}</div>
                                            </TableCell>
                                            <TableCell><Badge variant="outline" className="border-gold/30 text-gold">{attendee.ticketType}</Badge></TableCell>
                                            <TableCell>
                                                {attendee.status === 'checked-in' ? (
                                                    <Badge className="bg-kenyan-green hover:bg-kenyan-green">Checked In</Badge>
                                                ) : (
                                                    <Badge variant="secondary">Pending</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button size="sm" variant="ghost">Details</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* TICKETS TAB */}
                <TabsContent value="tickets" className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Ticket Tiers</h2>
                        <Button><Ticket className="mr-2 h-4 w-4" /> Create Ticket Type</Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {['Early Bird', 'Regular', 'VIP'].map((tier) => (
                            <Card key={tier}>
                                <CardHeader className="flex flex-row items-center justify-between pb-2">
                                    <CardTitle className="text-lg">{tier}</CardTitle>
                                    <Badge variant="outline">On Sale</Badge>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">KES 1,500</div>
                                    <p className="text-muted-foreground text-sm">50/200 Sold</p>
                                </CardContent>
                                <CardFooter>
                                    <Button variant="ghost" size="sm" className="w-full">Edit Configuration</Button>
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
