'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useAuth } from '@/context/auth-context';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
    ArrowLeft, Save, Trash2, ExternalLink, RefreshCw,
    Users, Ticket, BarChart3, Download, Search, Plus, X
} from 'lucide-react';
import { generateSlug, ensureUniqueSlug } from '@/lib/slug';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'; // Kept for Attendees tab structure

export default function ManageEventPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const id = params?.id;
    const { user, profile } = useAuth();

    // Auth State
    const [isAuthorized, setIsAuthorized] = useState(false);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [event, setEvent] = useState<any>(null);
    const [newSlug, setNewSlug] = useState('');
    const [activeTab, setActiveTab] = useState('overview');

    // Sub-data states
    const [attendees, setAttendees] = useState<any[]>([]);
    const [tickets, setTickets] = useState<any[]>([]); // Ticket Configuration

    const fetchEvent = useCallback(async () => {
        if (!id || !user) return;
        try {
            const docRef = doc(firestore, 'events', id);
            const snap = await getDoc(docRef);

            if (snap.exists()) {
                const data = { id: snap.id, ...snap.data() };

                // Permission Check
                const isOwner = data.organizerId === user.uid;
                const isSuperAdmin = profile?.role === 'super-admin';

                if (!isOwner && !isSuperAdmin) {
                    toast.error("Unauthorized access");
                    router.push('/admin/events');
                    return;
                }
                setIsAuthorized(true);

                setEvent(data);
                setNewSlug(data.slug || '');
                setTickets(data.ticketTiers || []);
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
    }, [id, user, profile, router]);

    useEffect(() => {
        if (user) fetchEvent();
    }, [user, fetchEvent]);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(firestore, 'events', params.id);
            const isSuperAdmin = profile?.role === 'super-admin';

            let finalSlug = newSlug.trim();

            // Auto-generate if empty
            if (!finalSlug && event.title) {
                finalSlug = generateSlug(event.title);
            }

            // Ensure uniqueness if it changed or was just generated
            if (finalSlug && finalSlug !== event.slug) {
                finalSlug = await ensureUniqueSlug(finalSlug, 'events');
            }

            // Workflow Logic
            const updates: any = {
                ...event,
                ticketTiers: tickets,
                slug: finalSlug,
                updatedAt: Timestamp.now(),
                price: Number(event.price),
                capacity: Number(event.capacity),
            };

            // Workflow: Organizers can only submit for approval
            if (!isSuperAdmin) {
                updates.moderationStatus = 'pending';
                // If they changed visible fields, maybe reset to draft or pending?
                // For now, let's keep status as is but queue it.
                if (event.status === 'published') {
                    toast.info("Changes submitted for approval.");
                }
            } else {
                // Super admin can auto-approve
                if (event.moderationStatus === 'pending') {
                    updates.moderationStatus = 'approved';
                }
            }

            await updateDoc(docRef, updates);

            setEvent(prev => ({ ...prev, slug: finalSlug, ticketTiers: tickets, moderationStatus: updates.moderationStatus }));
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

    // Ticket Management
    const addTicketTier = () => {
        setTickets([...tickets, { tier: 'New Tier', price: 0, status: 'Available', description: '', perks: [] }]);
    };

    const removeTicketTier = (index: number) => {
        const newTickets = [...tickets];
        newTickets.splice(index, 1);
        setTickets(newTickets);
    };

    const updateTicketTier = (index: number, field: string, value: any) => {
        const newTickets = [...tickets];
        newTickets[index] = { ...newTickets[index], [field]: value };
        setTickets(newTickets);
    };

    if (loading) return <div className="h-screen flex items-center justify-center bg-obsidian text-gold"><Loader2 className="animate-spin h-10 w-10" /></div>;
    if (!isAuthorized) return null;

    const isSuperAdmin = profile?.role === 'super-admin';

    // Derived Analytics (Real Data from Event Object)
    const revenue = event.revenue || 0;
    const ticketsSold = event.ticketsSold || 0;
    const capacity = event.capacity || 0;
    const views = event.views || 0;

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
                            <Badge variant="outline" className={event.moderationStatus === 'approved' ? 'text-kenyan-green border-kenyan-green' : 'text-orange-500 border-orange-500'}>
                                {event.moderationStatus?.toUpperCase() || 'PENDING'}
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
                        {isSuperAdmin ? 'Save Changes' : 'Submit for Approval'}
                    </Button>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-6" onValueChange={setActiveTab}>
                <TabsList className="bg-muted p-1">
                    <TabsTrigger value="overview" className="gap-2"><BarChart3 className="h-4 w-4" /> Overview</TabsTrigger>
                    <TabsTrigger value="details" className="gap-2"><Save className="h-4 w-4" /> Edit Details</TabsTrigger>
                    <TabsTrigger value="tickets" className="gap-2"><Ticket className="h-4 w-4" /> Tickets</TabsTrigger>
                    <TabsTrigger value="attendees" className="gap-2"><Users className="h-4 w-4" /> Attendees</TabsTrigger>
                </TabsList>

                {/* OVERVIEW / ANALYTICS TAB */}
                <TabsContent value="overview" className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black text-kenyan-green">KES {revenue.toLocaleString()}</div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Tickets Sold</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black">{ticketsSold} <span className="text-sm font-normal text-muted-foreground">/ {capacity}</span></div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Check-ins</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black">-- <span className="text-sm font-normal text-muted-foreground text-gold">(--%)</span></div></CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">Page Views</CardTitle></CardHeader>
                            <CardContent><div className="text-3xl font-black">{views.toLocaleString()}</div></CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* EDIT DETAILS TAB */}
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
                                <CardHeader><CardTitle>Visibility & Status</CardTitle></CardHeader>
                                <CardContent className="space-y-4">
                                    {/* Only Super Admin can change Status directly */}
                                    <div className="flex items-center justify-between">
                                        <Label>Published</Label>
                                        <Switch
                                            checked={event.status === 'published'}
                                            onCheckedChange={(c) => setEvent({ ...event, status: c ? 'published' : 'draft' })}
                                            disabled={!isSuperAdmin}
                                        />
                                    </div>
                                    {!isSuperAdmin && (
                                        <p className="text-xs text-muted-foreground">Only Admins can publish events.</p>
                                    )}

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

                {/* TICKETS TAB */}
                <TabsContent value="tickets" className="space-y-6 animate-in slide-in-from-bottom-4 fade-in">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold">Ticket Tiers</h2>
                        <Button onClick={addTicketTier}><Plus className="mr-2 h-4 w-4" /> Add Tier</Button>
                    </div>

                    <div className="grid gap-4">
                        {tickets.map((tier, index) => (
                            <Card key={index} className="relative">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-2 right-2 text-destructive hover:bg-destructive/10"
                                    onClick={() => removeTicketTier(index)}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                                <CardHeader className="pb-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                                        <div>
                                            <Label>Tier Name</Label>
                                            <Input
                                                value={tier.tier}
                                                onChange={(e) => updateTicketTier(index, 'tier', e.target.value)}
                                                placeholder="e.g. VIP, Early Bird"
                                                className="font-bold"
                                            />
                                        </div>
                                        <div>
                                            <Label>Price (KES)</Label>
                                            <Input
                                                type="number"
                                                value={tier.price}
                                                onChange={(e) => updateTicketTier(index, 'price', Number(e.target.value))}
                                            />
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <Label>Description</Label>
                                            <Input
                                                value={tier.description || ''}
                                                onChange={(e) => updateTicketTier(index, 'description', e.target.value)}
                                                placeholder="What's included in this ticket?"
                                            />
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="w-1/3">
                                                <Label>Status</Label>
                                                <select
                                                    className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                    value={tier.status}
                                                    onChange={(e) => updateTicketTier(index, 'status', e.target.value)}
                                                >
                                                    <option value="Available">Available</option>
                                                    <option value="Sold Out">Sold Out</option>
                                                    <option value="Almost Gone">Almost Gone</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                        {tickets.length === 0 && (
                            <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                                No ticket tiers configured. Add one to start selling.
                            </div>
                        )}
                    </div>
                </TabsContent>

                {/* ATTENDEES TAB (Simplified View) */}
                <TabsContent value="attendees">
                    <div className="text-center py-12 text-muted-foreground border-2 border-dashed rounded-xl">
                        Guest list management available in Organizer Dashboard. <br />
                        <Button variant="link" onClick={() => router.push(`/organizer/events/${id}`)}>Go to Organizer View</Button>
                    </div>
                </TabsContent>

            </Tabs>
        </div>
    );
}
