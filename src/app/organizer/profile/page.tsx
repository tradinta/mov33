'use client';

import React, { useState, useEffect, ChangeEvent } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Phone, MapPin, Globe, Camera, Save, Loader2, Landmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from '@/context/auth-context';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { UserProfile } from '@/lib/types';
import { StandaloneImageUploader } from '@/components/ui/standalone-image-uploader';

export default function ProfilePage() {
    const { profile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        displayName: '',
        bio: '',
        phoneNumber: '',
        location: '',
        website: '',
        businessRegistration: '',
        photoURL: ''
    });

    useEffect(() => {
        if (profile) {
            setFormData({
                displayName: profile.displayName || '',
                bio: profile.bio || '',
                phoneNumber: profile.phoneNumber || '',
                location: profile.location || '',
                website: profile.website || '',
                businessRegistration: profile.businessRegistration || '',
                photoURL: profile.photoURL || ''
            });
        }
    }, [profile]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        // The current implementation uses inline state updates in the render method,
        // but let's keep this handler typed for future use or cleanup.
        setFormData(prev => ({ ...prev, [id]: value }));
    };

    const handleSave = async () => {
        if (!profile?.uid) return;
        setLoading(true);
        try {
            await updateDoc(doc(firestore, 'users', profile.uid), {
                ...formData,
                updatedAt: serverTimestamp()
            });
            toast({
                title: "Profile Updated",
                description: "Your brand identity has been saved successfully."
            });
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: "Update Failed",
                description: "There was an error saving your changes. Please try again."
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">Brand Identity</h1>
                    <p className="text-muted-foreground font-poppins text-sm">Customize how your brand appears across the platform.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="bg-gold hover:bg-gold/90 text-obsidian font-bold h-12 px-8 rounded-xl"
                >
                    {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
                <Card className="md:col-span-1 bg-white/5 border-white/10 backdrop-blur-md h-fit">
                    <CardHeader className="text-center pt-8">
                        <div className="mx-auto w-32 h-32 mb-6">
                            <StandaloneImageUploader
                                currentImageUrl={formData.photoURL}
                                onUpload={(url) => setFormData({ ...formData, photoURL: url })}
                                onRemove={() => setFormData({ ...formData, photoURL: '' })}
                                label="Brand Logo"
                                className="w-full h-full"
                            />
                        </div>
                        <CardTitle className="text-xl font-black uppercase tracking-tight text-white">{formData.displayName || profile?.displayName || 'Your Brand'}</CardTitle>
                        <CardDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-gold mt-2 bg-gold/10 py-1 px-3 rounded-full w-fit mx-auto border border-gold/20">
                            Pro Organizer
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-4 border-t border-white/5">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <Mail className="h-4 w-4 text-gold/50" />
                            {profile?.email}
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                            <Landmark className="h-4 w-4 text-gold/50" />
                            Joined {profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString() : '2024'}
                        </div>
                    </CardContent>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Public Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-2">
                                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Organization Name</Label>
                                <Input
                                    className="bg-white/5 border-white/10 h-12 font-bold"
                                    value={formData.displayName}
                                    onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Brand Bio / Description</Label>
                                <Textarea
                                    className="bg-white/5 border-white/10 min-h-[120px] font-poppins text-sm"
                                    placeholder="Tell your audience about your events..."
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Official Website</Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 bg-white/5 border-white/10 h-12 font-poppins text-xs"
                                            placeholder="https://yourbrand.com"
                                            value={formData.website}
                                            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Primary Location</Label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 bg-white/5 border-white/10 h-12 font-poppins text-xs"
                                            placeholder="Nairobi, Kenya"
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/5 border-white/10 backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Contact & Legal</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Business Phone (M-Pesa)</Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 bg-white/5 border-white/10 h-12 font-poppins text-xs"
                                            placeholder="+254 7XX XXX XXX"
                                            value={formData.phoneNumber}
                                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                        />
                                    </div>
                                </div>
                                <div className="grid gap-2">
                                    <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Business Reg Number</Label>
                                    <div className="relative">
                                        <Landmark className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            className="pl-10 bg-white/5 border-white/10 h-12 font-poppins text-xs"
                                            placeholder="BN/202X/XXXXXX"
                                            value={formData.businessRegistration}
                                            onChange={(e) => setFormData({ ...formData, businessRegistration: e.target.value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
