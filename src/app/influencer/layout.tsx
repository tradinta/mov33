'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { LogOut, Trophy, Link as LinkIcon, BarChart3, Wallet } from 'lucide-react';
import { RoleGuard } from '@/components/auth/role-guard';

export default function InfluencerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const navItems = [
    { href: '/influencer', label: 'Dashboard', icon: BarChart3 },
    { href: '/influencer/links', label: 'Referral Links', icon: LinkIcon },
    { href: '/influencer/leaderboard', label: 'Leaderboard', icon: Trophy },
    { href: '/influencer/payouts', label: 'Earnings', icon: Wallet },
  ];

  return (
    <RoleGuard allowedRoles={['influencer']}>
      <div className="flex min-h-screen w-full flex-col bg-obsidian text-white">
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl">
          <div className="container flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Logo />
              <nav className="hidden md:flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`text-sm font-medium transition-colors hover:text-gold flex items-center gap-2 ${pathname === item.href ? 'text-gold' : 'text-muted-foreground'}`}
                  >
                    <item.icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20">
                <Trophy className="h-3 w-3 text-gold" />
                <span className="text-xs font-bold text-gold uppercase tracking-widest">Master Influencer</span>
              </div>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-white">
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </header>

        <main className="flex-1 container py-10">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
