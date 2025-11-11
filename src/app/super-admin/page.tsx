
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DollarSign, Users, ShieldAlert, CheckCircle, PlusCircle, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const revenueData = [
  { month: "Jan", revenue: 4000 },
  { month: "Feb", revenue: 3000 },
  { month: "Mar", revenue: 5000 },
  { month: "Apr", revenue: 4500 },
  { month: "May", revenue: 6000 },
  { month: "Jun", revenue: 7000 },
];

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

const admins = [
  { name: "John Doe", email: "john.doe@mov33.com", role: "Content Admin", status: "Active" },
  { name: "Jane Smith", email: "jane.smith@mov33.com", role: "Finance Admin", status: "Active" },
  { name: "Mike Johnson", email: "mike.j@mov33.com", role: "User Admin", status: "Inactive" },
];

const securityLogs = [
    { event: "Admin Login", user: "John Doe", ip: "192.168.1.1", time: "2m ago", risk: "Low" },
    { event: "Payout Processed", user: "Jane Smith", ip: "203.0.113.25", time: "15m ago", risk: "Medium" },
    { event: "Failed Login (Super)", user: "root", ip: "104.28.212.12", time: "1h ago", risk: "High" },
    { event: "Platform Settings Changed", user: "Catherine Williams", ip: "198.51.100.2", time: "3h ago", risk: "Critical" },
]

function RevenueChart() {
    return (
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KES ${Number(value) / 1000}K`} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
}


export default function SuperAdminDashboard() {
  return (
    <div className="space-y-8">
      {/* Overview Cards */}
      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 4,523,189</div>
              <p className="text-xs text-muted-foreground">+20.1% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Admins</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2</div>
              <p className="text-xs text-muted-foreground">Total of 5 admins</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <ShieldAlert className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1 High Risk</div>
              <p className="text-xs text-muted-foreground">Last alert: 1 hour ago</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3 Organizers</div>
              <p className="text-xs text-muted-foreground">2 Influencer requests</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Revenue Chart */}
        <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Last 6 months revenue trend.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                <RevenueChart />
            </CardContent>
        </Card>

        {/* Platform Settings */}
        <Card>
            <CardHeader>
                <CardTitle>Platform Settings</CardTitle>
                <CardDescription>Toggle critical platform features.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="vip-access" className="flex flex-col space-y-1">
                        <span>VIP Access Feature</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                            Enable exclusive VIP events and perks.
                        </span>
                    </Label>
                    <Switch id="vip-access" defaultChecked />
                </div>
                <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="payout-holds" className="flex flex-col space-y-1">
                        <span>Automatic Payouts</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                           Process organizer payouts automatically.
                        </span>
                    </Label>
                    <Switch id="payout-holds" defaultChecked />
                </div>
                 <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="new-signups" className="flex flex-col space-y-1">
                        <span>New Organizer Signups</span>
                        <span className="font-normal leading-snug text-muted-foreground">
                           Allow new organizers to register.
                        </span>
                    </Label>
                    <Switch id="new-signups" />
                </div>
                 <Button className="w-full">
                    <Link href="/super-admin/settings" className="flex items-center">
                        More Settings <ArrowUpRight className="ml-2 h-4 w-4"/>
                    </Link>
                </Button>
            </CardContent>
        </Card>
      </div>

       <div className="grid gap-8 lg:grid-cols-2">
            {/* Admin Management */}
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Admin Management</CardTitle>
                        <CardDescription>View and manage platform administrators.</CardDescription>
                    </div>
                    <Button size="sm" asChild>
                        <Link href="/super-admin/admins">
                            <PlusCircle className="mr-2 h-4 w-4"/> Add Admin
                        </Link>
                    </Button>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {admins.map(admin => (
                            <TableRow key={admin.email}>
                                <TableCell>
                                <div className="font-medium">{admin.name}</div>
                                <div className="text-sm text-muted-foreground">{admin.email}</div>
                                </TableCell>
                                <TableCell>{admin.role}</TableCell>
                                <TableCell>
                                <Badge variant={admin.status === "Active" ? "secondary" : "outline"} className={admin.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : ""}>{admin.status}</Badge>
                                </TableCell>
                            </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Security Logs */}
            <Card>
                 <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                        <CardTitle>Recent Security Logs</CardTitle>
                        <CardDescription>Critical security-related events.</CardDescription>
                    </div>
                     <Button size="sm" variant="outline" asChild>
                        <Link href="/super-admin/security">View All</Link>
                    </Button>
                </CardHeader>
                <CardContent>
                     <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Event</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Risk</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                             {securityLogs.map(log => (
                            <TableRow key={log.time}>
                                <TableCell>
                                    <div className="font-medium">{log.event}</div>
                                    <div className="text-sm text-muted-foreground">{log.time}</div>
                                </TableCell>
                                <TableCell>{log.user}</TableCell>
                                <TableCell>
                                     <Badge variant="outline" className={
                                         log.risk === "High" ? "border-amber-500 text-amber-500" : 
                                         log.risk === "Critical" ? "border-red-500 text-red-500" : ""
                                     }>
                                         {log.risk}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                             ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
