'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  LayoutDashboard, Users, Calendar, Map, CheckSquare,
  CreditCard, Settings, ShieldAlert, FileText, Activity,
  ChevronDown, LogOut, Search, Plus, UserPlus, Flag
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, profile } = useAuth();

  return (
    <RoleGuard allowedRoles={['super-admin']}>
      <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">

        {/* SIDEBAR */}
        <aside className="w-64 flex-shrink-0 border-r border-white/5 bg-[#0F0F0F] flex flex-col">
          {/* Header */}
          <div className="h-16 flex items-center px-6 border-b border-white/5">
            <div className="flex items-center gap-2 text-white font-bold tracking-tight">
              <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                <div className="h-3 w-3 bg-black rounded-full" />
              </div>
              <span>mov33 Admin</span>
              <ChevronDown className="h-3 w-3 opacity-50 ml-auto" />
            </div>
          </div>

          <div className="p-4 space-y-6 flex-1 overflow-y-auto">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Search Platform"
                className="pl-9 bg-[#1A1A1A] border-none text-sm h-9 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-gold/50"
              />
            </div>

            {/* Main Nav */}
            <nav className="space-y-1">
              {[
                { icon: LayoutDashboard, label: 'Overview', href: '/super-admin' },
                { icon: Users, label: 'User Management', href: '/super-admin/users' },
                { icon: Calendar, label: 'Events Global', href: '/super-admin/events' },
                { icon: Map, label: 'Tours & Travel', href: '/super-admin/tours' },
                { icon: UserPlus, label: 'Organizers', href: '/super-admin/organizers' },
                { icon: CreditCard, label: 'Finance & Payouts', href: '/super-admin/finance' },
                { icon: ShieldAlert, label: 'Moderation', href: '/super-admin/moderation' },
                { icon: Settings, label: 'System Settings', href: '/super-admin/settings' },
              ].map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                    pathname === item.href
                      ? "bg-[#1A1A1A] text-gold font-medium border-l-2 border-gold"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Audits & Logs */}
            <div className="space-y-3 pt-4 border-t border-white/5">
              <div className="flex items-center justify-between px-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
                <span>System Logs</span>
              </div>
              <div className="space-y-1">
                {[
                  { icon: Activity, label: 'Server Health', color: 'text-green-500' },
                  { icon: FileText, label: 'Audit Trail', color: 'text-blue-500' },
                  { icon: Flag, label: 'User Reports', color: 'text-red-500' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer">
                    <item.icon className={cn("h-4 w-4", item.color)} />
                    {item.label}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* User */}
          <div className="p-4 border-t border-white/5 z-20 bg-[#0F0F0F]">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => logout()}>
              <Avatar className="h-8 w-8 border border-gold/20">
                <AvatarImage src={profile?.photoURL || ''} />
                <AvatarFallback className="bg-gold text-obsidian font-bold text-xs">SA</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-white truncate">{profile?.displayName || 'Super Admin'}</p>
                <p className="text-xs text-zinc-500 truncate">Log out</p>
              </div>
              <LogOut className="h-4 w-4 text-zinc-500 group-hover:text-red-400 transition-colors" />
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
