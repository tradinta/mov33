'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Rocket, Megaphone, Zap, UserPlus, MousePointerClick, MessageSquare, Sparkles, Palette } from 'lucide-react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';

const DEFAULT_CONFIG = {
    exitIntent: {
        enabled: true,
        discountCode: "MOV33VIBE",
        urgencyMinutes: 15,
        message: "Wait! Get 15% off your first ticket if you book in the next 15 minutes."
    },
    fomoBar: {
        enabled: true,
        message: "Flash Sale: 20% off all upcoming concerts!",
        couponCode: "CONCERT20",
        expiryDate: new Date(Date.now() + 86400000 * 2).toISOString()
    },
    unlockDeal: {
        enabled: true,
        couponCode: "SECRET25"
    },
    welcomeBanner: {
        enabled: true,
        message: "Welcome back to the vibe! We've found some events you'll love."
    },
    ghostLead: {
        enabled: true,
        saveDelayMs: 2000
    },
    onboarding: {
        vibeCheckEnabled: true
    },
    aesthetics: {
        glassHeaderEnabled: true,
        scrollProgressEnabled: true
    }
};

export default function MarketingDashboard() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [config, setConfig] = useState(DEFAULT_CONFIG);

    useEffect(() => {
        const fetchConfig = async () => {
            try {
                const docRef = doc(firestore, 'marketing_config', 'global');
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setConfig({ ...DEFAULT_CONFIG, ...docSnap.data() });
                } else {
                    // Initialize if it doesn't exist
                    await setDoc(docRef, DEFAULT_CONFIG);
                    setConfig(DEFAULT_CONFIG);
                }
            } catch (error) {
                console.error("Error fetching marketing config:", error);
                toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to load marketing configuration."
                });
            } finally {
                setLoading(false);
            }
        };

        fetchConfig();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(firestore, 'marketing_config', 'global'), config);
            toast({
                title: "Success",
                description: "Marketing configuration updated successfully."
            });
        } catch (error) {
            console.error("Error saving marketing config:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save configuration."
            });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="h-8 w-8 animate-spin text-gold" />
            </div>
        );
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-700">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Marketing & Conversion</h1>
                    <p className="text-zinc-400">Control the "Brain" of your platform's engagement engine.</p>
                </div>
                <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-gold text-obsidian font-bold hover:bg-gold/90 h-11 px-6 gap-2"
                >
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Exit-Intent Popup */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <MousePointerClick className="h-32 w-32 text-gold" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Rocket className="h-5 w-5 text-gold" />
                                <CardTitle className="text-white">Exit-Intent Popup</CardTitle>
                            </div>
                            <Switch
                                checked={config.exitIntent.enabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    exitIntent: { ...config.exitIntent, enabled: checked }
                                })}
                            />
                        </div>
                        <CardDescription className="text-zinc-500 italic">Triggers when users attempt to leave the site.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500">Discount Code</Label>
                            <Input
                                value={config.exitIntent.discountCode}
                                onChange={(e) => setConfig({
                                    ...config,
                                    exitIntent: { ...config.exitIntent, discountCode: e.target.value }
                                })}
                                className="bg-[#1a1a1a] border-white/5"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500">Popup Message</Label>
                            <Input
                                value={config.exitIntent.message}
                                onChange={(e) => setConfig({
                                    ...config,
                                    exitIntent: { ...config.exitIntent, message: e.target.value }
                                })}
                                className="bg-[#1a1a1a] border-white/5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* FOMO Bar */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <Zap className="h-32 w-32 text-orange-500" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Megaphone className="h-5 w-5 text-orange-500" />
                                <CardTitle className="text-white">Sticky FOMO Bar</CardTitle>
                            </div>
                            <Switch
                                checked={config.fomoBar.enabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    fomoBar: { ...config.fomoBar, enabled: checked }
                                })}
                            />
                        </div>
                        <CardDescription className="text-zinc-500 italic">Global urgency banner at the top of the screen.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500">Banner Message</Label>
                            <Input
                                value={config.fomoBar.message}
                                onChange={(e) => setConfig({
                                    ...config,
                                    fomoBar: { ...config.fomoBar, message: e.target.value }
                                })}
                                className="bg-[#1a1a1a] border-white/5"
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-zinc-500">Coupon Code</Label>
                                <Input
                                    value={config.fomoBar.couponCode}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        fomoBar: { ...config.fomoBar, couponCode: e.target.value }
                                    })}
                                    className="bg-[#1a1a1a] border-white/5"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase text-zinc-500">Expiry Date</Label>
                                <Input
                                    type="datetime-local"
                                    value={config.fomoBar.expiryDate.split('.')[0]}
                                    onChange={(e) => setConfig({
                                        ...config,
                                        fomoBar: { ...config.fomoBar, expiryDate: new Date(e.target.value).toISOString() }
                                    })}
                                    className="bg-[#1a1a1a] border-white/5"
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gamified Unlock */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <Zap className="h-32 w-32 text-kenyan-green" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Zap className="h-5 w-5 text-kenyan-green" />
                                <CardTitle className="text-white">Gamified Unlock</CardTitle>
                            </div>
                            <Switch
                                checked={config.unlockDeal.enabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    unlockDeal: { ...config.unlockDeal, enabled: checked }
                                })}
                            />
                        </div>
                        <CardDescription className="text-zinc-500 italic">Interactive "Click to reveal" deals on event cards.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500">Global Unlock Code</Label>
                            <Input
                                value={config.unlockDeal.couponCode}
                                onChange={(e) => setConfig({
                                    ...config,
                                    unlockDeal: { ...config.unlockDeal, couponCode: e.target.value }
                                })}
                                className="bg-[#1a1a1a] border-white/5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Ghost Lead Capture */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <UserPlus className="h-32 w-32 text-blue-500" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <UserPlus className="h-5 w-5 text-blue-500" />
                                <CardTitle className="text-white">Ghost Lead Capture</CardTitle>
                            </div>
                            <Switch
                                checked={config.ghostLead.enabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    ghostLead: { ...config.ghostLead, enabled: checked }
                                })}
                            />
                        </div>
                        <CardDescription className="text-zinc-500 italic">Auto-saves partial checkouts for recovery.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500">Save Delay (ms)</Label>
                            <Input
                                type="number"
                                value={config.ghostLead.saveDelayMs}
                                onChange={(e) => setConfig({
                                    ...config,
                                    ghostLead: { ...config.ghostLead, saveDelayMs: parseInt(e.target.value) }
                                })}
                                className="bg-[#1a1a1a] border-white/5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Welcome Banner */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <MessageSquare className="h-32 w-32 text-white" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-white" />
                                <CardTitle className="text-white">Welcome Banner</CardTitle>
                            </div>
                            <Switch
                                checked={config.welcomeBanner.enabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    welcomeBanner: { ...config.welcomeBanner, enabled: checked }
                                })}
                            />
                        </div>
                        <CardDescription className="text-zinc-500 italic">Greeting message for returning registered users.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <Label className="text-xs font-bold uppercase text-zinc-500">Banner Message</Label>
                            <Input
                                value={config.welcomeBanner.message}
                                onChange={(e) => setConfig({
                                    ...config,
                                    welcomeBanner: { ...config.welcomeBanner, message: e.target.value }
                                })}
                                className="bg-[#1a1a1a] border-white/5"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Onboarding & Personalization */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <Sparkles className="h-32 w-32 text-purple-500" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Sparkles className="h-5 w-5 text-purple-500" />
                                <CardTitle className="text-white">Vibe Check Wizard</CardTitle>
                            </div>
                            <Switch
                                checked={config.onboarding.vibeCheckEnabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    onboarding: { ...config.onboarding, vibeCheckEnabled: checked }
                                })}
                            />
                        </div>
                        <CardDescription className="text-zinc-500 italic">Mandatory vibe-matching onboarding for new users.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p className="text-xs text-zinc-600">When enabled, new users must complete the vibe discovery flow to access their personalized feed.</p>
                    </CardContent>
                </Card>

                {/* Premium Aesthetics */}
                <Card className="bg-[#111] border-white/5 relative overflow-hidden group">
                    <div className="absolute -right-4 -top-4 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                        <Palette className="h-32 w-32 text-blue-400" />
                    </div>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Palette className="h-5 w-5 text-blue-400" />
                                <CardTitle className="text-white">Premium Aesthetics</CardTitle>
                            </div>
                        </div>
                        <CardDescription className="text-zinc-500 italic">Control the visual "WOW" factors of the platform.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium text-white">Dynamic Glass Header</Label>
                                <p className="text-[10px] text-zinc-500">Enable scroll-based blur & transparency transitions.</p>
                            </div>
                            <Switch
                                checked={config.aesthetics.glassHeaderEnabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    aesthetics: { ...config.aesthetics, glassHeaderEnabled: checked }
                                })}
                            />
                        </div>
                        <div className="flex items-center justify-between border-t border-white/5 pt-4">
                            <div className="space-y-0.5">
                                <Label className="text-sm font-medium text-white">Scroll Progress Indicator</Label>
                                <p className="text-[10px] text-zinc-500">Show the gold progress bar at the top of the viewport.</p>
                            </div>
                            <Switch
                                checked={config.aesthetics.scrollProgressEnabled}
                                onCheckedChange={(checked) => setConfig({
                                    ...config,
                                    aesthetics: { ...config.aesthetics, scrollProgressEnabled: checked }
                                })}
                            />
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="bg-[#111] border border-gold/20 rounded-xl p-6 flex items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                        <Zap className="h-6 w-6" />
                    </div>
                    <div>
                        <h4 className="font-bold text-white uppercase italic tracking-tighter">Live Deployment</h4>
                        <p className="text-zinc-500 text-sm">Changes take effect globally on the next page refresh.</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-black uppercase text-green-500 tracking-widest">Connected to Firebase</span>
                </div>
            </div>
        </div>
    );
}
