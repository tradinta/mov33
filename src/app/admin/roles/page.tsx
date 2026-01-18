'use client';

import React from 'react';
import {
    Shield,
    Users,
    Eye,
    Edit,
    Trash2,
    MessageCircle,
    Settings,
    Ticket,
    CheckCircle2,
    XCircle,
    Crown
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

interface RolePermission {
    name: string;
    description: string;
    permissions: {
        users: 'none' | 'read' | 'write';
        events: 'none' | 'read' | 'write';
        support: 'none' | 'read' | 'write';
        reports: 'none' | 'read' | 'write';
        settings: 'none' | 'read' | 'write';
        staff: 'none' | 'read' | 'write';
    };
    color: string;
    icon: React.ElementType;
}

const roles: RolePermission[] = [
    {
        name: 'super-admin',
        description: 'Full platform access with unrestricted permissions.',
        permissions: { users: 'write', events: 'write', support: 'write', reports: 'write', settings: 'write', staff: 'write' },
        color: 'bg-red-500/20 text-red-400 border-red-500/30',
        icon: Crown
    },
    {
        name: 'admin',
        description: 'Platform management with most permissions except super-admin features.',
        permissions: { users: 'write', events: 'write', support: 'write', reports: 'write', settings: 'read', staff: 'write' },
        color: 'bg-gold/20 text-gold border-gold/30',
        icon: Shield
    },
    {
        name: 'moderator',
        description: 'Content moderation and user support. No critical system access.',
        permissions: { users: 'read', events: 'read', support: 'write', reports: 'write', settings: 'none', staff: 'none' },
        color: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
        icon: MessageCircle
    },
    {
        name: 'organizer',
        description: 'Event creators with access to organizer dashboard.',
        permissions: { users: 'none', events: 'write', support: 'read', reports: 'none', settings: 'none', staff: 'none' },
        color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
        icon: Ticket
    },
    {
        name: 'user',
        description: 'Standard platform user with basic access.',
        permissions: { users: 'none', events: 'read', support: 'read', reports: 'none', settings: 'none', staff: 'none' },
        color: 'bg-white/10 text-white/60 border-white/20',
        icon: Users
    }
];

const permissionLabels = {
    users: { label: 'Users', icon: Users },
    events: { label: 'Events', icon: Ticket },
    support: { label: 'Support', icon: MessageCircle },
    reports: { label: 'Reports', icon: Shield },
    settings: { label: 'Settings', icon: Settings },
    staff: { label: 'Staff', icon: Crown }
};

export default function AdminRolesPage() {
    const { profile } = useAuth();
    const isAdmin = profile?.role === 'admin' || profile?.role === 'super-admin';

    const getPermissionBadge = (level: 'none' | 'read' | 'write') => {
        switch (level) {
            case 'write':
                return (
                    <Badge className="bg-kenyan-green/20 text-kenyan-green border-kenyan-green/30 text-[9px]">
                        <Edit className="h-3 w-3 mr-1" /> Full
                    </Badge>
                );
            case 'read':
                return (
                    <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-[9px]">
                        <Eye className="h-3 w-3 mr-1" /> Read
                    </Badge>
                );
            default:
                return (
                    <Badge className="bg-white/5 text-white/30 border-white/10 text-[9px]">
                        <XCircle className="h-3 w-3 mr-1" /> None
                    </Badge>
                );
        }
    };

    if (!isAdmin) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <GlassCard className="p-12 text-center border-red-500/30">
                    <Shield className="h-16 w-16 mx-auto mb-4 text-red-400" />
                    <h2 className="text-2xl font-black">Access Denied</h2>
                    <p className="text-muted-foreground mt-2">
                        Only admins can view role definitions.
                    </p>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black uppercase tracking-tighter">System Roles</h1>
                <p className="text-muted-foreground mt-2">Platform role definitions and permission matrix.</p>
            </div>

            {/* Roles */}
            <div className="space-y-6">
                {roles.map((role) => {
                    const Icon = role.icon;
                    return (
                        <GlassCard key={role.name} className="p-8 border-white/5">
                            <div className="flex items-start justify-between mb-6">
                                <div className="flex items-center gap-4">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center", role.color.split(' ')[0])}>
                                        <Icon className="h-7 w-7" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-xl font-black uppercase">{role.name}</h3>
                                            <Badge className={cn(role.color, "text-[10px]")}>
                                                {role.name === 'super-admin' ? 'Highest' : role.name === 'admin' ? 'High' : role.name === 'moderator' ? 'Medium' : 'Standard'}
                                            </Badge>
                                        </div>
                                        <p className="text-sm text-muted-foreground mt-1">{role.description}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Permissions Grid */}
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                {(Object.keys(role.permissions) as Array<keyof typeof role.permissions>).map((key) => {
                                    const { label, icon: PermIcon } = permissionLabels[key];
                                    return (
                                        <div key={key} className="p-4 bg-white/5 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-2 mb-2">
                                                <PermIcon className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-xs font-bold">{label}</span>
                                            </div>
                                            {getPermissionBadge(role.permissions[key])}
                                        </div>
                                    );
                                })}
                            </div>
                        </GlassCard>
                    );
                })}
            </div>

            {/* Info */}
            <GlassCard className="p-6 border-white/5 bg-gradient-to-r from-blue-500/5 to-transparent">
                <p className="text-sm text-muted-foreground">
                    <strong className="text-white">Note:</strong> Role changes must be made by a super-admin through the Staff Management page.
                    Moderators cannot perform critical actions like suspending users or deleting events.
                </p>
            </GlassCard>
        </div>
    );
}
