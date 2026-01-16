'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Save, AlertTriangle, Globe, Mail, Shield, Palette, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [settings, setSettings] = useState({
        platformName: 'mov33',
        supportEmail: 'support@mov33.com',
        maintenanceMode: false,
        newUserRegistration: true,
        emailNotifications: true,
        organizerAutoApproval: false,
        platformFee: 5,
        maxTicketsPerUser: 10,
    });

    const [saving, setSaving] = useState(false);

    const handleSave = async () => {
        setSaving(true);
        // In a real app, this would save to Firestore 'platform_settings' collection
        await new Promise(r => setTimeout(r, 1000));
        toast.success("Settings saved successfully");
        setSaving(false);
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in">
            <div>
                <h1 className="text-3xl font-bold text-white">System Settings</h1>
                <p className="text-zinc-400">Configure platform-wide settings and preferences.</p>
            </div>

            {/* General */}
            <Card className="bg-[#111] border-white/5">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2"><Globe className="h-5 w-5 text-blue-500" /> General</CardTitle>
                    <CardDescription>Basic platform configuration.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Platform Name</Label>
                            <Input value={settings.platformName} onChange={(e) => setSettings({ ...settings, platformName: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Support Email</Label>
                            <Input value={settings.supportEmail} onChange={(e) => setSettings({ ...settings, supportEmail: e.target.value })} className="bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Feature Toggles */}
            <Card className="bg-[#111] border-white/5">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2"><Shield className="h-5 w-5 text-green-500" /> Feature Toggles</CardTitle>
                    <CardDescription>Enable or disable platform features.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-white">New User Registration</Label>
                            <p className="text-zinc-500 text-sm">Allow new users to sign up.</p>
                        </div>
                        <Switch checked={settings.newUserRegistration} onCheckedChange={(c) => setSettings({ ...settings, newUserRegistration: c })} />
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-white">Email Notifications</Label>
                            <p className="text-zinc-500 text-sm">Send transactional emails.</p>
                        </div>
                        <Switch checked={settings.emailNotifications} onCheckedChange={(c) => setSettings({ ...settings, emailNotifications: c })} />
                    </div>
                    <Separator className="bg-white/5" />
                    <div className="flex items-center justify-between">
                        <div>
                            <Label className="text-white">Auto-Approve Organizers</Label>
                            <p className="text-zinc-500 text-sm">Skip manual verification for new organizers.</p>
                        </div>
                        <Switch checked={settings.organizerAutoApproval} onCheckedChange={(c) => setSettings({ ...settings, organizerAutoApproval: c })} />
                    </div>
                </CardContent>
            </Card>

            {/* Business Settings */}
            <Card className="bg-[#111] border-white/5">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2"><Mail className="h-5 w-5 text-gold" /> Business</CardTitle>
                    <CardDescription>Platform fees and limits.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Platform Fee (%)</Label>
                            <Input type="number" value={settings.platformFee} onChange={(e) => setSettings({ ...settings, platformFee: Number(e.target.value) })} className="bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Max Tickets Per User</Label>
                            <Input type="number" value={settings.maxTicketsPerUser} onChange={(e) => setSettings({ ...settings, maxTicketsPerUser: Number(e.target.value) })} className="bg-[#1A1A1A] border-white/10 text-white" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Maintenance Mode */}
            <Card className="bg-[#111] border-red-500/20">
                <CardHeader>
                    <CardTitle className="text-white flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-red-500" /> Danger Zone</CardTitle>
                    <CardDescription>Critical platform controls.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                        <div>
                            <Label className="text-red-400 font-bold">Maintenance Mode</Label>
                            <p className="text-zinc-500 text-sm">Temporarily disable the platform for all users.</p>
                        </div>
                        <Switch checked={settings.maintenanceMode} onCheckedChange={(c) => setSettings({ ...settings, maintenanceMode: c })} className="data-[state=checked]:bg-red-500" />
                    </div>
                </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
                <Button onClick={handleSave} disabled={saving} className="bg-gold text-black font-bold px-8">
                    {saving ? 'Saving...' : <><Save className="h-4 w-4 mr-2" /> Save Changes</>}
                </Button>
            </div>
        </div>
    );
}
