'use client';

import * as React from 'react';
import { useState } from 'react';
import { OrganizerSidebar } from '@/components/organizer/organizer-sidebar';
import { OrganizerTopbar } from '@/components/organizer/organizer-topbar';
import { RoleGuard } from '@/components/auth/role-guard';
import { useAuth } from '@/context/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <RoleGuard allowedRoles={['organizer', 'admin', 'super-admin']}>
      <div className="flex h-screen w-full bg-muted/40 overflow-hidden">

        {/* Desktop Sidebar (Hidden on Mobile) */}
        <div className="hidden lg:block relative z-50">
          <OrganizerSidebar
            isCollapsed={isCollapsed}
            toggleCollapse={() => setIsCollapsed(!isCollapsed)}
            logout={logout}
          />
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Topbar (Handles Mobile Sidebar Trigger) */}
          <OrganizerTopbar />

          {/* Page Content */}
          <ScrollArea className="flex-1">
            <main className="p-4 sm:p-6 lg:p-8 animate-in fade-in duration-500">
              <div className="mx-auto max-w-7xl">
                {children}
              </div>
            </main>
          </ScrollArea>
        </div>

      </div>
    </RoleGuard>
  );
}
