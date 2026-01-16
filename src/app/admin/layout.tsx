'use client';

import * as React from 'react';
import { useState } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminTopbar } from '@/components/admin/admin-topbar';
import { RoleGuard } from '@/components/auth/role-guard';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <RoleGuard allowedRoles={['admin', 'moderator', 'super-admin']}>
      <div className="flex h-screen w-full bg-muted/40 overflow-hidden">

        {/* Sidebar */}
        <AdminSidebar
          isCollapsed={isCollapsed}
          toggleCollapse={() => setIsCollapsed(!isCollapsed)}
          className="flex-shrink-0 z-20"
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Topbar */}
          <AdminTopbar />

          {/* Page Content */}
          <ScrollArea className="flex-1">
            <main className="p-4 sm:p-6 lg:p-8">
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
