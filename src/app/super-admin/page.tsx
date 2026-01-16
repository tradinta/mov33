'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ArrowUpRight, ArrowDownRight, Ticket, Users, DollarSign, Calendar, Loader2, Eye, TrendingUp } from 'lucide-react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { collection, getDocs, query, orderBy, limit, where, Timestamp } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { format, subDays, startOfDay } from 'date-fns';

export default function SuperAdminDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    ticketsSold: 0,
    activeUsers: 0,
    totalEvents: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Fetch Users
        const usersSnap = await getDocs(collection(firestore, 'users'));
        const users = usersSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Fetch Events
        const eventsSnap = await getDocs(collection(firestore, 'events'));
        const events = eventsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Fetch Tickets for Revenue
        const ticketsSnap = await getDocs(collection(firestore, 'tickets'));
        const tickets = ticketsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

        // Calculate Stats
        const totalRevenue = tickets.reduce((sum, t: any) => sum + (t.price || 0), 0);

        setStats({
          totalRevenue,
          ticketsSold: tickets.length,
          activeUsers: users.length,
          totalEvents: events.length,
        });

        // Recent Users (last 5)
        const sortedUsers = users.sort((a: any, b: any) =>
          (b.createdAt?.toMillis?.() || 0) - (a.createdAt?.toMillis?.() || 0)
        ).slice(0, 5);
        setRecentUsers(sortedUsers);

        // Generate Chart Data (last 7 days ticket sales)
        const last7Days = Array.from({ length: 7 }, (_, i) => {
          const date = subDays(new Date(), 6 - i);
          const dayStart = startOfDay(date).getTime();
          const dayEnd = dayStart + 86400000;

          const dayTickets = tickets.filter((t: any) => {
            const ts = t.createdAt?.toMillis?.() || 0;
            return ts >= dayStart && ts < dayEnd;
          });

          const dayRevenue = dayTickets.reduce((sum: number, t: any) => sum + (t.price || 0), 0);

          return {
            name: format(date, 'EEE'),
            revenue: dayRevenue,
            tickets: dayTickets.length,
          };
        });
        setChartData(last7Days);

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-in fade-in duration-700">

      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-zinc-500 mb-2 text-sm">
          <span className="flex items-center gap-2"><div className="h-4 w-4 bg-gold rounded-full" /> mov33 HQ</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">Welcome Back, {profile?.displayName?.split(' ')[0] || 'Chief'}!</h1>
        <p className="text-zinc-400">Here is what's happening on the platform today.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-[#111] border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign className="h-16 w-16 text-gold" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Net Revenue</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">KES {stats.totalRevenue.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Ticket className="h-16 w-16 text-kenyan-green" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Tickets Sold</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.ticketsSold.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users className="h-16 w-16 text-blue-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Registered Users</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.activeUsers.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card className="bg-[#111] border-white/5 shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar className="h-16 w-16 text-purple-500" />
          </div>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <span className="text-sm font-medium text-zinc-400">Total Events</span>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{stats.totalEvents.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>

      {/* Chart */}
      <Card className="bg-[#111] border-white/5 shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <CardTitle className="text-lg font-medium text-white">Revenue & Ticket Sales (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#FFD700" stopOpacity={0.2} /><stop offset="95%" stopColor="#FFD700" stopOpacity={0} /></linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#444" fontSize={12} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#1A1A1A', borderColor: '#333', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="revenue" stroke="#FFD700" strokeWidth={2} fill="url(#colorRevenue)" name="Revenue (KES)" />
              <Area type="monotone" dataKey="tickets" stroke="#00FA9A" strokeWidth={2} fill="none" name="Tickets Sold" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Users Table */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Recent Registrations</h3>
        <div className="bg-[#111] rounded-xl border border-white/5 overflow-hidden">
          <Table>
            <TableHeader className="bg-[#161616]">
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-zinc-500 font-medium">User</TableHead>
                <TableHead className="text-zinc-500 font-medium">Role</TableHead>
                <TableHead className="text-zinc-500 font-medium">Email</TableHead>
                <TableHead className="text-zinc-500 font-medium">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user: any) => (
                <TableRow key={user.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="text-white">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 border border-white/10">
                        <AvatarImage src={user.photoURL} />
                        <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                      {user.displayName || 'Anonymous'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={cn("text-xs uppercase font-bold tracking-wider", user.role === 'organizer' ? "text-gold" : "text-zinc-400")}>
                      {user.role || 'user'}
                    </span>
                  </TableCell>
                  <TableCell className="text-zinc-400">{user.email}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={user.isVerified ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20'}>
                      {user.isVerified ? '✓ Verified' : 'Unverified'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
              {recentUsers.length === 0 && (
                <TableRow><TableCell colSpan={4} className="text-center text-zinc-500 py-8">No users found</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
