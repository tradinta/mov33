
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function SettingsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Toggle critical platform features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="vip-access" className="flex flex-col space-y-1">
                        <span>VIP Access Feature</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Enable exclusive VIP events and perks.
                        </span>
                    </Label>
                    <Switch id="vip-access" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="payout-holds" className="flex flex-col space-y-1">
                        <span>Automatic Payouts</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                           Process organizer payouts automatically.
                        </span>
                    </Label>
                    <Switch id="payout-holds" defaultChecked />
                </div>
                 <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="new-signups" className="flex flex-col space-y-1">
                        <span>New Organizer Signups</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                           Allow new organizers to register.
                        </span>
                    </Label>
                    <Switch id="new-signups" />
                </div>
            </CardContent>
        </Card>
    );
}
