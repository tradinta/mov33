'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, AlertTriangle, Globe, Coins, Shield, Loader2, Share2, Phone, Megaphone, Lock, FileText, Settings as GearIcon, Palette } from 'lucide-react';
import { toast } from 'sonner';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { PlatformSettings } from '@/context/settings-context'; // Ensure this matches your context export

// Default fallback to prevent undefined errors before fetch
const DEFAULT_SETTINGS: PlatformSettings = {
    platformName: "Mov33",
    supportEmail: "support@mov33.com",
    supportPhone: "+254 700 000000",
    whatsappNumber: "+254 700 000000",
    address: "Nairobi, Kenya",
    contact: {
        address: "Nairobi, Kenya",
        supportPhone: "+254 700 000000",
        supportEmail: "support@mov33.com",
    },
    socials: {
        facebook: "",
        twitter: "",
        instagram: "",
        linkedin: "",
        tiktok: "",
        youtube: "",
    },
    features: {
        newUserRegistration: true,
        emailNotifications: true,
        organizerAutoApproval: false,
        blog: true,
        shop: true,
        tours: true,
        maintenanceMode: false,
    },
    platformFee: 5,
    maxTicketsPerUser: 10,
    pointsPerKsh: 1,
    currency: "KES",
    metaTitleSuffix: "| Mov33",
    privacyUrl: "/privacy",
    termsUrl: "/terms",
};

