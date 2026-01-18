'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Activity,
  ArrowUpRight,
  Calendar as CalendarIcon,
  Clock,
  Download,
  Layout,
  MoreHorizontal,
  Plus,
  Search,
  Sun,
  TrendingUp,
  Users as UsersIcon,
  Ticket,
  CheckCircle2,
  Timer,
  Zap
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from '@/context/auth-context';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

const data = [
  { name: 'Mon', value: 4000 },
  { name: 'Tue', value: 3000 },
  { name: 'Wed', value: 2000 },
  { name: 'Thu', value: 2780 },
  { name: 'Fri', value: 1890 },
  { name: 'Sat', value: 2390 },
  { name: 'Sun', value: 3490 },
];

const metrics = [
  { title: 'Total Events', value: '124', trend: '+12%', icon: Ticket, color: 'text-gold' },
  { title: 'Active Users', value: '1,847', trend: '+15.2%', icon: UsersIcon, color: 'text-kenyan-green' },
  { title: 'Revenue (KES)', value: '1.2M', trend: '+8.4%', icon: TrendingUp, color: 'text-blue-500' },
  { title: 'Avg. Load', value: '320ms', trend: '-10%', icon: Activity, color: 'text-purple-500' },
];

export default function AdminOverviewPage() {
  const { profile } = useAuth();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const greeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return "Rise and shine";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };

  return (
    <div className="space-y-10 pb-20">
      {/* Header / Breadcrumbs */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">
            <Layout className="h-3 w-3" />
            <span>Staff Console</span>
            <MoreHorizontal className="h-3 w-3" />
            <span className="text-foreground">Overview</span>
          </div>
          <h1 className="text-4xl font-headline font-black uppercase italic tracking-tighter text-foreground">
            Overview
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Monitor key metrics and manage your platform in real-time.</p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-11 px-6 rounded-2xl border-border/50 bg-background/50 backdrop-blur-xl font-bold uppercase tracking-widest text-[10px] gap-2">
            <CalendarIcon className="h-4 w-4" />
            This Month
          </Button>
          <Button className="h-11 px-6 rounded-2xl bg-foreground dark:bg-white text-background dark:text-obsidian font-bold uppercase tracking-widest text-[10px] gap-2 shadow-xl shadow-foreground/10 hover:scale-[1.02] transition-transform">
            <Download className="h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 relative overflow-hidden rounded-[3rem] border border-border/50 bg-gradient-to-br from-background via-background to-gold/5 p-10 group">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gold/10 rounded-full blur-[100px] -mr-48 -mt-48 group-hover:bg-gold/20 transition-all duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-kenyan-green/5 rounded-full blur-[80px] -ml-32 -mb-32" />

          <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10">
            <div className="space-y-6">
              <div className="space-y-2">
                <h2 className="text-5xl font-headline font-black text-foreground leading-tight tracking-tighter">
                  {greeting()}, <br />
                  <span className="text-gold italic">{profile?.displayName?.split(' ')[0] || 'Admin'}!</span>
                </h2>
                <p className="text-lg text-muted-foreground font-medium flex items-center gap-2">
                  Ready to make today productive! 🚀
                </p>
              </div>

              <div className="flex flex-col gap-1">
                <span className="text-6xl font-black text-foreground tracking-tighter tabular-nums drop-shadow-2xl">
                  {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }).split(' ')[0]}
                  <span className="text-2xl font-black text-muted-foreground ml-2">
                    {currentTime.toLocaleTimeString([], { hour12: true }).split(' ')[1]}
                  </span>
                </span>
                <span className="text-xs font-black uppercase tracking-widest text-muted-foreground/60">
                  {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end justify-center gap-4 bg-muted/30 backdrop-blur-3xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl min-w-[200px]">
              <Sun className="h-16 w-16 text-gold animate-pulse" />
              <div className="text-center md:text-right">
                <span className="text-4xl font-black text-foreground tracking-tighter">24°C</span>
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mt-1">Nairobi, Kenya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Insights Ring Card */}
        <div className="rounded-[3rem] border border-border/50 bg-muted/30 backdrop-blur-xl p-10 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Analytics</span>
            <h3 className="text-2xl font-headline font-black uppercase text-foreground">Insights</h3>
          </div>

          <div className="relative flex items-center justify-center py-6">
            <svg className="h-48 w-48 -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                className="stroke-muted/20 fill-none"
                strokeWidth="24"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="80"
                className="stroke-gold fill-none"
                strokeWidth="24"
                strokeLinecap="round"
                initial={{ strokeDasharray: "0 502" }}
                animate={{ strokeDasharray: "426 502" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-5xl font-black text-foreground tracking-tighter">85%</span>
              <span className="text-[8px] font-black uppercase tracking-widest text-muted-foreground">Optimal health</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-muted-foreground">Server Load</span>
              <span className="text-foreground">Minimal</span>
            </div>
            <Progress value={20} className="h-2 bg-muted/50 rounded-full" />
          </div>
        </div>
      </div>

      {/* Quick Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group p-8 rounded-[2rem] border border-border/50 bg-background/50 backdrop-blur-xl hover:border-gold/30 hover:bg-gold/5 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-3 rounded-2xl bg-background shadow-lg group-hover:scale-110 transition-transform", metric.color)}>
                <metric.icon className="h-6 w-6" />
              </div>
              <span className="text-[10px] font-black text-kenyan-green bg-kenyan-green/10 px-2 py-1 rounded-full">
                {metric.trend}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{metric.title}</p>
              <p className="text-3xl font-black text-foreground tracking-tighter">{metric.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="xl:col-span-2 rounded-[3.5rem] border border-border/50 bg-background/50 backdrop-blur-xl p-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-2xl font-headline font-black uppercase text-foreground">Revenue Analytics</h3>
              <p className="text-xs text-muted-foreground font-medium">Daily revenue breakdown for the current period.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon" className="rounded-xl h-10 w-10 border border-border/50">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="h-[350px] w-full mt-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fontWeight: 800, fill: 'rgba(255,255,255,0.3)' }}
                  dy={10}
                />
                <YAxis
                  hide
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    fontSize: '10px',
                    fontWeight: '800',
                    textTransform: 'uppercase'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#D4AF37"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorValue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Sidebar Cards */}
        <div className="space-y-8">
          {/* Quick Tasks */}
          <div className="rounded-[3rem] border border-border/50 bg-background/50 backdrop-blur-xl p-10 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-headline font-black uppercase text-foreground">Quick Tasks</h3>
              <Button size="icon" className="h-8 w-8 rounded-xl bg-gold text-obsidian shadow-lg shadow-gold/20 hover:scale-110 transition-transform">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              {[
                { t: 'Approve new event tier', c: true },
                { t: 'Update organizer roles', c: false },
                { t: 'Review analytics report', c: false },
              ].map((task, i) => (
                <div key={i} className="flex items-center gap-4 group cursor-pointer">
                  <div className={cn(
                    "h-6 w-6 rounded-lg border-2 flex items-center justify-center transition-all",
                    task.c ? "bg-gold border-gold" : "border-border/50 group-hover:border-gold"
                  )}>
                    {task.c && <CheckCircle2 className="h-4 w-4 text-obsidian" />}
                  </div>
                  <span className={cn(
                    "text-xs font-bold transition-all",
                    task.c ? "text-muted-foreground line-through" : "text-foreground group-hover:translate-x-1"
                  )}>
                    {task.t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Insights */}
          <div className="rounded-[3rem] border border-border/50 bg-gradient-to-br from-kenyan-green/10 to-transparent backdrop-blur-xl p-8 space-y-6 relative overflow-hidden group">
            <Zap className="absolute -right-6 -bottom-6 h-24 w-24 text-kenyan-green/10 -rotate-12 transition-transform duration-700 group-hover:scale-125 group-hover:rotate-0" />
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-kenyan-green/60">Optimization</span>
              <h4 className="text-lg font-headline font-black uppercase text-foreground leading-none">Vibe Score: 9.2</h4>
            </div>
            <p className="text-[10px] font-medium text-muted-foreground leading-relaxed">
              Event matching is performing at peak efficiency. Conversions are up <span className="text-kenyan-green font-black">2.4%</span> this morning.
            </p>
            <Button variant="link" className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-kenyan-green hover:no-underline gap-1">
              View Deep Insights <ArrowUpRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(' ');
}
