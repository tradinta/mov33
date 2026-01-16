'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { toast } from 'sonner';
import { Ticket, Plus, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';

interface TicketGeneratorProps {
    eventId: string;
    eventName: string;
    eventDate: Timestamp;
    eventLocation: string;
    eventImageUrl?: string;
    organizerId: string;
    ticketTiers?: { id: string; tier: string; price: number }[];
}

export function TicketGenerator({
    eventId,
    eventName,
    eventDate,
    eventLocation,
    eventImageUrl,
    organizerId,
    ticketTiers = []
}: TicketGeneratorProps) {
    const [open, setOpen] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [ticketType, setTicketType] = useState(ticketTiers[0]?.tier || 'General');
    const [price, setPrice] = useState(ticketTiers[0]?.price || 0);
    const [markAsUsed, setMarkAsUsed] = useState(false);
    const [recipientName, setRecipientName] = useState('');
    const [recipientEmail, setRecipientEmail] = useState('');

    const handleGenerate = async () => {
        if (!recipientName || !recipientEmail) {
            toast.error('Please enter recipient details');
            return;
        }

        setGenerating(true);
        try {
            const tickets = [];
            for (let i = 0; i < quantity; i++) {
                const qrCode = `MOV33-${eventId.slice(0, 6).toUpperCase()}-${uuidv4().slice(0, 8).toUpperCase()}`;

                const ticketData = {
                    orderId: `GEN-${uuidv4().slice(0, 8).toUpperCase()}`,
                    eventId,
                    eventName,
                    eventDate,
                    eventLocation,
                    eventImageUrl: eventImageUrl || '',
                    userId: 'generated',
                    userName: recipientName,
                    userEmail: recipientEmail,
                    ticketType,
                    price,
                    qrCode,
                    checkedIn: markAsUsed,
                    checkedInAt: markAsUsed ? Timestamp.now() : null,
                    organizerId,
                    createdAt: Timestamp.now(),
                    generatedManually: true,
                };

                const docRef = await addDoc(collection(firestore, 'tickets'), ticketData);
                tickets.push({ id: docRef.id, qrCode });
            }

            toast.success(`Generated ${quantity} ticket(s) successfully!`);
            setOpen(false);
            setQuantity(1);
            setRecipientName('');
            setRecipientEmail('');
        } catch (error) {
            console.error('Error generating tickets:', error);
            toast.error('Failed to generate tickets');
        } finally {
            setGenerating(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-gold text-obsidian hover:bg-gold/90 font-black uppercase tracking-widest">
                    <Plus className="h-4 w-4 mr-2" />
                    Generate Tickets
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-obsidian border-white/10 max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-white font-black uppercase tracking-tighter">
                        Generate Tickets
                    </DialogTitle>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase font-bold">Event</Label>
                        <p className="text-white font-bold">{eventName}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs uppercase font-bold">Quantity</Label>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={quantity}
                                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                                className="bg-white/5 border-white/10"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-white/60 text-xs uppercase font-bold">Ticket Type</Label>
                            <Select value={ticketType} onValueChange={(val) => {
                                setTicketType(val);
                                const tier = ticketTiers.find(t => t.tier === val);
                                if (tier) setPrice(tier.price);
                            }}>
                                <SelectTrigger className="bg-white/5 border-white/10">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-obsidian border-white/10">
                                    {ticketTiers.length > 0 ? (
                                        ticketTiers.map(t => (
                                            <SelectItem key={t.id} value={t.tier}>{t.tier} - KES {t.price}</SelectItem>
                                        ))
                                    ) : (
                                        <>
                                            <SelectItem value="General">General</SelectItem>
                                            <SelectItem value="VIP">VIP</SelectItem>
                                            <SelectItem value="VVIP">VVIP</SelectItem>
                                        </>
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase font-bold">Recipient Name *</Label>
                        <Input
                            value={recipientName}
                            onChange={(e) => setRecipientName(e.target.value)}
                            placeholder="John Kamau"
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label className="text-white/60 text-xs uppercase font-bold">Recipient Email *</Label>
                        <Input
                            type="email"
                            value={recipientEmail}
                            onChange={(e) => setRecipientEmail(e.target.value)}
                            placeholder="john@example.com"
                            className="bg-white/5 border-white/10"
                        />
                    </div>

                    <div className="flex items-center space-x-3 bg-white/5 p-4 rounded-xl border border-white/10">
                        <Checkbox
                            id="markUsed"
                            checked={markAsUsed}
                            onCheckedChange={(val) => setMarkAsUsed(!!val)}
                            className="border-white/20 data-[state=checked]:bg-gold data-[state=checked]:text-obsidian"
                        />
                        <Label htmlFor="markUsed" className="text-white text-sm cursor-pointer">
                            Mark as already used (checked-in)
                        </Label>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)} className="border-white/10">
                        Cancel
                    </Button>
                    <Button
                        onClick={handleGenerate}
                        disabled={generating}
                        className="bg-gold text-obsidian hover:bg-gold/90 font-bold"
                    >
                        {generating ? (
                            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generating...</>
                        ) : (
                            <><Ticket className="h-4 w-4 mr-2" /> Generate {quantity} Ticket(s)</>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
