'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { collection, query, where, getDocs, addDoc, Timestamp, deleteDoc, doc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import { UserPlus, Search, Loader2, X, QrCode, CheckCircle } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface VerificationAgentInviteProps {
    eventId: string;
    eventName: string;
    organizerId: string;
    assignedAgents: { id: string; agentId: string; agentName: string; agentEmail: string }[];
    onAgentChange: () => void;
}

export function VerificationAgentInvite({
    eventId,
    eventName,
    organizerId,
    assignedAgents,
    onAgentChange
}: VerificationAgentInviteProps) {
    const [open, setOpen] = useState(false);
    const [searching, setSearching] = useState(false);
    const [assigning, setAssigning] = useState(false);
    const [searchEmail, setSearchEmail] = useState('');
    const [searchResult, setSearchResult] = useState<UserProfile | null>(null);
    const [notFound, setNotFound] = useState(false);

    const handleSearch = async () => {
        if (!searchEmail) return;

        setSearching(true);
        setSearchResult(null);
        setNotFound(false);

        try {
            const q = query(
                collection(firestore, 'users'),
                where('email', '==', searchEmail.toLowerCase().trim()),
                where('role', '==', 'verification')
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                setNotFound(true);
            } else {
                setSearchResult({ id: snap.docs[0].id, ...snap.docs[0].data() } as UserProfile);
            }
        } catch (error) {
            console.error('Error searching for agent:', error);
            toast.error('Failed to search');
        } finally {
            setSearching(false);
        }
    };

    const handleAssign = async () => {
        if (!searchResult) return;

        // Check if already assigned
        if (assignedAgents.some(a => a.agentId === searchResult.uid)) {
            toast.error('This agent is already assigned to this event');
            return;
        }

        setAssigning(true);
        try {
            await addDoc(collection(firestore, 'event_agents'), {
                eventId,
                eventName,
                agentId: searchResult.uid,
                agentName: searchResult.displayName || searchResult.email,
                agentEmail: searchResult.email,
                organizerId,
                assignedAt: Timestamp.now(),
                scansCount: 0,
            });

            toast.success(`${searchResult.displayName || searchResult.email} assigned as verification agent!`);
            setSearchEmail('');
            setSearchResult(null);
            onAgentChange();
        } catch (error) {
            console.error('Error assigning agent:', error);
            toast.error('Failed to assign agent');
        } finally {
            setAssigning(false);
        }
    };

    const handleRemove = async (assignmentId: string) => {
        try {
            await deleteDoc(doc(firestore, 'event_agents', assignmentId));
            toast.success('Agent removed');
            onAgentChange();
        } catch (error) {
            toast.error('Failed to remove agent');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="border-white/10 bg-white/5">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Verification Agents ({assignedAgents.length})
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-obsidian border-white/10 max-w-lg">
                <DialogHeader>
                    <DialogTitle className="text-white font-black uppercase tracking-tighter">
                        Manage Verification Agents
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Assigned Agents */}
                    <div className="space-y-3">
                        <Label className="text-white/60 text-xs uppercase font-bold">Assigned Agents</Label>
                        {assignedAgents.length === 0 ? (
                            <p className="text-muted-foreground text-sm">No agents assigned yet</p>
                        ) : (
                            <div className="space-y-2">
                                {assignedAgents.map(agent => (
                                    <div key={agent.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-3">
                                            <div className="h-8 w-8 rounded-full bg-kenyan-green/20 flex items-center justify-center">
                                                <QrCode className="h-4 w-4 text-kenyan-green" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold text-sm">{agent.agentName}</p>
                                                <p className="text-white/50 text-xs">{agent.agentEmail}</p>
                                            </div>
                                        </div>
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            className="text-red-400 hover:text-red-300"
                                            onClick={() => handleRemove(agent.id)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Search & Add */}
                    <div className="space-y-3">
                        <Label className="text-white/60 text-xs uppercase font-bold">Invite Agent by Email</Label>
                        <div className="flex gap-2">
                            <Input
                                type="email"
                                value={searchEmail}
                                onChange={(e) => setSearchEmail(e.target.value)}
                                placeholder="agent@example.com"
                                className="bg-white/5 border-white/10 flex-1"
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                            />
                            <Button
                                onClick={handleSearch}
                                disabled={searching}
                                className="bg-white/10 hover:bg-white/20"
                            >
                                {searching ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Search className="h-4 w-4" />
                                )}
                            </Button>
                        </div>

                        {notFound && (
                            <p className="text-red-400 text-sm">
                                No user with verification role found with this email.
                            </p>
                        )}

                        {searchResult && (
                            <div className="flex items-center justify-between p-4 bg-kenyan-green/10 rounded-xl border border-kenyan-green/30">
                                <div>
                                    <p className="text-white font-bold">{searchResult.displayName || searchResult.email}</p>
                                    <p className="text-white/60 text-sm">{searchResult.email}</p>
                                    <Badge className="mt-1 bg-kenyan-green/20 text-kenyan-green text-xs">
                                        <CheckCircle className="h-3 w-3 mr-1" /> Verification Agent
                                    </Badge>
                                </div>
                                <Button
                                    onClick={handleAssign}
                                    disabled={assigning}
                                    className="bg-kenyan-green hover:bg-kenyan-green/90 text-white"
                                >
                                    {assigning ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>Assign</>
                                    )}
                                </Button>
                            </div>
                        )}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10">
                        Close
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
