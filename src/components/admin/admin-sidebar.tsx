'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    ChevronLeft,
    ChevronRight,
    ShieldAlert,
    LayoutDashboard,
    Ticket,
    ShieldCheck,
    BarChart3,
    Users,
    Settings,
    Globe
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SidebarItem {
    title: string;
    href: string;
    icon: React.ElementType;
}

interface AdminSidebarProps {
    className?: string;
    isCollapsed: boolean;
    toggleCollapse: () => void;
    items?: SidebarItem[];
}

const defaultItems: SidebarItem[] = [
    { title: 'Overview', href: '/admin', icon: LayoutDashboard },
    { title: 'Events', href: '/admin/events', icon: Ticket },
    { title: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { title: 'Reports', href: '/admin/reports', icon: ShieldCheck },
    { title: 'Users', href: '/admin/users', icon: Users }, // Placeholder
    { title: 'Settings', href: '/admin/settings', icon: Settings }, // Placeholder
];

export function AdminSidebar({ className, isCollapsed, toggleCollapse, items = defaultItems }: AdminSidebarProps) {
    const pathname = usePathname();

    return (
        <div
            className={cn(
                "relative flex flex-col h-screen border-r border-border bg-card transition-all duration-300",
                isCollapsed ? "w-16" : "w-64",
                className
            )}
        >
            {/* Header / Logo */}
            <div className={cn("flex h-16 items-center border-b border-border px-4", isCollapsed ? "justify-center" : "justify-between")}>
                <Link href="/admin" className="flex items-center gap-2 group overflow-hidden">
                    <div className="bg-gold p-1.5 rounded-lg shrink-0">
                        <ShieldAlert className="h-5 w-5 text-obsidian" />
                    </div>
                    {!isCollapsed && (
                        <span className="font-headline text-lg font-black uppercase italic tracking-tighter text-foreground whitespace-nowrap opacity-100 transition-opacity duration-300">
                            STAFF <span className="text-gold">CORE</span>
                        </span>
                    )}
                </Link>
                {!isCollapsed && (
                    <Button variant="ghost" size="icon" className="h-6 w-6 ml-auto" onClick={toggleCollapse}>
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                )}
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
            <ScrollArea className="flex-1 py-4">
                <nav className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
                    <TooltipProvider delayDuration={0}>
                        {items.map((item, index) => {
                            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));

                            if (isCollapsed) {
                                return (
                                    <Tooltip key={index}>
                                        <TooltipTrigger asChild>
                                            <Link href={item.href} className={cn(
                                                "h-10 w-10 flex items-center justify-center rounded-lg transition-colors",
                                                isActive ? "bg-gold text-obsidian" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                            )}>
                                                <item.icon className="h-5 w-5" />
                                                <span className="sr-only">{item.title}</span>
                                            </Link>
                                        </TooltipTrigger>
                                        <TooltipContent side="right" className="flex item-center gap-4">
                                            {item.title}
                                        </TooltipContent>
                                    </Tooltip>
                                )
                            }

                            return (
                                <Link
                                    key={index}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive ? "bg-gold text-obsidian font-bold" : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                    )}
                                >
                                    <item.icon className="h-4 w-4" />
                                    <span>{item.title}</span>
                                </Link>
                            )
                        })}
                    </TooltipProvider>
                </nav>
            </ScrollArea>

            {/* Footer / Context */}
            <div className="border-t border-border p-4">
                <div className={cn("flex items-center gap-3", isCollapsed ? "justify-center" : "")}>
                    <div className="h-8 w-8 rounded-full bg-accent flex items-center justify-center shrink-0">
                        <Globe className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                        <div className="text-xs">
                            <p className="font-bold text-foreground">Mov33 Public</p>
                            <Link href="/" target="_blank" className="text-muted-foreground hover:text-gold transition-colors block truncate w-32">
                                mov33.co.ke
                            </Link>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}
