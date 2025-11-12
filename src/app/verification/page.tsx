
'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, ScanLine, Ticket, XCircle, CheckCircle, Webcam, LogOut } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Logo } from '@/components/logo';


// Mock data for ticket lookup
const mockTicketDatabase: { [key: string]: any } = {
  'TKT-001-ABCD': {
    status: 'valid',
    details: {
      eventName: 'Sauti Sol: Live in Nairobi',
      ticketType: 'VIP',
      attendeeName: 'John Doe',
      purchaseDate: '2024-10-15',
    },
  },
  'TKT-002-EFGH': {
    status: 'scanned',
    details: {
      eventName: 'Safari Sevens Rugby',
      ticketType: 'Regular',
      attendeeName: 'Jane Smith',
      purchaseDate: '2024-09-20',
      scanTime: '2024-10-20 10:35 AM',
    },
  },
    'TKT-003-IJKL': {
    status: 'invalid',
    details: null,
  },
};


export default function VerificationPage() {
    const { toast } = useToast();
    const videoRef = useRef<HTMLVideoElement>(null);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const [ticketId, setTicketId] = useState('');
    const [verificationResult, setVerificationResult] = useState<any>(null);
    const [isScanning, setIsScanning] = useState(false);

    useEffect(() => {
        const getCameraPermission = async () => {
          if (!isScanning) {
            if (videoRef.current && videoRef.current.srcObject) {
              (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
              videoRef.current.srcObject = null;
            }
            return;
          };

          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
            setHasCameraPermission(true);

            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }

            // In a real app, you'd integrate a QR scanner library here
            // e.g., jsQR, react-qr-scanner
            // For this demo, we'll simulate a scan after 3 seconds
            setTimeout(() => {
              const scannedId = 'TKT-002-EFGH'; // Simulate a scanned code
              setTicketId(scannedId);
              handleVerification(scannedId);
              setIsScanning(false);
               toast({
                title: 'QR Code Scanned',
                description: `Ticket ID: ${scannedId}`,
              });
            }, 3000);


          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            setIsScanning(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings.',
            });
          }
        };

        getCameraPermission();
        
        return () => {
           if (videoRef.current && videoRef.current.srcObject) {
              (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
           }
        }
    }, [isScanning, toast]);

    const handleVerification = (id: string) => {
        const result = mockTicketDatabase[id.toUpperCase()] || mockTicketDatabase['TKT-003-IJKL'];
        setVerificationResult(result);
    };

    const handleManualVerify = () => {
        if (!ticketId) return;
        handleVerification(ticketId);
    };
    
    const clearState = () => {
        setTicketId('');
        setVerificationResult(null);
    }

    const renderResult = () => {
        if (!verificationResult) {
            return (
                <div className="text-center py-10">
                    <QrCode className="mx-auto h-12 w-12 text-muted-foreground" />
                    <p className="mt-4 text-muted-foreground">Scan or enter a ticket ID to begin verification.</p>
                </div>
            );
        }

        const { status, details } = verificationResult;

        if (status === 'invalid') {
            return (
                <Card className="border-destructive bg-destructive/10">
                    <CardHeader className="items-center text-center">
                        <XCircle className="h-16 w-16 text-destructive" />
                        <CardTitle className="text-3xl text-destructive">Ticket Invalid</CardTitle>
                        <CardDescription className="text-destructive/80">This ticket code is not found in our system. Please check the code and try again.</CardDescription>
                    </CardHeader>
                     <CardFooter>
                        <Button className="w-full" variant="destructive" onClick={clearState}>Scan Next</Button>
                    </CardFooter>
                </Card>
            )
        }

         if (status === 'scanned') {
            return (
                <Card className="border-amber-500 bg-amber-500/10">
                    <CardHeader className="items-center text-center">
                        <XCircle className="h-16 w-16 text-amber-500" />
                        <CardTitle className="text-3xl text-amber-600 dark:text-amber-500">Already Scanned</CardTitle>
                        <CardDescription className="text-amber-600/80 dark:text-amber-500/80">This ticket was already admitted at {details.scanTime}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="font-bold text-lg">{details.attendeeName}</p>
                            <p className="text-muted-foreground">{details.eventName}</p>
                        </div>
                    </CardContent>
                     <CardFooter>
                        <Button className="w-full" variant="outline" onClick={clearState}>Scan Next</Button>
                    </CardFooter>
                </Card>
            )
        }


        return (
            <Card className="border-green-500 bg-green-500/10">
                <CardHeader className="items-center text-center">
                    <CheckCircle className="h-16 w-16 text-green-500" />
                    <CardTitle className="text-3xl text-green-600 dark:text-green-500">Ticket Valid</CardTitle>
                    <CardDescription className="text-green-600/80 dark:text-green-500/80">This ticket is valid for entry.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Separator />
                    <div className="flex items-center gap-4">
                        <Avatar className="h-16 w-16">
                            <AvatarImage src={`https://picsum.photos/seed/${details.attendeeName}/200/200`} />
                            <AvatarFallback>{details.attendeeName.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-bold text-xl">{details.attendeeName}</p>
                            <Badge variant="secondary" className="mt-1">{details.ticketType}</Badge>
                        </div>
                    </div>
                     <div>
                        <p className="font-semibold">{details.eventName}</p>
                        <p className="text-sm text-muted-foreground">Purchased on: {details.purchaseDate}</p>
                    </div>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full bg-green-600 hover:bg-green-700" onClick={clearState}>Admit & Scan Next</Button>
                </CardFooter>
            </Card>
        );
    }

    return (
    <>
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
            <Logo />
            <div className="flex items-center gap-2">
                <p className="text-sm font-semibold hidden sm:block">Sauti Sol: Live in Nairobi</p>
                <Button variant="outline" size="sm" asChild>
                    <Link href="/super-admin">
                        <LogOut className="mr-2 h-4 w-4" /> Exit Portal
                    </Link>
                </Button>
            </div>
        </div>
    </header>
    <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
        
        <div className="grid md:grid-cols-2 gap-8">
            {/* Left side: Scanner */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Webcam/> Ticket Scanner</CardTitle>
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
                            <div className="p-4">
                                <Alert variant="destructive">
                                    <AlertTitle>Camera Access Required</AlertTitle>
                                    <AlertDescription>
                                        Please allow camera access to use the scanner. You may need to change permissions in your browser settings.
                                    </AlertDescription>
                                </Alert>
                            </div>
                        )}

                         {!isScanning && hasCameraPermission !== false && (
                            <div className="p-4 text-center">
                                 <Webcam className="h-16 w-16 text-muted-foreground mx-auto" />
                                 <p className="mt-2 text-muted-foreground">Camera is ready.</p>
                            </div>
                         )}

                    </div>
                </CardContent>
                 <CardFooter>
                    <Button className="w-full" onClick={() => setIsScanning(prev => !prev)} disabled={hasCameraPermission === false && !isScanning}>
                        {isScanning ? 'Stop Scanning' : 'Start Camera Scan'}
                    </Button>
                </CardFooter>
            </Card>

            {/* Right side: Manual Entry & Result */}
            <div>
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Ticket /> Manual Verification</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex gap-2">
                        <Input 
                            placeholder="Enter Ticket ID..." 
                            value={ticketId}
                            onChange={(e) => setTicketId(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleManualVerify()}
                        />
                        <Button onClick={handleManualVerify}>Verify</Button>
                        </div>
                    </CardContent>
                </Card>
                {renderResult()}
            </div>
        </div>
    </div>
    </>
  );
}

