
'use client';

import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Ticket, Activity, RefreshCcw } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;

interface ChartDataItem {
  month: string;
  revenue: number;
}

function RevenueChart({ data }: { data: ChartDataItem[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground italic">
        No revenue data available for the selected period.
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="w-full h-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-revenue)" stopOpacity={0.8} />
              <stop offset="95%" stopColor="var(--color-revenue)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value: number) => `KES ${value / 1000}K`} />
          <Tooltip content={<ChartTooltipContent indicator="dot" />} />
          <Area type="monotone" dataKey="revenue" stroke="var(--color-revenue)" fillOpacity={1} fill="url(#colorRevenue)" />
        </AreaChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}

interface DashboardStats {
  totalRevenue: number;
  ticketsSold: number;
  upcomingEvents: number;
  followers: number;
  revenueHistory: ChartDataItem[];
}

export default function OrganizerDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    ticketsSold: 0,
    upcomingEvents: 0,
    followers: 0,
    revenueHistory: []
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.uid) return;

      try {
        setLoading(true);
        // 1. Fetch Events
        const eventsRef = collection(firestore, 'events');
        const q = query(eventsRef, where('organizerId', '==', profile.uid));
        const querySnapshot = await getDocs(q);

        let revenue = 0;
        let sold = 0;
        let upcoming = 0;
        const now = new Date();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          revenue += data.revenue || 0;
          sold += data.ticketsSold || 0;
          if (new Date(data.date) > now) {
            upcoming++;
          }
        });

        // 2. Mock revenue history for the chart
        const mockRevenueHistory: ChartDataItem[] = [
          { month: "Jan", revenue: revenue * 0.1 },
          { month: "Feb", revenue: revenue * 0.15 },
          { month: "Mar", revenue: revenue * 0.12 },
          { month: "Apr", revenue: revenue * 0.18 },
          { month: "May", revenue: revenue * 0.2 },
          { month: "Jun", revenue: revenue * 0.25 },
        ];

        setStats({
          totalRevenue: revenue,
          ticketsSold: sold,
          upcomingEvents: upcoming,
          followers: profile.followersCount || 0,
          revenueHistory: mockRevenueHistory
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile?.uid, profile?.followersCount]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black font-headline uppercase tracking-tighter">
            Dashboard: {profile?.displayName || 'Organizer'}
          </h1>
          <p className="text-muted-foreground font-poppins text-sm">Real-time performance metrics for your events.</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="p-2 hover:bg-white/5 rounded-full transition-colors"
        >
          <RefreshCcw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-headline">
                {loading ? "..." : `KES ${stats.totalRevenue.toLocaleString()}`}
              </div>
              <p className="text-[10px] text-kenyan-green font-bold uppercase mt-1">+12.5% vs Last Month</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Tickets Sold</CardTitle>
              <Ticket className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-headline">
                {loading ? "..." : stats.ticketsSold.toLocaleString()}
              </div>
              <p className="text-[10px] text-kenyan-green font-bold uppercase mt-1">Direct Sales Organic</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Active Listings</CardTitle>
              <Activity className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-headline">
                {loading ? "..." : stats.upcomingEvents}
              </div>
              <p className="text-[10px] text-muted-foreground font-bold uppercase mt-1">{stats.upcomingEvents} Events Live</p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Audience</CardTitle>
              <Users className="h-4 w-4 text-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-black font-headline">
                {loading ? "..." : stats.followers.toLocaleString()}
              </div>
              <p className="text-[10px] text-kenyan-green font-bold uppercase mt-1">+24 New Followers</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <Card className="bg-white/5 border-white/10 backdrop-blur-sm overflow-hidden border-t-gold/20">
        <CardHeader>
          <CardTitle className="text-lg font-black uppercase tracking-tight">Revenue Stream</CardTitle>
          <CardDescription className="text-xs font-poppins">Monthly performance analytics across all event categories.</CardDescription>
        </CardHeader>
        <CardContent className="h-80 pt-4">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <RefreshCcw className="h-8 w-8 animate-spin text-gold/50" />
            </div>
          ) : (
            <RevenueChart data={stats.revenueHistory} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
