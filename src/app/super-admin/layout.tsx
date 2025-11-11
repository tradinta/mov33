
'use client';
import { usePathname } from 'next/navigation';
import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarInset, SidebarMenuSub, SidebarMenuSubButton, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Home, Users, Settings, Shield, BarChart3, LogOut, Ticket, UserCheck, LayoutDashboard, Megaphone, Banknote, Building } from "lucide-react";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { useCollapsible } from '@/hooks/use-collapsible';

function UserManagementSubMenu() {
    const { Sub, isSubOpen } = useCollapsible("user-management");
    const pathname = usePathname();
    const { setOpenMobile } = useSidebar();
    const isActive = pathname.startsWith('/super-admin/admins');

    return (
        <Sub>
            <SidebarMenuButton tooltip="User Management" isActive={isActive}>
                <Users />
                <span>User Management</span>
            </SidebarMenuButton>
            {isSubOpen && (
                <SidebarMenuSub>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton href="/super-admin/admins" isActive={pathname === '/super-admin/admins'} onClick={() => setOpenMobile(false)}>Admins</SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton href="#" onClick={() => setOpenMobile(false)}>Organizers</SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton href="#" onClick={() => setOpenMobile(false)}>Influencers</SidebarMenuSubButton>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                        <SidebarMenuSubButton href="#" onClick={() => setOpenMobile(false)}>Standard Users</SidebarMenuSubButton>
                    </SidebarMenuItem>
                </SidebarMenuSub>
            )}
        </Sub>
    )
}

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { setOpen, setOpenMobile } = useSidebar();

  return (
      <SidebarProvider>
        <Sidebar>
            <SidebarHeader>
            <Logo />
            </SidebarHeader>
            <SidebarContent>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/super-admin" isActive={pathname === '/super-admin'} tooltip="Dashboard" onClick={() => setOpenMobile(false)}>
                        <Home />
                        <span>Dashboard</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                
                <UserManagementSubMenu />

                <SidebarMenuItem>
                    <SidebarMenuButton href="/super-admin/analytics" isActive={pathname === '/super-admin/analytics'} tooltip="Analytics" onClick={() => setOpenMobile(false)}>
                        <BarChart3 />
                        <span>Analytics</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/super-admin/settings" isActive={pathname === '/super-admin/settings'} tooltip="Platform Settings" onClick={() => setOpenMobile(false)}>
                        <Settings />
                        <span>Platform Settings</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                    <SidebarMenuButton href="/super-admin/security" isActive={pathname === '/super-admin/security'} tooltip="Security Logs" onClick={() => setOpenMobile(false)}>
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
            <main className="p-4 md:p-6 lg:p-8 bg-muted/40 min-h-[calc(100vh-65px)]">
            {children}
            </main>
        </SidebarInset>
    </SidebarProvider>
  );
}
