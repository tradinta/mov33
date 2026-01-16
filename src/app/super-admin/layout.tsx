'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { RoleGuard } from '@/components/auth/role-guard';
import {
  LayoutDashboard, Users, Calendar, Map,
  CreditCard, Settings, ShieldAlert, FileText, Activity,
  ChevronDown, LogOut, Search, UserPlus, Flag, Menu, X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';

const navItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/super-admin' },
  { icon: Users, label: 'User Management', href: '/super-admin/users' },
  { icon: Calendar, label: 'Events Global', href: '/super-admin/events' },
  { icon: Map, label: 'Tours & Travel', href: '/super-admin/tours' },
  { icon: UserPlus, label: 'Organizers', href: '/super-admin/organizers' },
  { icon: CreditCard, label: 'Finance & Payouts', href: '/super-admin/finance' },
  { icon: ShieldAlert, label: 'Moderation', href: '/super-admin/moderation' },
  { icon: Settings, label: 'System Settings', href: '/super-admin/settings' },
];

const logItems = [
  { icon: Activity, label: 'Server Health', color: 'text-green-500' },
  { icon: FileText, label: 'Audit Trail', color: 'text-blue-500' },
  { icon: Flag, label: 'User Reports', color: 'text-red-500' },
];

function SidebarContent({ pathname, logout, profile }: { pathname: string; logout: () => void; profile: any }) {
  return (
    <>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Search Platform"
          className="pl-9 bg-[#1A1A1A] border-none text-sm h-9 rounded-lg text-zinc-300 placeholder:text-zinc-600 focus-visible:ring-1 focus-visible:ring-gold/50"
        />
      </div>

      {/* Main Nav */}
      <nav className="space-y-1 flex-1">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
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
      <div className="space-y-3 pt-4 border-t border-white/5 mt-4">
        <div className="px-2 text-xs font-medium text-zinc-500 uppercase tracking-wider">
          System Logs
        </div>
        <div className="space-y-1">
          {logItems.map((item) => (
            <div key={item.label} className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer">
              <item.icon className={cn("h-4 w-4", item.color)} />
              {item.label}
            </div>
          ))}
        </div>
      </div>

      {/* User */}
      <div className="pt-4 border-t border-white/5 mt-4">
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
    </>
  );
}

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { logout, profile } = useAuth();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <RoleGuard allowedRoles={['super-admin']}>
      <div className="flex h-screen w-full bg-[#0a0a0a] text-white font-sans overflow-hidden">

        {/* DESKTOP SIDEBAR */}
        <aside className="hidden lg:flex w-64 flex-shrink-0 border-r border-white/5 bg-[#0F0F0F] flex-col">
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

          <div className="p-4 flex-1 overflow-y-auto flex flex-col">
            <SidebarContent pathname={pathname} logout={logout} profile={profile} />
          </div>
        </aside>

        {/* MOBILE HEADER + SHEET SIDEBAR */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#0F0F0F] border-b border-white/5 flex items-center px-4 gap-4">
          <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-white">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 bg-[#0F0F0F] border-r border-white/5 p-4">
              <div className="flex items-center gap-2 text-white font-bold tracking-tight mb-6">
                <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center">
                  <div className="h-3 w-3 bg-black rounded-full" />
                </div>
                <span>mov33 Admin</span>
              </div>
              <SidebarContent pathname={pathname} logout={logout} profile={profile} />
            </SheetContent>
          </Sheet>

          <div className="flex items-center gap-2 text-white font-bold">
            <div className="h-6 w-6 rounded-full bg-gold flex items-center justify-center">
              <div className="h-3 w-3 bg-black rounded-full" />
            </div>
            <span className="text-sm">mov33 Admin</span>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a] p-4 lg:p-8 pt-20 lg:pt-8">
          {children}
        </main>
      </div>
    </RoleGuard>
  );
}
