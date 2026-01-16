'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogOut, Scan, LayoutDashboard } from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function ModeratorLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <RoleGuard allowedRoles={['moderator']}>
            <div className="flex min-h-screen w-full flex-col bg-obsidian text-white">
                <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
                    <div className="container flex h-16 items-center justify-between">
                        <div className="flex items-center gap-8">
                            <Logo />
                            <nav className="hidden md:flex items-center gap-6">
                                <Link
                                    href="/moderator"
                                    className={`text-sm font-medium transition-colors hover:text-gold ${pathname === '/moderator' ? 'text-gold' : 'text-muted-foreground'}`}
                                >
                                    Dashboard
                                </Link>
                            </nav>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10">
                                <div className="h-2 w-2 rounded-full bg-kenyan-green" />
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-widest">Moderator Mode</span>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                                <LogOut className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </header>

                <main className="flex-1 container py-8">
                    {children}
                </main>

                {/* Bottom Nav for Mobile - Standard for Kenyan UX */}
                <div className="md:hidden fixed bottom-0 left-0 right-0 h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-6 z-50">
                    <Link href="/moderator" className="flex flex-col items-center gap-1 text-gold">
                        <LayoutDashboard className="h-6 w-6" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Home</span>
                    </Link>
                    <div className="h-14 w-14 bg-kenyan-green rounded-full flex items-center justify-center -translate-y-6 border-4 border-obsidian shadow-2xl shadow-kenyan-green/40">
                        <Scan className="h-7 w-7 text-white" />
                    </div>
                    <button className="flex flex-col items-center gap-1 text-muted-foreground">
                        <LogOut className="h-6 w-6" />
                        <span className="text-[10px] uppercase font-bold tracking-tighter">Exit</span>
                    </button>
                </div>
            </div>
        </RoleGuard>
    );
}
