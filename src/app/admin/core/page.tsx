'use client';

import React from 'react';
import Link from 'next/link';
import {
    Ticket,
    Users,
    MessageCircle,
    Flag,
    TrendingUp,
    Settings,
    Shield,
    Plus,
    ArrowRight,
    Sparkles,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const quickActions = [
    {
        title: 'Review Events',
        description: 'Check pending event submissions',
        href: '/admin/events',
        icon: Ticket,
        color: 'bg-gold/10 text-gold border-gold/20',
        iconBg: 'bg-gold/20'
    },
    {
        title: 'Support Tickets',
        description: 'Respond to user inquiries',
        href: '/admin/support',
        icon: MessageCircle,
        color: 'bg-kenyan-green/10 text-kenyan-green border-kenyan-green/20',
        iconBg: 'bg-kenyan-green/20'
    },
    {
        title: 'User Reports',
        description: 'Handle flagged content',
        href: '/admin/reports',
        icon: Flag,
        color: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
        iconBg: 'bg-yellow-500/20'
    },
    {
        title: 'View Analytics',
        description: 'Platform performance metrics',
        href: '/admin/analytics',
        icon: TrendingUp,
        color: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        iconBg: 'bg-blue-500/20'
    },
    {
        title: 'User Directory',
        description: 'Browse platform users',
        href: '/admin/users',
        icon: Users,
        color: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        iconBg: 'bg-purple-500/20'
    },
    {
        title: 'Platform Settings',
        description: 'System configuration',
        href: '/admin/settings',
        icon: Settings,
        color: 'bg-white/5 text-white/60 border-white/10',
        iconBg: 'bg-white/10'
    }
];

const shortcuts = [
    { label: 'Create Event', href: '/organizer/events/new', icon: Plus },
    { label: 'View Live Site', href: '/', icon: Zap },
];

export default function AdminCorePage() {
    return (
        <div className="space-y-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-10 w-10 rounded-2xl bg-gold/20 flex items-center justify-center">
                            <Sparkles className="h-5 w-5 text-gold" />
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tighter">Staff Core</h1>
                    </div>
                    <p className="text-muted-foreground">Quick access to essential staff actions.</p>
                </div>
                <div className="flex gap-2">
                    {shortcuts.map((s) => (
                        <Button
                            key={s.label}
                            asChild
                            variant="outline"
                            className="border-white/10 hover:border-gold/30 hover:bg-gold/10 hover:text-gold"
                        >
                            <Link href={s.href}>
                                <s.icon className="h-4 w-4 mr-2" />
                                {s.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {quickActions.map((action, idx) => (
                    <motion.div
                        key={action.href}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                    >
                        <Link href={action.href}>
                            <GlassCard className={cn(
                                "group p-8 border transition-all duration-300 hover:scale-[1.02] cursor-pointer",
                                action.color
                            )}>
                                <div className="flex items-start justify-between">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", action.iconBg)}>
                                        <action.icon className="h-7 w-7" />
                                    </div>
                                    <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="mt-6">
                                    <h3 className="text-xl font-black">{action.title}</h3>
                                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                                </div>
                            </GlassCard>
                        </Link>
                    </motion.div>
                ))}
            </div>

            {/* Info Banner */}
            <GlassCard className="p-8 border-white/5 bg-gradient-to-r from-gold/5 to-transparent">
                <div className="flex items-center gap-6">
                    <div className="h-16 w-16 rounded-3xl bg-gold/20 flex items-center justify-center">
                        <Shield className="h-8 w-8 text-gold" />
                    </div>
                    <div className="flex-1">
                        <h3 className="text-xl font-black">Staff Access Level</h3>
                        <p className="text-muted-foreground mt-1">
                            Your actions are logged for security purposes. Please handle user data responsibly.
                        </p>
                    </div>
                    <Button variant="outline" className="border-gold/30 text-gold hover:bg-gold/10">
                        View Guidelines
                    </Button>
                </div>
            </GlassCard>
        </div>
    );
}
