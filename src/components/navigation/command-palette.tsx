'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "@/components/ui/command";
import {
    Calendar,
    Search,
    Ticket,
    User,
    Settings,
    ShoppingCart,
    Map,
    Info,
    LayoutDashboard
} from 'lucide-react';

export function CommandPalette() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener("keydown", down);
        return () => document.removeEventListener("keydown", down);
    }, []);

    const runCommand = (command: () => void) => {
        setOpen(false);
        command();
    };

    return (
        <CommandDialog open={open} onOpenChange={setOpen}>
            <div className="bg-obsidian border-white/10 text-white overflow-hidden rounded-xl">
                <CommandInput
                    placeholder="Search events, artists, or navigation..."
                    className="border-none focus:ring-0 text-white font-poppins"
                />
                <CommandList className="max-h-[300px] scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                    <CommandEmpty className="py-6 text-center text-white/40 text-sm">No results found.</CommandEmpty>

                    <CommandGroup heading="Discovery" className="text-gold/40 text-[10px] uppercase font-black tracking-widest px-4 py-2">
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/events'))}>
                            <Calendar className="h-4 w-4" />
                            <span className="text-sm font-bold">Browse All Events</span>
                        </CommandItem>
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/events?view=map'))}>
                            <Map className="h-4 w-4" />
                            <span className="text-sm font-bold">Event Map View</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="bg-white/5" />

                    <CommandGroup heading="My Account" className="text-gold/40 text-[10px] uppercase font-black tracking-widest px-4 py-2">
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/profile'))}>
                            <User className="h-4 w-4" />
                            <span className="text-sm font-bold">My Profile</span>
                        </CommandItem>
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/profile?tab=tickets'))}>
                            <Ticket className="h-4 w-4" />
                            <span className="text-sm font-bold">My Tickets</span>
                        </CommandItem>
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/checkout'))}>
                            <ShoppingCart className="h-4 w-4" />
                            <span className="text-sm font-bold">Checkout</span>
                        </CommandItem>
                    </CommandGroup>

                    <CommandSeparator className="bg-white/5" />

                    <CommandGroup heading="Help & Support" className="text-gold/40 text-[10px] uppercase font-black tracking-widest px-4 py-2">
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/faq'))}>
                            <Info className="h-4 w-4" />
                            <span className="text-sm font-bold">Common Inquiries (FAQ)</span>
                        </CommandItem>
                        <CommandItem className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 cursor-pointer aria-selected:bg-white/5" onSelect={() => runCommand(() => router.push('/settings'))}>
                            <Settings className="h-4 w-4" />
                            <span className="text-sm font-bold">Preferences</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>

                <div className="p-4 border-t border-white/5 bg-white/[0.02] flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-widest text-white/20">
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">ESC</kbd>
                            <span>Close</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10">↵</kbd>
                            <span>Select</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[9px] font-black uppercase tracking-widest text-gold/40 italic">Mov33 Search</span>
                        <div className="h-1 w-4 bg-gold/20 rounded-full" />
                    </div>
                </div>
            </div>
        </CommandDialog>
    );
}
