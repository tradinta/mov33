'use client';

import React, { ReactNode } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Zap, ShieldCheck, CreditCard, Users, MessageSquare, ChevronRight, Play, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

import { GuideItem } from '@/lib/types';

export default function GuidePage() {
    const guides: GuideItem[] = [
        {
            icon: <Zap className="h-5 w-5 text-gold" />,
            title: "Quick Start: Launching Events",
            description: "Go from concept to ticket sales in under 5 minutes.",
            steps: [
                "Configure your organization profile with business details.",
                "Create a new event listing with high-quality media.",
                "Set up ticket tiers (Early Bird, Regular, VIP).",
                "Publish and share your unique tracking link."
            ]
        },
        {
            icon: <ShieldCheck className="h-5 w-5 text-kenyan-green" />,
            title: "Access Control & Verification",
            description: "Secure your gates with our robust QR scanning system.",
            steps: [
                "Download the Mov33 Scanner App for stewards.",
                "Sync live attendance data for real-time guest lists.",
                "Handle manual check-ins via the Attendance tab.",
                "Export final attendance reports for post-event analysis."
            ]
        },
        {
            icon: <CreditCard className="h-5 w-5 text-gold" />,
            title: "Financials & M-Pesa Payouts",
            description: "Understand our settlement cycles and payout structure.",
            steps: [
                "Revenue clears 48 hours after ticket purchase.",
                "Request payouts via M-Pesa at any time (KES 1,000 minimum).",
                "View transparent fee breakdowns for every transaction.",
                "Download KRA-compliant financial statements."
            ]
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black font-headline uppercase tracking-tighter text-white">Knowledge Base</h1>
                    <p className="text-muted-foreground font-poppins text-sm">Master the Mov33 ecosystem and scale your event impact.</p>
                </div>
                <Button variant="outline" className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl h-12">
                    <MessageSquare className="mr-2 h-4 w-4 text-gold" /> Contact Partner Support
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {guides.map((guide, i) => (
                    <Card key={i} className="bg-white/5 border-white/10 backdrop-blur-md group hover:border-gold/20 transition-all">
                        <CardHeader>
                            <div className="h-10 w-10 rounded-lg bg-white/5 flex items-center justify-center mb-2">
                                {guide.icon}
                            </div>
                            <CardTitle className="text-sm font-black uppercase tracking-tight text-white/90">{guide.title}</CardTitle>
                            <CardDescription className="text-[10px] font-poppins leading-relaxed">{guide.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="space-y-2">
                                {guide.steps.map((step, si) => (
                                    <li key={si} className="flex gap-2 text-[10px] text-muted-foreground font-poppins">
                                        <ChevronRight className="h-3 w-3 text-gold flex-shrink-0 mt-0.5" />
                                        {step}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="bg-white/5 border-white/10 backdrop-blur-md border-t-gold/20">
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-tight flex items-center gap-2">
                            <BookOpen className="h-5 w-5 text-gold" /> Frequently Asked Questions
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Accordion type="single" collapsible className="w-full">
                            <AccordionItem value="item-1" className="border-white/5">
                                <AccordionTrigger className="text-xs font-bold uppercase tracking-wide hover:text-gold">Which payment methods are supported?</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground font-poppins">
                                    We primarily support M-Pesa (Direct & STK Push) for consumers. International cards (Visa/Mastercard) are supported via our secure payment gateway.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-2" className="border-white/5">
                                <AccordionTrigger className="text-xs font-bold uppercase tracking-wide hover:text-gold">How do I handle ticket refunds?</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground font-poppins">
                                    Refund policies are set by organizers. If approved, refunds can be initiated via our support portal and are typically processed back to the original payment method.
                                </AccordionContent>
                            </AccordionItem>
                            <AccordionItem value="item-3" className="border-white/5">
                                <AccordionTrigger className="text-xs font-bold uppercase tracking-wide hover:text-gold">What are the platform commission fees?</AccordionTrigger>
                                <AccordionContent className="text-xs text-muted-foreground font-poppins">
                                    Our standard platform fee is 5% per ticket sold, plus a small transaction processing fee based on the chosen payment method.
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </CardContent>
                </Card>

                <Card className="bg-gold/5 border-gold/20 backdrop-blur-md relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
                        <Sparkles className="h-24 w-24 text-gold" />
                    </div>
                    <CardHeader>
                        <CardTitle className="text-lg font-black uppercase tracking-tight text-white">AI Event Genius</CardTitle>
                        <CardDescription className="text-xs font-poppins text-white/60">
                            Our LLM-powered assistant can help you write catchy event descriptions and optimize ticket pricing.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="space-y-4">
                            <div className="bg-obsidian/80 p-4 rounded-xl border border-white/5 text-[10px] font-poppins italic text-muted-foreground">
                                "Try: Help me write a description for a Kenyan Hip Hop concert in Westlands..."
                            </div>
                            <Button className="w-full bg-gold hover:bg-gold/90 text-obsidian font-black rounded-xl h-12 shadow-xl border-none">
                                Launch AI Assistant
                            </Button>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-gold cursor-pointer">
                            <Play className="h-3 w-3 fill-gold" /> Watch Masterclass Video
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
