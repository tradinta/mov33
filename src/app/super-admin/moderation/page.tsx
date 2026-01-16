'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, ShieldAlert, Eye, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { collection, getDocs, query, orderBy, limit, where } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function ModerationPage() {
    const [loading, setLoading] = useState(true);
    const [auditLogs, setAuditLogs] = useState<any[]>([]);
    const [flaggedUsers, setFlaggedUsers] = useState<any[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch Audit Logs
                const logsSnap = await getDocs(query(collection(firestore, 'audit_logs'), orderBy('timestamp', 'desc'), limit(50)));
                const logs = logsSnap.docs.map(d => ({ id: d.id, ...d.data() }));
                setAuditLogs(logs);

                // Fetch Suspended/Flagged Users
                const usersSnap = await getDocs(query(collection(firestore, 'users'), where('isSuspended', '==', true)));
                const users = usersSnap.docs.map(d => ({ uid: d.id, ...d.data() }));
                setFlaggedUsers(users);

            } catch (error) {
                console.error("Error fetching moderation data:", error);
                toast.error("Failed to load moderation data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-[60vh]"><Loader2 className="h-8 w-8 animate-spin text-gold" /></div>;
    }

    return (
        <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">Moderation</h1>
                <p className="text-zinc-400">Monitor platform activity and manage flagged content.</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-white">{auditLogs.length}</div>
                        <p className="text-zinc-500 text-sm">Audit Entries (Last 50)</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-red-500">{flaggedUsers.length}</div>
                        <p className="text-zinc-500 text-sm">Suspended Accounts</p>
                    </CardContent>
                </Card>
                <Card className="bg-[#111] border-white/5">
                    <CardContent className="pt-6">
                        <div className="text-2xl font-bold text-green-500">Healthy</div>
                        <p className="text-zinc-500 text-sm">Platform Status</p>
                    </CardContent>
                </Card>
            </div>

            <Tabs defaultValue="audit" className="space-y-6">
                <TabsList className="bg-[#161616] border border-white/5">
                    <TabsTrigger value="audit" className="data-[state=active]:bg-gold data-[state=active]:text-black"><FileText className="h-4 w-4 mr-2" /> Audit Trail</TabsTrigger>
                    <TabsTrigger value="flagged" className="data-[state=active]:bg-gold data-[state=active]:text-black"><AlertTriangle className="h-4 w-4 mr-2" /> Flagged Accounts</TabsTrigger>
                </TabsList>

                <TabsContent value="audit" className="space-y-4">
                    <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#161616]">
                                <TableRow className="border-white/5">
                                    <TableHead className="text-zinc-500">Action</TableHead>
                                    <TableHead className="text-zinc-500">User</TableHead>
                                    <TableHead className="text-zinc-500">IP Address</TableHead>
                                    <TableHead className="text-zinc-500">Status</TableHead>
                                    <TableHead className="text-zinc-500">Time</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {auditLogs.map((log: any) => (
                                    <TableRow key={log.id} className="border-white/5 hover:bg-white/[0.02]">
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <ShieldAlert className="h-4 w-4 text-blue-500" />
                                                <span className="text-white font-medium">{log.action || 'Unknown'}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div>
                                                <div className="text-white text-sm">{log.userName || 'Unknown'}</div>
                                                <div className="text-zinc-500 text-xs">{log.userEmail}</div>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-zinc-400 font-mono text-xs">{log.ipAddress || 'N/A'}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className={log.status === 'success' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'}>
                                                {log.status === 'success' ? <CheckCircle2 className="h-3 w-3 mr-1" /> : <AlertTriangle className="h-3 w-3 mr-1" />}
                                                {log.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-zinc-500 text-sm">
                                            {log.timestamp?.toDate ? format(log.timestamp.toDate(), 'MMM dd, HH:mm') : 'N/A'}
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {auditLogs.length === 0 && (
                                    <TableRow><TableCell colSpan={5} className="text-center text-zinc-500 py-8">No audit logs yet</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="flagged" className="space-y-4">
                    <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
                        <Table>
                            <TableHeader className="bg-[#161616]">
                                <TableRow className="border-white/5">
                                    <TableHead className="text-zinc-500">User</TableHead>
                                    <TableHead className="text-zinc-500">Email</TableHead>
                                    <TableHead className="text-zinc-500">Role</TableHead>
                                    <TableHead className="text-zinc-500">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {flaggedUsers.map((user: any) => (
                                    <TableRow key={user.uid} className="border-white/5 hover:bg-white/[0.02]">
                                        <TableCell className="text-white font-medium">{user.displayName || 'Anonymous'}</TableCell>
                                        <TableCell className="text-zinc-400">{user.email}</TableCell>
                                        <TableCell className="text-zinc-400 uppercase text-xs">{user.role}</TableCell>
                                        <TableCell>
                                            <Badge variant="outline" className="bg-red-500/10 text-red-400 border-red-500/20">
                                                Suspended
                                            </Badge>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {flaggedUsers.length === 0 && (
                                    <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No flagged accounts</TableCell></TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
