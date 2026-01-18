'use client';

import React, { useState, useEffect } from 'react';
import {
    Settings,
    Save,
    Loader2,
    Globe,
    Phone,
    Mail,
    MessageCircle,
    DollarSign,
    Percent,
    Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/auth-context';
import { firestore } from '@/firebase';
import { doc, getDoc, setDoc, Timestamp } from 'firebase/firestore';
import { GlassCard } from '@/components/ui/glass-card';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';

interface PlatformSettings {
    siteName: string;
    supportEmail: string;
    supportPhone: string;
    whatsappNumber: string;
    platformFeePercent: number;
    maintenanceMode: boolean;
    allowNewRegistrations: boolean;
    requireEmailVerification: boolean;
    footerText: string;
    updatedAt?: Timestamp;
    updatedBy?: string;
}

const defaultSettings: PlatformSettings = {
    siteName: 'Mov33',
    supportEmail: 'support@mov33.co.ke',
    supportPhone: '+254 700 000 000',
    whatsappNumber: '+254700000000',
    platformFeePercent: 5,
    maintenanceMode: false,
    allowNewRegistrations: true,
    requireEmailVerification: true,
    footerText: '© 2026 Mov33. All rights reserved.',
};

export default function AdminSettingsPage() {
    const { user, profile } = useAuth();
    const { toast } = useToast();
    const [settings, setSettings] = useState<PlatformSettings>(defaultSettings);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const isAuthorized = profile?.role === 'admin' || profile?.role === 'super-admin';

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(firestore, 'platform', 'settings');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings({ ...defaultSettings, ...docSnap.data() } as PlatformSettings);
                }
            } catch (error) {
                console.error('Error fetching settings:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const saveSettings = async () => {
        if (!user) return;
        setSaving(true);

        try {
            await setDoc(doc(firestore, 'platform', 'settings'), {
                ...settings,
                updatedAt: Timestamp.now(),
                updatedBy: user.uid
            });
            toast({
                title: 'Settings Saved',
                description: 'Platform settings have been updated successfully.',
            });
        } catch (error) {
            console.error('Error saving settings:', error);
            toast({
                title: 'Error',
                description: 'Failed to save settings. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setSaving(false);
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GlassCard className="p-12 text-center border-red-500/30">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
                    <h2 className="text-2xl font-black">Access Denied</h2>
                    <p className="text-muted-foreground mt-2">
                        Only admins can access platform settings.
                    </p>
                </GlassCard>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-4xl">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black uppercase tracking-tighter">Settings</h1>
                    <p className="text-muted-foreground mt-2">Configure platform-wide settings.</p>
                </div>
                <Button
                    onClick={saveSettings}
                    disabled={saving}
                    className="bg-gold hover:bg-gold/90 text-obsidian"
                >
                    {saving ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="h-4 w-4 mr-2" />
                    )}
                    Save Changes
                </Button>
            </div>

            {/* General Settings */}
            <GlassCard className="p-8 border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Globe className="h-5 w-5 text-gold" />
                    General
                </h2>
                <div className="grid gap-6">
                    <div>
                        <Label>Site Name</Label>
                        <Input
                            value={settings.siteName}
                            onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                            className="mt-2 bg-white/5 border-white/10"
                        />
                    </div>
                    <div>
                        <Label>Footer Text</Label>
                        <Textarea
                            value={settings.footerText}
                            onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                            className="mt-2 bg-white/5 border-white/10"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Contact Settings */}
            <GlassCard className="p-8 border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <MessageCircle className="h-5 w-5 text-kenyan-green" />
                    Contact & Support
                </h2>
                <div className="grid gap-6 md:grid-cols-2">
                    <div>
                        <Label className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Support Email
                        </Label>
                        <Input
                            value={settings.supportEmail}
                            onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })}
                            className="mt-2 bg-white/5 border-white/10"
                        />
                    </div>
                    <div>
                        <Label className="flex items-center gap-2">
                            <Phone className="h-4 w-4" /> Support Phone
                        </Label>
                        <Input
                            value={settings.supportPhone}
                            onChange={(e) => setSettings({ ...settings, supportPhone: e.target.value })}
                            className="mt-2 bg-white/5 border-white/10"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <Label className="flex items-center gap-2">
                            <MessageCircle className="h-4 w-4" /> WhatsApp Number (for support widget)
                        </Label>
                        <Input
                            value={settings.whatsappNumber}
                            onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                            placeholder="+254700000000"
                            className="mt-2 bg-white/5 border-white/10"
                        />
                    </div>
                </div>
            </GlassCard>

            {/* Business Settings */}
            <GlassCard className="p-8 border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-gold" />
                    Business
                </h2>
                <div className="grid gap-6">
                    <div className="max-w-xs">
                        <Label className="flex items-center gap-2">
                            <Percent className="h-4 w-4" /> Platform Fee (%)
                        </Label>
                        <Input
                            type="number"
                            value={settings.platformFeePercent}
                            onChange={(e) => setSettings({ ...settings, platformFeePercent: Number(e.target.value) })}
                            className="mt-2 bg-white/5 border-white/10"
                            min={0}
                            max={100}
                        />
                        <p className="text-xs text-muted-foreground mt-2">
                            Percentage deducted from organizer payouts.
                        </p>
                    </div>
                </div>
            </GlassCard>

            {/* System Settings */}
            <GlassCard className="p-8 border-white/5">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="h-5 w-5 text-blue-400" />
                    System
                </h2>
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Maintenance Mode</Label>
                            <p className="text-xs text-muted-foreground">
                                Disable public access temporarily.
                            </p>
                        </div>
                        <Switch
                            checked={settings.maintenanceMode}
                            onCheckedChange={(c) => setSettings({ ...settings, maintenanceMode: c })}
                        />
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Allow New Registrations</Label>
                            <p className="text-xs text-muted-foreground">
                                Let new users create accounts.
                            </p>
                        </div>
                        <Switch
                            checked={settings.allowNewRegistrations}
                            onCheckedChange={(c) => setSettings({ ...settings, allowNewRegistrations: c })}
                        />
                    </div>
                    <Separator className="bg-white/10" />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label>Require Email Verification</Label>
                            <p className="text-xs text-muted-foreground">
                                Users must verify email before full access.
                            </p>
                        </div>
                        <Switch
                            checked={settings.requireEmailVerification}
                            onCheckedChange={(c) => setSettings({ ...settings, requireEmailVerification: c })}
                        />
                    </div>
                </div>
            </GlassCard>
        </div>
    );
}
