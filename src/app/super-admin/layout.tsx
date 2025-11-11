
'use client';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarTrigger, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Settings, Shield, BarChart3, LogOut } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Logo />
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton href="/super-admin" isActive={pathname === '/super-admin'} tooltip="Dashboard">
                <Home />
                <span>Dashboard</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/super-admin/admins" isActive={pathname === '/super-admin/admins'} tooltip="Admin Management">
                <Users />
                <span>Admin Management</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
             <SidebarMenuItem>
              <SidebarMenuButton href="/super-admin/analytics" isActive={pathname === '/super-admin/analytics'} tooltip="Analytics">
                <BarChart3 />
                <span>Analytics</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/super-admin/settings" isActive={pathname === '/super-admin/settings'} tooltip="Platform Settings">
                <Settings />
                <span>Platform Settings</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton href="/super-admin/security" isActive={pathname === '/super-admin/security'} tooltip="Security Logs">
                <Shield />
                <span>Security Logs</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <div className="flex items-center gap-2 p-2">
             <Avatar className="h-10 w-10">
                <AvatarImage src="https://picsum.photos/seed/superadmin/100/100" />
                <AvatarFallback>SA</AvatarFallback>
             </Avatar>
             <div className="flex flex-col overflow-hidden">
                <span className="font-semibold text-sm truncate">Catherine Williams</span>
                <span className="text-xs text-muted-foreground truncate">Super Admin</span>
             </div>
             <Button variant="ghost" size="icon" className="ml-auto">
                <LogOut className="h-4 w-4" />
             </Button>
           </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b">
            <SidebarTrigger />
            <h1 className="font-headline text-xl font-bold">Super Admin Dashboard</h1>
        </header>
        <main className="p-4 md:p-6 lg:p-8 bg-muted/40 min-h-screen">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
