'use client';

import { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, doc, updateDoc, Timestamp, deleteDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Users, Calendar, Megaphone, CheckCircle, XCircle,
    Clock, Mail, Phone, Instagram, Loader2, Trash2, Eye
} from 'lucide-react';
import { toast } from 'sonner';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

interface PartnerApplication {
    id: string;
    type: 'organizer' | 'influencer';
    fullName: string;
    email: string;
    phone: string;
    socialHandle?: string;
    followers?: string;
    experience?: string;
    message?: string;
    status: 'pending' | 'approved' | 'rejected';
    createdAt: Timestamp;
}

export default function PartnerApplicationsPage() {
    const [applications, setApplications] = useState<PartnerApplication[]>([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState<string | null>(null);

    useEffect(() => {
        fetchApplications();
    }, []);

    const fetchApplications = async () => {
        try {
            const q = query(
                collection(firestore, 'partner_applications'),
                orderBy('createdAt', 'desc')
            );
            const snap = await getDocs(q);
            setApplications(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PartnerApplication)));
        } catch (error) {
            console.error('Error fetching applications:', error);
            toast.error('Failed to load applications');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (app: PartnerApplication) => {
        setProcessing(app.id);
        try {
            // Update application status
            await updateDoc(doc(firestore, 'partner_applications', app.id), {
                status: 'approved',
                approvedAt: Timestamp.now()
            });

            // Find user by email and update their role
            const usersQuery = query(collection(firestore, 'users'));
            const usersSnap = await getDocs(usersQuery);
            const userDoc = usersSnap.docs.find(d => d.data().email === app.email);

            if (userDoc) {
                await updateDoc(doc(firestore, 'users', userDoc.id), {
                    role: app.type,
                    updatedAt: Timestamp.now()
                });
            }

            toast.success(`${app.fullName} approved as ${app.type}!`);
            fetchApplications();
        } catch (error) {
            console.error('Error approving application:', error);
            toast.error('Failed to approve application');
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (app: PartnerApplication) => {
        setProcessing(app.id);
        try {
            await updateDoc(doc(firestore, 'partner_applications', app.id), {
                status: 'rejected',
                rejectedAt: Timestamp.now()
            });
            toast.success('Application rejected');
            fetchApplications();
        } catch (error) {
            console.error('Error rejecting application:', error);
            toast.error('Failed to reject application');
        } finally {
            setProcessing(null);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this application permanently?')) return;
        try {
            await deleteDoc(doc(firestore, 'partner_applications', id));
            toast.success('Application deleted');
            fetchApplications();
        } catch (error) {
            toast.error('Failed to delete');
        }
    };

    const pendingApps = applications.filter(a => a.status === 'pending');
    const approvedApps = applications.filter(a => a.status === 'approved');
    const rejectedApps = applications.filter(a => a.status === 'rejected');

    const ApplicationCard = ({ app }: { app: PartnerApplication }) => (
        <Card className="bg-white/5 border-white/10">
            <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${app.type === 'organizer' ? 'bg-kenyan-green/10' : 'bg-gold/10'
                            }`}>
                            {app.type === 'organizer' ? (
                                <Calendar className="h-6 w-6 text-kenyan-green" />
                            ) : (
                                <Megaphone className="h-6 w-6 text-gold" />
                            )}
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{app.fullName}</h3>
                            <Badge className={`mt-1 ${app.type === 'organizer'
                                    ? 'bg-kenyan-green/20 text-kenyan-green'
                                    : 'bg-gold/20 text-gold'
                                }`}>
                                {app.type}
                            </Badge>
                        </div>
                    </div>
                    <div className="text-right text-xs text-muted-foreground">
                        {app.createdAt?.toDate?.().toLocaleDateString() || 'Unknown'}
                    </div>
                </div>

                <div className="mt-4 space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-white/70">
                        <Mail className="h-4 w-4" /> {app.email}
                    </div>
                    <div className="flex items-center gap-2 text-white/70">
                        <Phone className="h-4 w-4" /> {app.phone}
                    </div>
                    {app.socialHandle && (
                        <div className="flex items-center gap-2 text-white/70">
                            <Instagram className="h-4 w-4" /> {app.socialHandle}
                        </div>
                    )}
                    {app.followers && (
                        <div className="flex items-center gap-2 text-white/70">
                            <Users className="h-4 w-4" /> {app.followers} followers
                        </div>
                    )}
                </div>

                {app.message && (
                    <p className="mt-4 text-sm text-white/50 line-clamp-2">{app.message}</p>
                )}

                <div className="mt-4 flex items-center gap-2">
                    {app.status === 'pending' && (
                        <>
                            <Button
                                size="sm"
                                className="bg-kenyan-green hover:bg-kenyan-green/90"
                                onClick={() => handleApprove(app)}
                                disabled={processing === app.id}
                            >
                                {processing === app.id ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <><CheckCircle className="h-4 w-4 mr-1" /> Approve</>
                                )}
                            </Button>
                            <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleReject(app)}
                                disabled={processing === app.id}
                            >
                                <XCircle className="h-4 w-4 mr-1" /> Reject
                            </Button>
                        </>
                    )}
                    {app.status === 'approved' && (
                        <Badge className="bg-kenyan-green/20 text-kenyan-green">
                            <CheckCircle className="h-3 w-3 mr-1" /> Approved
                        </Badge>
                    )}
                    {app.status === 'rejected' && (
                        <Badge className="bg-red-500/20 text-red-400">
                            <XCircle className="h-3 w-3 mr-1" /> Rejected
                        </Badge>
                    )}
                    <Button
                        size="sm"
                        variant="ghost"
                        className="ml-auto text-red-400 hover:text-red-300"
                        onClick={() => handleDelete(app.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    );

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-black uppercase tracking-tighter text-white">Partner Applications</h1>
                <p className="text-muted-foreground">Manage organizer and influencer applications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                            <Clock className="h-6 w-6 text-yellow-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{pendingApps.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Pending</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-kenyan-green/10 flex items-center justify-center">
                            <CheckCircle className="h-6 w-6 text-kenyan-green" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{approvedApps.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Approved</p>
                        </div>
                    </CardContent>
                </Card>
                <Card className="bg-white/5 border-white/10">
                    <CardContent className="p-4 flex items-center gap-4">
                        <div className="h-12 w-12 rounded-xl bg-red-500/10 flex items-center justify-center">
                            <XCircle className="h-6 w-6 text-red-500" />
                        </div>
                        <div>
                            <p className="text-2xl font-black text-white">{rejectedApps.length}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider">Rejected</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="pending">
                <TabsList className="bg-white/5 border border-white/10">
                    <TabsTrigger value="pending">Pending ({pendingApps.length})</TabsTrigger>
                    <TabsTrigger value="approved">Approved ({approvedApps.length})</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected ({rejectedApps.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="pending" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {pendingApps.length === 0 ? (
                            <p className="text-muted-foreground col-span-2 text-center py-12">No pending applications</p>
                        ) : (
                            pendingApps.map(app => <ApplicationCard key={app.id} app={app} />)
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="approved" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {approvedApps.length === 0 ? (
                            <p className="text-muted-foreground col-span-2 text-center py-12">No approved applications</p>
                        ) : (
                            approvedApps.map(app => <ApplicationCard key={app.id} app={app} />)
                        )}
                    </div>
                </TabsContent>

                <TabsContent value="rejected" className="mt-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {rejectedApps.length === 0 ? (
                            <p className="text-muted-foreground col-span-2 text-center py-12">No rejected applications</p>
                        ) : (
                            rejectedApps.map(app => <ApplicationCard key={app.id} app={app} />)
                        )}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
