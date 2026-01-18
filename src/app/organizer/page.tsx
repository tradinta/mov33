
'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { DashboardHero } from '@/components/organizer/dashboard-hero';
import { InsightsPanel } from '@/components/organizer/insights-panel';
import { Card, CardContent } from "@/components/ui/card";
import { Activity, DollarSign, Plus, Ticket, Users } from "lucide-react";
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Input } from '@/components/ui/input';

interface DashboardStats {
  totalRevenue: number;
  ticketsSold: number;
  upcomingEvents: number;
  followers: number;
  totalCapacity: number; // Added for insights
}

export default function OrganizerDashboard() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    ticketsSold: 0,
    upcomingEvents: 0,
    followers: 0,
    totalCapacity: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      if (!profile?.uid) return;

      try {
        setLoading(true);
        const eventsRef = collection(firestore, 'events');
        const q = query(eventsRef, where('organizerId', '==', profile.uid));
        const querySnapshot = await getDocs(q);

        let revenue = 0;
        let sold = 0;
        let upcoming = 0;
        let capacity = 0;
        const now = new Date();

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          revenue += data.revenue || 0;
          sold += data.ticketsSold || 0;
          capacity += data.totalCapacity || 1000; // Mock fallback capacity
          if (new Date(data.date) > now) {
            upcoming++;
          }
        });

        setStats({
          totalRevenue: revenue,
          ticketsSold: sold,
          upcomingEvents: upcoming,
          followers: profile.followersCount || 0,
          totalCapacity: capacity
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [profile?.uid, profile?.followersCount]);

  const StatCard = ({ title, value, icon: Icon, color, trend }: any) => (
    <Card className="bg-white/5 border-white/5 backdrop-blur-sm rounded-[2rem] overflow-hidden hover:bg-white/[0.07] transition-colors relative group">
      <CardContent className="p-6 flex flex-col justify-between h-32">
        <div className="flex justify-between items-start">
          <div className={`p-2.5 rounded-xl ${color} bg-opacity-10 text-white shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <span className="text-[10px] font-black uppercase text-kenyan-green bg-kenyan-green/10 px-2 py-1 rounded-full">
              {trend}
            </span>
          )}
        </div>
        <div>
          <div className="text-3xl font-black text-white tracking-tight">{loading ? '...' : value}</div>
          <div className="text-[10px] font-bold uppercase tracking-widest text-white/40 mt-1">{title}</div>
        </div>
        {/* Decoration */}
        <div className={`absolute -bottom-4 -right-4 h-16 w-16 opacity-0 group-hover:opacity-10 transition-opacity rounded-full ${color}`} />
      </CardContent>
    </Card>
  );

  return (
    <div className="p-4 md:p-8 animate-in fade-in duration-700 min-h-screen">
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 max-w-[1600px] mx-auto">

        {/* Main Content Column */}
        <div className="xl:col-span-8 flex flex-col gap-8">
          {/* Hero Section */}
          <DashboardHero />

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Total Revenue"
              value={`KES ${(stats.totalRevenue / 1000).toFixed(1)}K`}
              icon={DollarSign}
              color="bg-gold"
              trend="+12%"
            />
            <StatCard
              title="Active Users"
              value={stats.followers.toLocaleString()}
              icon={Users}
              color="bg-blue-500"
              trend="+5%"
            />
            <StatCard
              title="Tickets Sold"
              value={stats.ticketsSold.toLocaleString()}
              icon={Ticket}
              color="bg-purple-500"
            />
            <StatCard
              title="Active Events"
              value={stats.upcomingEvents}
              icon={Activity}
              color="bg-orange-500"
            />
          </div>

          {/* Quick Tasks Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tight text-white">Quick Tasks</h3>
              <span className="text-xs text-white/40 font-poppins">Manage your daily operations</span>
            </div>

            <div className="grid gap-3">
              <div className="bg-white/5 border border-white/5 rounded-2xl p-2 flex items-center ">
                <Input
                  className="bg-transparent border-none text-white placeholder:text-white/20 focus-visible:ring-0 h-10"
                  placeholder="Add a quick task..."
                />
                <Button size="icon" className="h-8 w-8 rounded-lg bg-gold text-obsidian hover:bg-gold/90 mr-1">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full border-2 border-white/20" />
                  <span className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Review pending payout requests</span>
                </div>
                <span className="text-[10px] uppercase font-bold text-white/30 bg-white/5 px-2 py-1 rounded">Finance</span>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full border-2 border-white/20" />
                  <Link href="/organizer/events/new" className="text-sm font-medium text-white/70 group-hover:text-white transition-colors">Draft new "Summer Fest" listing</Link>
                </div>
                <span className="text-[10px] uppercase font-bold text-gold/30 bg-gold/5 px-2 py-1 rounded">Event</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="xl:col-span-4 h-full">
          <InsightsPanel
            stats={{
              totalTickets: stats.totalCapacity,
              ticketsSold: stats.ticketsSold,
              revenue: stats.totalRevenue
            }}
          />
        </div>

      </div>
    </div>
  );
}
