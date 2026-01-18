'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { useAuth } from '@/context/auth-context';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Bell, User, LogOut, Search, Command, ChevronDown, Sparkles, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { OrganizerSidebar } from './organizer-sidebar';

interface OrganizerTopbarProps {
    onOpenMobileMenu?: () => void;
}

export function OrganizerTopbar({ onOpenMobileMenu }: OrganizerTopbarProps) {
    const { profile, logout } = useAuth();

    return (
        <header className="sticky top-0 z-40 h-20 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 flex items-center justify-between px-4 lg:px-8">
            {/* Mobile Menu Trigger */}
            <div className="lg:hidden mr-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="p-0 border-r border-border/50 w-[280px]">
                        <OrganizerSidebar
                            isCollapsed={false}
                            toggleCollapse={() => { }}
                            logout={logout}
                            className="w-full h-full border-none bg-transparent"
                        />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Left: Search Bar */}
            <div className="flex-1 max-w-md relative group hidden md:block">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-gold transition-colors" />
                <Input
                    placeholder="Search events, orders..."
                    className="w-full h-11 pl-12 pr-12 bg-muted/50 border-transparent focus:border-gold/50 focus:ring-4 focus:ring-gold/10 rounded-2xl transition-all duration-300"
                />
                <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded-md border border-border/50 bg-background text-[10px] font-black text-muted-foreground uppercase tracking-widest pointer-events-none">
                    <Command className="h-2.5 w-2.5" />
                    <span>K</span>
                </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 lg:gap-6 ml-auto">

                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="relative h-11 w-11 rounded-2xl hover:bg-gold/10 hover:text-gold transition-all duration-300">
                        <Bell className="h-5 w-5" />
                        {/* <span className="absolute top-3 right-3 h-2 w-2 bg-gold rounded-full ring-2 ring-background animate-pulse" /> */}
                    </Button>
                    <ThemeToggle />
                </div>

                <div className="h-8 w-px bg-border/50 hidden lg:block" />

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="relative flex items-center gap-3 h-12 pr-2 pl-2 rounded-2xl hover:bg-muted/50 transition-all duration-300 select-none">
                            <div className="relative">
                                <Avatar className="h-9 w-9 border-2 border-background shadow-xl">
                                    <AvatarImage src={profile?.photoURL || ''} alt={profile?.displayName || ''} />
                                    <AvatarFallback className="bg-gold text-obsidian font-black uppercase tracking-tighter text-xs">
                                        {profile?.displayName?.[0] || 'O'}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-kenyan-green border-2 border-background rounded-full shadow-lg" />
                            </div>
                            <div className="hidden lg:flex flex-col items-start mr-2">
                                <span className="text-sm font-black uppercase italic tracking-tighnt leading-none text-foreground max-w-[100px] truncate">
                                    {profile?.displayName?.split(' ')[0] || 'Organizer'}
                                </span>
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest mt-1">Organizer</span>
                            </div>
                            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground transition-transform duration-300 group-data-[state=open]:rotate-180" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-64 p-2 rounded-2xl bg-background/80 backdrop-blur-xl border-border/50 shadow-2xl" align="end">
                        <DropdownMenuLabel className="p-4">
                            <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-xl bg-gold/10 flex items-center justify-center">
                                    <Sparkles className="h-5 w-5 text-gold" />
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-sm font-black uppercase italic tracking-tighter leading-none">{profile?.displayName}</p>
                                    <p className="text-[10px] text-muted-foreground/60 font-medium tracking-tight mt-1 truncate max-w-[180px]">{profile?.email}</p>
                                </div>
                            </div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-border/50 mx-2" />
                        <DropdownMenuItem asChild className="rounded-xl m-1 h-11 font-bold uppercase tracking-widest text-[10px] focus:bg-gold/10 focus:text-gold">
                            <Link href="/organizer/profile" className="flex items-center">
                                <User className="mr-3 h-4 w-4" />
                                <span>Profile & Settings</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border/50 mx-2" />
                        <DropdownMenuItem onClick={() => logout()} className="rounded-xl m-1 h-11 font-bold uppercase tracking-widest text-[10px] text-red-500 focus:bg-red-500/10 focus:text-red-500">
                            <LogOut className="mr-3 h-4 w-4" />
                            <span>Sign Out</span>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}
