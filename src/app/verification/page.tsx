'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, ScanLine, Ticket, XCircle, CheckCircle, Webcam, LogOut, Calendar, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, doc, updateDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { TicketRecord } from '@/lib/types';

interface AssignedEvent {
    id: string;
    eventId: string;
    eventName: string;
    scansCount: number;
}

export default function VerificationPage() {
    const { user, profile } = useAuth();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [ticketId, setTicketId] = useState('');
    const [verificationResult, setVerificationResult] = useState<{
        status: 'valid' | 'scanned' | 'invalid';
        ticket?: TicketRecord;
    } | null>(null);
    const [isScanning, setIsScanning] = useState(false);
    const [verifying, setVerifying] = useState(false);
    const [assignedEvents, setAssignedEvents] = useState<AssignedEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string>('');
    const [loading, setLoading] = useState(true);
    const [recentScans, setRecentScans] = useState<TicketRecord[]>([]);

    // Fetch assigned events for this verification agent
    useEffect(() => {
        const fetchAssignedEvents = async () => {
            if (!user?.uid) return;

            try {
                const q = query(
                    collection(firestore, 'event_agents'),
                    where('agentId', '==', user.uid)
                );
                const snap = await getDocs(q);
                const events = snap.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as AssignedEvent[];

                setAssignedEvents(events);
                if (events.length > 0) {
                    setSelectedEventId(events[0].eventId);
                }
            } catch (error) {
                console.error('Error fetching assigned events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedEvents();
    }, [user?.uid]);

    // Camera handling
    useEffect(() => {
        const getCameraPermission = async () => {
            if (!isScanning) {
                if (videoRef.current && videoRef.current.srcObject) {
                    (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
                    videoRef.current.srcObject = null;
                }
                return;
            }

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
                setHasCameraPermission(true);
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Error accessing camera:', error);
                setHasCameraPermission(false);
                setIsScanning(false);
                toast.error('Camera access denied. Please enable camera permissions.');
            }
        };

        getCameraPermission();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
            }
        }
    }, [isScanning]);

    const handleVerification = async (qrCode: string) => {
        if (!qrCode || !selectedEventId) {
            toast.error('Please select an event and enter a ticket code');
            return;
        }

        setVerifying(true);
        setVerificationResult(null);

        try {
            // Search for ticket by QR code
            const q = query(
                collection(firestore, 'tickets'),
                where('qrCode', '==', qrCode.toUpperCase().trim()),
                where('eventId', '==', selectedEventId)
            );
            const snap = await getDocs(q);

            if (snap.empty) {
                setVerificationResult({ status: 'invalid' });
                toast.error('Ticket not found');
                return;
            }

            const ticketDoc = snap.docs[0];
            const ticket = { id: ticketDoc.id, ...ticketDoc.data() } as TicketRecord;

            if (ticket.checkedIn) {
                setVerificationResult({ status: 'scanned', ticket });
                toast.warning('Ticket already scanned');
            } else {
                setVerificationResult({ status: 'valid', ticket });
            }
        } catch (error) {
            console.error('Error verifying ticket:', error);
            toast.error('Failed to verify ticket');
            setVerificationResult({ status: 'invalid' });
        } finally {
            setVerifying(false);
        }
    };

    const handleAdmit = async () => {
        if (!verificationResult?.ticket) return;

        try {
            await updateDoc(doc(firestore, 'tickets', verificationResult.ticket.id), {
                checkedIn: true,
                checkedInAt: Timestamp.now(),
                checkedInBy: user?.uid
            });

            toast.success(`${verificationResult.ticket.userName} admitted!`);
            setRecentScans(prev => [verificationResult.ticket!, ...prev].slice(0, 10));
            clearState();
        } catch (error) {
            console.error('Error admitting ticket:', error);
            toast.error('Failed to admit ticket');
        }
    };

    const clearState = () => {
        setTicketId('');
        setVerificationResult(null);
    };

    const renderResult = () => {
        if (verifying) {
            return (
                <div className="text-center py-10">
                    <Loader2 className="mx-auto h-12 w-12 text-gold animate-spin" />
                    <p className="mt-4 text-muted-foreground">Verifying ticket...</p>
                </div>
            );
        }

        if (!verificationResult) {
            return (
                <div className="text-center py-10">
                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Scan or enter a ticket QR code to verify.</p>
                </div>
            );
        }

        const { status, ticket } = verificationResult;

        if (status === 'invalid') {
            return (
                <Card className="border-destructive bg-destructive/10">
                    <CardHeader className="items-center text-center">
                        <XCircle className="h-16 w-16 text-destructive" />
                        <CardTitle className="text-3xl text-destructive">Ticket Invalid</CardTitle>
                        <CardDescription className="text-destructive/80">
                            This ticket code was not found for this event.
                        </CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button className="w-full" variant="destructive" onClick={clearState}>Scan Next</Button>
                    </CardFooter>
                </Card>
            );
        }

        if (status === 'scanned' && ticket) {
            return (
                <Card className="border-amber-500 bg-amber-500/10">
                    <CardHeader className="items-center text-center">
                        <XCircle className="h-16 w-16 text-amber-500" />
                        <CardTitle className="text-3xl text-amber-600 dark:text-amber-500">Already Scanned</CardTitle>
                        <CardDescription className="text-amber-600/80 dark:text-amber-500/80">
                            This ticket was already admitted.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="font-bold text-lg">{ticket.userName}</p>
                            <p className="text-muted-foreground">{ticket.eventName}</p>
                            <Badge className="mt-2">{ticket.ticketType}</Badge>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" variant="outline" onClick={clearState}>Scan Next</Button>
                    </CardFooter>
                </Card>
            );
        }

        if (status === 'valid' && ticket) {
            return (
                <Card className="border-green-500 bg-green-500/10">
                    <CardHeader className="items-center text-center">
                        <CheckCircle className="h-16 w-16 text-green-500" />
                        <CardTitle className="text-3xl text-green-600 dark:text-green-500">Ticket Valid</CardTitle>
                        <CardDescription className="text-green-600/80 dark:text-green-500/80">
                            This ticket is valid for entry.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Separator />
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16">
                                <AvatarFallback>{ticket.userName?.split(' ').map(n => n[0]).join('') || 'U'}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-xl">{ticket.userName}</p>
                                <Badge variant="secondary" className="mt-1">{ticket.ticketType}</Badge>
                            </div>
                        </div>
                        <div>
                            <p className="font-semibold">{ticket.eventName}</p>
                            <p className="text-sm text-muted-foreground">{ticket.userEmail}</p>
                        </div>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleAdmit}>
                            Admit & Scan Next
                        </Button>
                    </CardFooter>
                </Card>
            );
        }

        return null;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <>
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Logo />
                    <div className="flex items-center gap-2">
                        <Badge className="bg-kenyan-green/20 text-kenyan-green">
                            <QrCode className="h-3 w-3 mr-1" /> Verification Agent
                        </Badge>
                        <Button variant="outline" size="sm" asChild>
                            <Link href="/">
                                <LogOut className="mr-2 h-4 w-4" /> Exit Portal
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            <div className="container mx-auto max-w-5xl p-4 sm:p-6 lg:p-8">
                <Tabs defaultValue="scanner">
                    <TabsList className="mb-6">
                        <TabsTrigger value="scanner">Scanner</TabsTrigger>
                        <TabsTrigger value="events">My Events ({assignedEvents.length})</TabsTrigger>
                        <TabsTrigger value="recent">Recent Scans ({recentScans.length})</TabsTrigger>
                    </TabsList>

                    <TabsContent value="scanner">
                        {assignedEvents.length === 0 ? (
                            <Card className="text-center py-16">
                                <CardContent>
                                    <Calendar className="mx-auto h-16 w-16 text-muted-foreground/50 mb-4" />
                                    <h2 className="text-xl font-bold text-white mb-2">No Events Assigned</h2>
                                    <p className="text-muted-foreground max-w-md mx-auto">
                                        You haven't been assigned to any events yet. Contact an event organizer to get assigned as a verification agent.
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <>
                                {/* Event Selector */}
                                <Card className="mb-6">
                                    <CardContent className="p-4">
                                        <label className="text-sm font-bold text-muted-foreground uppercase mb-2 block">
                                            Select Event to Verify
                                        </label>
                                        <select
                                            value={selectedEventId}
                                            onChange={(e) => setSelectedEventId(e.target.value)}
                                            className="w-full p-3 bg-white/5 border border-white/10 rounded-xl text-white"
                                        >
                                            {assignedEvents.map(event => (
                                                <option key={event.eventId} value={event.eventId} className="bg-obsidian">
                                                    {event.eventName}
                                                </option>
                                            ))}
                                        </select>
                                    </CardContent>
                                </Card>

                                <div className="grid md:grid-cols-2 gap-8">
                                    {/* Scanner */}
                                    <Card>
                                        <CardHeader>
                                            <CardTitle className="flex items-center gap-2"><Webcam /> QR Scanner</CardTitle>
                                            <CardDescription>Point the camera at a QR code to verify.</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="aspect-video bg-muted rounded-md flex items-center justify-center relative overflow-hidden">
                                                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />

                                                {isScanning && (
                                                    <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                                                        <ScanLine className="h-24 w-24 text-white/80 animate-pulse" />
                                                        <p className="text-white mt-2">Scanning...</p>
                                                    </div>
                                                )}

                                                {!isScanning && hasCameraPermission === false && (
                                                    <Alert variant="destructive" className="m-4">
                                                        <AlertTitle>Camera Access Required</AlertTitle>
                                                        <AlertDescription>
                                                            Please enable camera permissions.
                                                        </AlertDescription>
                                                    </Alert>
                                                )}

                                                {!isScanning && hasCameraPermission !== false && (
                                                    <div className="p-4 text-center">
                                                        <Webcam className="h-16 w-16 text-muted-foreground mx-auto" />
                                                        <p className="mt-2 text-muted-foreground">Camera ready.</p>
                                                    </div>
                                                )}
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                            <Button
                                                className="w-full"
                                                onClick={() => setIsScanning(prev => !prev)}
                                                disabled={hasCameraPermission === false && !isScanning}
                                            >
                                                {isScanning ? 'Stop Scanning' : 'Start Camera Scan'}
                                            </Button>
                                        </CardFooter>
                                    </Card>

                                    {/* Manual Entry & Result */}
                                    <div>
                                        <Card className="mb-6">
                                            <CardHeader>
                                                <CardTitle className="flex items-center gap-2"><Ticket /> Manual Entry</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="flex gap-2">
                                                    <Input
                                                        placeholder="Enter QR Code..."
                                                        value={ticketId}
                                                        onChange={(e) => setTicketId(e.target.value)}
                                                        onKeyDown={(e) => e.key === 'Enter' && handleVerification(ticketId)}
                                                    />
                                                    <Button onClick={() => handleVerification(ticketId)} disabled={verifying}>
                                                        {verifying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify'}
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                        {renderResult()}
                                    </div>
                                </div>
                            </>
                        )}
                    </TabsContent>

                    <TabsContent value="events">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {assignedEvents.map(event => (
                                <Card key={event.id} className="bg-white/5 border-white/10">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center">
                                                <Calendar className="h-6 w-6 text-gold" />
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="font-bold text-white">{event.eventName}</h3>
                                                <p className="text-sm text-muted-foreground">{event.scansCount || 0} scans</p>
                                            </div>
                                            <Button
                                                size="sm"
                                                onClick={() => { setSelectedEventId(event.eventId); }}
                                                className="bg-gold text-obsidian hover:bg-gold/90"
                                            >
                                                Select
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="recent">
                        {recentScans.length === 0 ? (
                            <p className="text-center text-muted-foreground py-12">No scans yet this session.</p>
                        ) : (
                            <div className="space-y-2">
                                {recentScans.map((scan, i) => (
                                    <Card key={i} className="bg-green-500/10 border-green-500/30">
                                        <CardContent className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className="h-5 w-5 text-green-500" />
                                                <div>
                                                    <p className="font-bold text-white">{scan.userName}</p>
                                                    <p className="text-xs text-muted-foreground">{scan.ticketType}</p>
                                                </div>
                                            </div>
                                            <Badge className="bg-green-500/20 text-green-400">Admitted</Badge>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