export default function SettingsPage() {
    const [settings, setSettings] = useState<PlatformSettings>(DEFAULT_SETTINGS);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(firestore, 'platform_settings', 'global');
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Deep merge logic (simple version)
                    const data = docSnap.data();
                    setSettings(prev => ({
                        ...DEFAULT_SETTINGS,
                        ...data,
                        socials: { ...DEFAULT_SETTINGS.socials, ...(data.socials || {}) },
                        features: { ...DEFAULT_SETTINGS.features, ...(data.features || {}) },
                        contact: { ...DEFAULT_SETTINGS.contact, ...(data.contact || {}) },
                    } as PlatformSettings));
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
                toast.error("Failed to load settings.");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const docRef = doc(firestore, 'platform_settings', 'global');
            await setDoc(docRef, settings, { merge: true });
            toast.success("Settings saved successfully");
        } catch (error) {
            console.error("Error saving settings:", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    const updateSocial = (key: keyof PlatformSettings['socials'], value: string) => {
        setSettings(prev => ({
            ...prev,
            socials: { ...prev.socials, [key]: value }
        }));
    };

    const updateFeature = (key: keyof PlatformSettings['features'], value: boolean) => {
        setSettings(prev => ({
            ...prev,
            features: { ...prev.features, [key]: value }
        }));
    };

    const updateContact = (key: keyof PlatformSettings['contact'], value: string) => {
        setSettings(prev => ({
            ...prev,
            contact: { ...prev.contact, [key]: value }
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto animate-in fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">System Settings</h1>
                    <p className="text-zinc-400">Master control panel for platform configuration.</p>
                </div>
                <Button onClick={handleSave} disabled={saving} className="bg-gold text-obsidian font-bold px-8 hover:bg-gold/90 transition-all shadow-lg shadow-gold/10">
                    {saving ? <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</> : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                </Button>
            </div>

            <Tabs defaultValue="general" className="w-full">
                <TabsList className="bg-[#111] border border-white/5 p-1 mb-8 h-auto flex flex-wrap gap-2">
                    <TabsTrigger value="general" className="px-4 py-2 data-[state=active]:bg-gold data-[state=active]:text-obsidian"><Globe className="h-4 w-4 mr-2" /> General</TabsTrigger>
                    <TabsTrigger value="socials" className="px-4 py-2 data-[state=active]:bg-gold data-[state=active]:text-obsidian"><Share2 className="h-4 w-4 mr-2" /> Socials</TabsTrigger>
                    <TabsTrigger value="features" className="px-4 py-2 data-[state=active]:bg-gold data-[state=active]:text-obsidian"><Shield className="h-4 w-4 mr-2" /> Features</TabsTrigger>
                    <TabsTrigger value="business" className="px-4 py-2 data-[state=active]:bg-gold data-[state=active]:text-obsidian"><Coins className="h-4 w-4 mr-2" /> Business</TabsTrigger>
                    <TabsTrigger value="legal" className="px-4 py-2 data-[state=active]:bg-gold data-[state=active]:text-obsidian"><FileText className="h-4 w-4 mr-2" /> Legal & SEO</TabsTrigger>
                    <TabsTrigger value="danger" className="px-4 py-2 data-[state=active]:bg-red-500 data-[state=active]:text-white hover:text-red-400"><AlertTriangle className="h-4 w-4 mr-2" /> Danger Zone</TabsTrigger>
                </TabsList>

                {/* General Tab */}
                <TabsContent value="general" className="space-y-6">
                    <Card className="bg-[#111] border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Globe className="h-5 w-5 text-blue-500" /> Platform Identity</CardTitle>
                            <CardDescription>Basic info displayed in header, footer, and emails.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Platform Name</Label>
                                    <Input value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Support Email</Label>
                                    <Input value={settings.contact.supportEmail} onChange={(e) => updateContact('supportEmail', e.target.value)} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Support Phone (General)</Label>
                                    <Input value={settings.contact.supportPhone} onChange={(e) => updateContact('supportPhone', e.target.value)} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Physical Address</Label>
                                    <Input value={settings.contact.address} onChange={(e) => updateContact('address', e.target.value)} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Socials Tab */}
                <TabsContent value="socials" className="space-y-6">
                    <Card className="bg-[#111] border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Share2 className="h-5 w-5 text-purple-500" /> Social Links</CardTitle>
                            <CardDescription>Links displayed in the footer. Leave empty to hide.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {Object.keys(settings.socials).map((key) => (
                                    <div key={key} className="space-y-2">
                                        <Label className="text-zinc-400 capitalize">{key}</Label>
                                        <Input
                                            value={settings.socials[key as keyof PlatformSettings['socials']]}
                                            onChange={(e) => updateSocial(key as keyof PlatformSettings['socials'], e.target.value)}
                                            className="bg-[#1A1A1A] border-white/10 text-white"
                                            placeholder={`https://${key}.com/...`}
                                        />
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Features Tab */}
                <TabsContent value="features" className="space-y-6">
                    <Card className="bg-[#111] border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Settings as={GearIcon} className="h-5 w-5 text-green-500" /> Feature Flags</CardTitle>
                            <CardDescription>Toggle specific modules on or off.</CardDescription>
                        </CardHeader>
                        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <Label className="text-white">Blog Module</Label>
                                <Switch checked={settings.features.blog} onCheckedChange={(c) => updateFeature('blog', c)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <Label className="text-white">Shop / Merchandise</Label>
                                <Switch checked={settings.features.shop} onCheckedChange={(c) => updateFeature('shop', c)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <Label className="text-white">Tours & Experiences</Label>
                                <Switch checked={settings.features.tours} onCheckedChange={(c) => updateFeature('tours', c)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <Label className="text-white">New User Registration</Label>
                                <Switch checked={settings.features.newUserRegistration} onCheckedChange={(c) => updateFeature('newUserRegistration', c)} />
                            </div>
                            <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                                <Label className="text-white">Review Auto-Approval</Label>
                                <Switch checked={settings.features.organizerAutoApproval} onCheckedChange={(c) => updateFeature('organizerAutoApproval', c)} />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Business Tab */}
                <TabsContent value="business" className="space-y-6">
                    <Card className="bg-[#111] border-gold/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><Coins className="h-5 w-5 text-gold" /> Monetization & Rewards</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Platform Fee (%)</Label>
                                    <Input type="number" value={settings.platformFee} onChange={(e) => setSettings({ ...settings, platformFee: Number(e.target.value) })} className="bg-[#1A1A1A] border-white/10 text-white" />
                                    <p className="text-xs text-zinc-500">Percentage taken from every ticket sale.</p>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Points Per {settings.currency} Spent</Label>
                                    <Input type="number" value={settings.pointsPerKsh} onChange={(e) => setSettings({ ...settings, pointsPerKsh: Number(e.target.value) })} className="bg-[#1A1A1A] border-white/10 text-white" />
                                    <p className="text-xs text-zinc-500">Loyalty rewards calculation factor.</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Legal & SEO Tab */}
                <TabsContent value="legal" className="space-y-6">
                    <Card className="bg-[#111] border-white/5">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><FileText className="h-5 w-5 text-blue-400" /> Links & Metadata</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Terms of Service URL</Label>
                                    <Input value={settings.termsUrl} onChange={(e) => setSettings({ ...settings, termsUrl: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Privacy Policy URL</Label>
                                    <Input value={settings.privacyUrl} onChange={(e) => setSettings({ ...settings, privacyUrl: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Meta Title Suffix</Label>
                                    <Input value={settings.metaTitleSuffix} onChange={(e) => setSettings({ ...settings, metaTitleSuffix: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Danger Zone */}
                <TabsContent value="danger" className="space-y-6">
                    <Card className="bg-[#111] border-red-500/20">
                        <CardHeader>
                            <CardTitle className="text-white flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Critical Controls</CardTitle>
                            <CardDescription>Exercise extreme caution with these settings.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between p-4 bg-red-500/10 rounded-lg border border-red-500/20">
                                <div>
                                    <Label className="text-red-400 font-bold text-lg">Maintenance Mode</Label>
                                    <p className="text-zinc-400 text-sm">Disables the public site for all non-admin users.</p>
                                </div>
                                <Switch checked={settings.features.maintenanceMode} onCheckedChange={(c) => updateFeature('maintenanceMode', c)} className="data-[state=checked]:bg-red-500" />
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

            </Tabs>
        </div>
    );
}
