'use client';

import React, { useState, useEffect } from 'react';
import {
    Search,
    Loader2,
    Flag,
    MoreVertical,
    Eye,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    User,
    Calendar,
    Ticket
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useAuth } from '@/context/auth-context';
import { firestore } from '@/firebase';
import { collection, query, orderBy, onSnapshot, Timestamp, doc, updateDoc, limit } from 'firebase/firestore';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { GlassCard } from '@/components/ui/glass-card';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface Report {
    id: string;
    targetId: string;
    targetType: 'event' | 'user';
    reporterId: string;
    reporterEmail?: string;
    reason: string;
    details?: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: Timestamp;
    resolvedBy?: string;
    resolution?: string;
}

export default function AdminReportsPage() {
    const { user, profile } = useAuth();
    const [reports, setReports] = useState<Report[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'pending' | 'resolved' | 'dismissed'>('pending');
    const [selectedReport, setSelectedReport] = useState<Report | null>(null);
    const [resolution, setResolution] = useState('');
    const [resolving, setResolving] = useState(false);

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super-admin';

    useEffect(() => {
        const q = query(
            collection(firestore, 'reports'),
            orderBy('createdAt', 'desc'),
            limit(100)
        );

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Report[];
            setReports(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const filteredReports = reports.filter(r =>
        filter === 'all' || r.status === filter
    );

    const resolveReport = async (action: 'resolved' | 'dismissed') => {
        if (!selectedReport || !user) return;
        setResolving(true);

        try {
            await updateDoc(doc(firestore, 'reports', selectedReport.id), {
                status: action,
                resolvedBy: user.uid,
                resolution: resolution || (action === 'dismissed' ? 'Report dismissed' : 'Issue resolved'),
                resolvedAt: Timestamp.now()
            });
            setSelectedReport(null);
            setResolution('');
        } catch (error) {
            console.error('Error resolving report:', error);
        } finally {
            setResolving(false);
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            case 'resolved': return 'bg-kenyan-green/20 text-kenyan-green border-kenyan-green/30';
            case 'dismissed': return 'bg-white/10 text-white/40 border-white/10';
            default: return 'bg-white/10 text-white/60';
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Reports</h1>
                    <p className="text-muted-foreground mt-2">Review user reports and flagged content.</p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {reports.filter(r => r.status === 'pending').length} Pending
                    </Badge>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search reports..."
                        className="pl-10 bg-card border-border"
                    />
                </div>
                <div className="flex gap-2">
                    {(['all', 'pending', 'resolved', 'dismissed'] as const).map((f) => (
                        <Button
                            key={f}
                            variant={filter === f ? 'default' : 'outline'}
                            onClick={() => setFilter(f)}
                            size="sm"
                            className={cn(
                                "rounded-xl",
                                filter === f && f === 'pending' && 'bg-yellow-500 text-black',
                                filter === f && f === 'resolved' && 'bg-kenyan-green'
                            )}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1)}
                        </Button>
                    ))}
                </div>
            </div>

            {/* Reports List */}
            <div className="space-y-4">
                {filteredReports.map((report) => (
                    <GlassCard key={report.id} className="p-6 border-white/5">
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-4">
                                <div className={cn(
                                    "h-12 w-12 rounded-xl flex items-center justify-center",
                                    report.targetType === 'event' ? 'bg-blue-500/20' : 'bg-purple-500/20'
                                )}>
                                    {report.targetType === 'event' ? (
                                        <Ticket className="h-6 w-6 text-blue-400" />
                                    ) : (
                                        <User className="h-6 w-6 text-purple-400" />
                                    )}
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <Badge className={cn("text-[10px]", getStatusBadge(report.status))}>
                                            {report.status}
                                        </Badge>
                                        <span className="text-xs text-muted-foreground">
                                            {report.targetType === 'event' ? 'Event' : 'User'} Report
                                        </span>
                                    </div>
                                    <h3 className="font-bold mt-2">{report.reason}</h3>
                                    {report.details && (
                                        <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                                            {report.details}
                                        </p>
                                    )}
                                    <div className="flex items-center gap-4 mt-3 text-[10px] text-white/40">
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {format(report.createdAt.toDate(), 'MMM d, yyyy')}
                                        </span>
                                        <span>Target ID: {report.targetId.slice(0, 8)}...</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                {report.status === 'pending' && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => setSelectedReport(report)}
                                            className="border-kenyan-green text-kenyan-green hover:bg-kenyan-green/20"
                                        >
                                            <CheckCircle2 className="h-4 w-4 mr-1" /> Resolve
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setSelectedReport(report);
                                                setResolution('Report dismissed - no action needed');
                                            }}
                                            className="border-white/20 hover:bg-white/10"
                                        >
                                            <XCircle className="h-4 w-4 mr-1" /> Dismiss
                                        </Button>
                                    </>
                                )}
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <MoreVertical className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                        <DropdownMenuItem>
                                            <Eye className="h-4 w-4 mr-2" /> View Target
                                        </DropdownMenuItem>
                                        <DropdownMenuItem>
                                            <User className="h-4 w-4 mr-2" /> View Reporter
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>

                        {report.resolution && (
                            <div className="mt-4 p-3 bg-white/5 rounded-xl border border-white/10">
                                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-1">Resolution</p>
                                <p className="text-sm">{report.resolution}</p>
                            </div>
                        )}
                    </GlassCard>
                ))}

                {filteredReports.length === 0 && (
                    <div className="text-center py-20 text-muted-foreground">
                        <Flag className="h-16 w-16 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No reports found</p>
                        <p className="text-sm mt-1">
                            {filter === 'pending' ? 'All caught up! No pending reports.' : 'Try adjusting your filters'}
                        </p>
                    </div>
                )}
            </div>

            {/* Resolution Dialog */}
            <Dialog open={!!selectedReport} onOpenChange={() => setSelectedReport(null)}>
                <DialogContent className="bg-obsidian border-white/10">
                    <DialogHeader>
                        <DialogTitle>Resolve Report</DialogTitle>
                        <DialogDescription>
                            Add a resolution note for this report.
                        </DialogDescription>
                    </DialogHeader>
                    <Textarea
                        value={resolution}
                        onChange={(e) => setResolution(e.target.value)}
                        placeholder="Describe the action taken..."
                        className="min-h-[100px] bg-white/5 border-white/10"
                    />
                    <DialogFooter className="gap-2">
                        <Button
                            variant="outline"
                            onClick={() => resolveReport('dismissed')}
                            disabled={resolving}
                        >
                            Dismiss
                        </Button>
                        <Button
                            onClick={() => resolveReport('resolved')}
                            disabled={resolving}
                            className="bg-kenyan-green hover:bg-kenyan-green/90"
                        >
                            {resolving ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Mark Resolved'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
