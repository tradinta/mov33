'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboard,
    Ticket,
    Users,
    Settings,
    CreditCard,
    BookOpen,
    User,
    LogOut,
    Sparkles,
    Tag,
    ChevronRight,
    Map
} from 'lucide-react';

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface OrganizerSidebarProps {
    className?: string;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    items?: SidebarItem[];
    logout?: () => void;
}

interface SidebarGroup {
    label: string;
    items: SidebarItem[];
}

const navGroups: SidebarGroup[] = [
    {
        label: 'Dashboard',
        items: [
            { title: 'Overview', href: '/organizer', icon: LayoutDashboard },
            { title: 'Listings', href: '/organizer/events', icon: Ticket },
            { title: 'Attendance', href: '/organizer/attendance', icon: Users },
        ]
    },
    {
        label: 'Finance & Tools',
        items: [
            { title: 'Payouts', href: '/organizer/payouts', icon: CreditCard },
            { title: 'Promocodes', href: '/organizer/promocodes', icon: Tag },
            { title: 'Tours', href: '/organizer/tours', icon: Map },
        ]
    },
    {
        label: 'Settings',
        items: [
            { title: 'Profile', href: '/organizer/profile', icon: User },
            { title: 'Guide', href: '/organizer/guide', icon: BookOpen },
            { title: 'Settings', href: '/organizer/settings', icon: Settings },
        ]
    }
];

export function OrganizerSidebar({ className, isCollapsed, toggleCollapse, logout }: OrganizerSidebarProps) {
    const pathname = usePathname();

    const isLinkActive = (href: string) => {
        if (href === '/organizer') return pathname === '/organizer';
        return pathname.startsWith(href);
    };

    return (
        <div
            className={cn(
                "relative flex flex-col h-screen border-r border-border/50 bg-background/80 backdrop-blur-xl transition-all duration-500 ease-in-out z-50",
                isCollapsed ? "w-[80px]" : "w-[280px]",
                className
            )}
        >
            {/* Header / Logo */}
            <div className={cn("flex h-20 items-center px-6", isCollapsed ? "justify-center" : "justify-between")}>
                <Link href="/organizer" className="flex items-center gap-3 overflow-hidden">
                    <div className="bg-foreground dark:bg-white p-2 rounded-xl shrink-0 shadow-lg">
                        <Sparkles className="h-5 w-5 text-background dark:text-obsidian" />
                    </div>
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <span className="font-headline text-lg font-black uppercase italic tracking-tighter text-foreground leading-none">
                                Mov33<span className="text-gold">Org</span>
                            </span>
                            <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground leading-none mt-1">Organizer Hub</span>
                        </div>
                    )}
                </Link>
            </div>

            {/* Collapse Button (if collapsed) */}
            {isCollapsed && (
                <div className="absolute -right-3 top-20 z-10">
                    <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full border shadow-md bg-background"
                        onClick={toggleCollapse}
                    >
                        <ChevronRight className="h-3 w-3" />
                    </Button>
                </div>
            )}

            {/* Navigation */}
            <ScrollArea className="flex-1 px-4 py-6">
                <div className="space-y-8">
                    {navGroups.map((group, groupIndex) => (
                        <div key={groupIndex} className="space-y-3">
                            {!isCollapsed && (
                                <h3 className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
                                    {group.label}
                                </h3>
                            )}
                            <div className="grid gap-1">
                                {group.items.map((item, itemIndex) => {
                                    const isActive = isLinkActive(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={itemIndex}
                                            href={item.href}
                                            className={cn(
                                                "group flex items-center h-11 px-3 rounded-xl transition-all duration-300 relative",
                                                isActive
                                                    ? "bg-gold/10 text-gold font-bold shadow-[0_0_20px_rgba(212,175,55,0.1)]"
                                                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                            )}
                                        >
                                            <Icon className={cn(
                                                "h-4 w-4 shrink-0 transition-transform duration-300 group-hover:scale-110",
                                                isActive ? "text-gold" : "text-muted-foreground"
                                            )} />
                                            {!isCollapsed && (
                                                <span className="ml-3 text-sm tracking-tight">{item.title}</span>
                                            )}
                                            {isActive && (
                                                <motion.div
                                                    layoutId="active-pill"
                                                    className="absolute left-0 w-1 h-5 bg-gold rounded-full"
                                                />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            {/* Footer / Logout */}
            <div className="mt-auto p-4 border-t border-border/50">
                <Button
                    variant="ghost"
                    className={cn(
                        "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-500/10 rounded-xl px-3",
                        isCollapsed ? "justify-center" : ""
                    )}
                    onClick={logout}
                >
                    <LogOut className="h-4 w-4 shrink-0" />
                    {!isCollapsed && <span className="ml-3 text-sm font-bold uppercase tracking-widest text-[10px]">Logout</span>}
                </Button>
            </div>
        </div>
    );
}
