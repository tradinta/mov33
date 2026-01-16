'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GlassCard } from '@/components/ui/glass-card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { collection, query, getDocs, where, orderBy, Timestamp, addDoc } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { Users, Eye, TrendingUp, Clock, Smartphone, Monitor, Globe, Loader2, Calendar, ArrowUpRight, ArrowDownRight, DollarSign, Ticket, Award, RefreshCw, Flame, Trophy, CreditCard, Banknote } from 'lucide-react';
import { format, subDays, parseISO } from 'date-fns';
import { motion } from 'framer-motion';

interface AnalyticsData {
  totalPageViews: number;
  uniqueSessions: number;
  uniqueUsers: number;
  topPages: { path: string; views: number }[];
  dailyViews: { date: string; views: number; users: number }[];
  deviceBreakdown: { name: string; value: number }[];
  browserBreakdown: { name: string; value: number }[];
}

interface RevenueData {
  totalRevenue: number;
  totalOrders: number;
  totalTickets: number;
  avgOrderValue: number;
  mpesaRevenue: number;
  cardRevenue: number;
  dailyRevenue: { date: string; revenue: number; orders: number }[];
  topEvents: { id: string; name: string; revenue: number; tickets: number }[];
}

interface TrendingItem {
  id: string;
  type: 'event' | 'tour';
  name: string;
  score: number;
  views: number;
  purchases: number;
}

const chartConfig = {
  views: { label: "Page Views", color: "#D4AF37" },
  users: { label: "Unique Users", color: "#228B22" },
  revenue: { label: "Revenue", color: "#D4AF37" },
  orders: { label: "Orders", color: "#228B22" },
} satisfies ChartConfig;

const COLORS = ['#D4AF37', '#228B22', '#FF6B35', '#1ABC9C', '#9B59B6', '#3498DB'];

function parseUserAgent(ua: string): { device: string; browser: string } {
  let device = 'Desktop';
  let browser = 'Other';

  if (/Mobile|Android|iPhone|iPad/i.test(ua)) {
    device = /iPad/i.test(ua) ? 'Tablet' : 'Mobile';
  }

  if (/Chrome/i.test(ua)) browser = 'Chrome';
  else if (/Safari/i.test(ua)) browser = 'Safari';
  else if (/Firefox/i.test(ua)) browser = 'Firefox';
  else if (/Edge/i.test(ua)) browser = 'Edge';

  return { device, browser };
}

export default function AnalyticsDashboard() {
  const [activeTab, setActiveTab] = useState('traffic');
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [loading, setLoading] = useState(true);
  const [trafficData, setTrafficData] = useState<AnalyticsData | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [trending, setTrending] = useState<TrendingItem[]>([]);
  const [refreshingTrending, setRefreshingTrending] = useState(false);
  const [seeding, setSeeding] = useState(false);

  // Sample data maps
  const sampleEvents = [
    { title: "Nairobi Tech Summit 2026", description: "The biggest tech conference in East Africa.", date: new Date("2026-06-15"), location: "Nairobi", venue: "KICC", price: 5000, organizerId: "org-1", category: "Tech", status: "published", items: [], ticketTiers: [{ id: 't1', tier: 'Regular', price: 5000, remaining: 100 }] },
    { title: "Sauti Sol Final Concert", description: "The legendary band performs one last time.", date: new Date("2026-02-14"), location: "Nairobi", venue: "Uhuru Gardens", price: 3500, organizerId: "org-2", category: "Music", status: "published", items: [], ticketTiers: [{ id: 't1', tier: 'VIP', price: 10000, remaining: 50 }, { id: 't2', tier: 'Regular', price: 3500, remaining: 500 }] },
    { title: "Mombasa Food Festival", description: "Taste the coast.", date: new Date("2026-04-10"), location: "Mombasa", venue: "Mama Ngina Waterfront", price: 1000, organizerId: "org-3", category: "Food", status: "published", items: [], ticketTiers: [{ id: 't1', tier: 'Entry', price: 1000, remaining: 1000 }] }
  ];

  const sampleTours = [
    { title: "Maasai Mara Migration Safari", description: "Witness the great migration.", price: 45000, organizerId: "org-4", category: "Safari", status: "published", highlights: ["Game Drive", "Camping"], includes: ["Transport", "Meals"], notIncludes: ["Tips"] },
    { title: "Mt. Kenya Hike", description: "Conquer the peak.", price: 25000, organizerId: "org-5", category: "Hiking", status: "published", highlights: ["Summit", "Guide"], includes: ["Gear", "Guide"], notIncludes: ["Personal items"] }
  ];

  const getCategoryBufferImage = (category: string) => {
    const map: Record<string, string> = {
      Tech: "https://images.unsplash.com/photo-1540575467063-178a50935278?auto=format&fit=crop&w=800&q=80",
      Music: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=800&q=80",
      Food: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
      Safari: "https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=800&q=80",
      Hiking: "https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"
    };
    return map[category] || "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80";
  };

  const handleSeedData = async () => {
    if (!confirm("This will add sample data to Firestore. Continue?")) return;
    setSeeding(true);
    try {
      const eventsCol = collection(firestore, 'events');
      for (const ev of sampleEvents) {
        await addDoc(eventsCol, {
          ...ev,
          date: Timestamp.fromDate(ev.date),
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          tags: ['Featured', ev.category],
          imageUrl: getCategoryBufferImage(ev.category)
        });
      }

      const toursCol = collection(firestore, 'tours');
      for (const tour of sampleTours) {
        await addDoc(toursCol, {
          ...tour,
          createdAt: Timestamp.now(),
          updatedAt: Timestamp.now(),
          tags: ['Featured', tour.category],
          imageUrl: getCategoryBufferImage(tour.category),
          itinerary: []
        });
      }
      alert("Seed data added successfully!");
    } catch (e) {
      console.error("Seeding error:", e);
      alert("Error seeding data.");
    } finally {
      setSeeding(false);
    }
  };

  const daysBack = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : 90;

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      await Promise.all([fetchTrafficData(), fetchRevenueData(), fetchTrending()]);
      setLoading(false);
    };
    fetchAllData();
  }, [dateRange]);

  const fetchTrafficData = async () => {
    try {
      const startDate = subDays(new Date(), daysBack);
      const q = query(
        collection(firestore, 'analytics_pageviews'),
        where('timestamp', '>=', Timestamp.fromDate(startDate)),
        orderBy('timestamp', 'desc')
      );
      const snapshot = await getDocs(q);
      const pageViews = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate?.() || new Date(),
      }));

      const uniqueUserIds = new Set(pageViews.filter(pv => pv.userId).map(pv => pv.userId));
      const uniqueSessionIds = new Set(pageViews.map(pv => pv.sessionId));

      const pageCounts: Record<string, number> = {};
      pageViews.forEach(pv => {
        pageCounts[pv.path] = (pageCounts[pv.path] || 0) + 1;
      });
      const topPages = Object.entries(pageCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([path, views]) => ({ path, views }));

      const dailyData: Record<string, { views: number; users: Set<string> }> = {};
      for (let i = 0; i < daysBack; i++) {
        const date = format(subDays(new Date(), i), 'yyyy-MM-dd');
        dailyData[date] = { views: 0, users: new Set() };
      }
      pageViews.forEach(pv => {
        const date = format(pv.timestamp, 'yyyy-MM-dd');
        if (dailyData[date]) {
          dailyData[date].views++;
          if (pv.sessionId) dailyData[date].users.add(pv.sessionId);
        }
      });
      const dailyViews = Object.entries(dailyData)
        .map(([date, { views, users }]) => ({
          date: format(parseISO(date), 'MMM dd'),
          views,
          users: users.size,
        }))
        .reverse();

      const deviceCounts: Record<string, number> = { Desktop: 0, Mobile: 0, Tablet: 0 };
      const browserCounts: Record<string, number> = {};
      pageViews.forEach(pv => {
        const { device, browser } = parseUserAgent(pv.userAgent || '');
        deviceCounts[device] = (deviceCounts[device] || 0) + 1;
        browserCounts[browser] = (browserCounts[browser] || 0) + 1;
      });

      const deviceBreakdown = Object.entries(deviceCounts).map(([name, value]) => ({ name, value }));
      const browserBreakdown = Object.entries(browserCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, value]) => ({ name, value }));

      setTrafficData({
        totalPageViews: pageViews.length,
        uniqueSessions: uniqueSessionIds.size,
        uniqueUsers: uniqueUserIds.size,
        topPages,
        dailyViews,
        deviceBreakdown,
        browserBreakdown,
      });
    } catch (error) {
      console.error('Traffic fetch error:', error);
    }
  };

  const fetchRevenueData = async () => {
    try {
      const startDate = subDays(new Date(), daysBack);
      const q = query(
        collection(firestore, 'orders'),
        where('status', '==', 'paid'),
        where('createdAt', '>=', Timestamp.fromDate(startDate))
      );
      const snapshot = await getDocs(q);

      let totalRevenue = 0, totalOrders = 0, totalTickets = 0, mpesa = 0, card = 0;
      const eventData: Record<string, { name: string; revenue: number; tickets: number }> = {};
      const dailyRev: Record<string, { revenue: number; orders: number }> = {};

      for (let i = 0; i < daysBack; i++) {
        dailyRev[format(subDays(new Date(), i), 'yyyy-MM-dd')] = { revenue: 0, orders: 0 };
      }

      snapshot.docs.forEach(doc => {
        const data = doc.data();
        totalOrders++;
        totalRevenue += data.total || 0;

        if (data.paymentGateway === 'mpesa') mpesa += data.total || 0;
        else card += data.total || 0;

        const date = data.createdAt?.toDate?.() ? format(data.createdAt.toDate(), 'yyyy-MM-dd') : null;
        if (date && dailyRev[date]) {
          dailyRev[date].revenue += data.total || 0;
          dailyRev[date].orders++;
        }

        data.items?.forEach((item: any) => {
          const id = item.id?.split('-')[0] || item.id;
          totalTickets += item.quantity || 1;
          if (!eventData[id]) eventData[id] = { name: item.name, revenue: 0, tickets: 0 };
          eventData[id].revenue += (item.price || 0) * (item.quantity || 1);
          eventData[id].tickets += item.quantity || 1;
        });
      });

      const dailyRevenue = Object.entries(dailyRev)
        .map(([date, data]) => ({ date: format(parseISO(date), 'MMM dd'), ...data }))
        .reverse();

      const topEvents = Object.entries(eventData)
        .map(([id, data]) => ({ id, ...data }))
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, 10);

      setRevenueData({
        totalRevenue,
        totalOrders,
        totalTickets,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
        mpesaRevenue: mpesa,
        cardRevenue: card,
        dailyRevenue,
        topEvents,
      });
    } catch (error) {
      console.error('Revenue fetch error:', error);
    }
  };

  const fetchTrending = async () => {
    try {
      const res = await fetch('/api/trending');
      const data = await res.json();
      setTrending(data.trending || []);
    } catch (error) {
      console.error('Trending fetch error:', error);
    }
  };

  const refreshTrending = async () => {
    setRefreshingTrending(true);
    try {
      await fetch('/api/trending/update');
      await fetchTrending();
    } catch (error) {
      console.error('Trending refresh error:', error);
    }
    setRefreshingTrending(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-black uppercase tracking-tighter">Analytics</h1>
            <p className="text-muted-foreground mt-2">Complete platform performance insights</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              onClick={handleSeedData}
              disabled={seeding}
              className="bg-gold/10 text-gold border-gold/20 hover:bg-gold hover:text-obsidian"
            >
              {seeding ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <TrendingUp className="h-4 w-4 mr-2" />}
              {seeding ? 'Seeding...' : 'Seed Data'}
            </Button>
            <Tabs value={dateRange} onValueChange={(v) => setDateRange(v as typeof dateRange)}>
              <TabsList className="bg-muted border border-border">
                <TabsTrigger value="7d" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">7 Days</TabsTrigger>
                <TabsTrigger value="30d" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">30 Days</TabsTrigger>
                <TabsTrigger value="90d" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian">90 Days</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted border border-border h-14 p-1">
            <TabsTrigger value="traffic" className="h-12 px-6 data-[state=active]:bg-gold data-[state=active]:text-obsidian">
              <Eye className="h-4 w-4 mr-2" /> Traffic
            </TabsTrigger>
            <TabsTrigger value="revenue" className="h-12 px-6 data-[state=active]:bg-gold data-[state=active]:text-obsidian">
              <DollarSign className="h-4 w-4 mr-2" /> Revenue
            </TabsTrigger>
            <TabsTrigger value="events" className="h-12 px-6 data-[state=active]:bg-gold data-[state=active]:text-obsidian">
              <Ticket className="h-4 w-4 mr-2" /> Events
            </TabsTrigger>
            <TabsTrigger value="trending" className="h-12 px-6 data-[state=active]:bg-gold data-[state=active]:text-obsidian">
              <Flame className="h-4 w-4 mr-2" /> Trending
            </TabsTrigger>
          </TabsList>

          {/* Traffic Tab */}
          <TabsContent value="traffic" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Total Views</p>
                    <p className="text-4xl font-black mt-2">{trafficData?.totalPageViews.toLocaleString()}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gold/10 flex items-center justify-center">
                    <Eye className="h-7 w-7 text-gold" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Sessions</p>
                    <p className="text-4xl font-black mt-2">{trafficData?.uniqueSessions.toLocaleString()}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-kenyan-green/10 flex items-center justify-center">
                    <Users className="h-7 w-7 text-kenyan-green" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Logged-in Users</p>
                    <p className="text-4xl font-black mt-2">{trafficData?.uniqueUsers}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-blue-400" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Top Page</p>
                    <p className="text-xl font-black mt-2 truncate">{trafficData?.topPages[0]?.path || '/'}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <Globe className="h-7 w-7 text-purple-400" />
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2 p-6 border-white/5">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Daily Traffic</h3>
                <div className="h-80">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trafficData?.dailyViews || []}>
                        <defs>
                          <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#D4AF37" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#D4AF37" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Area type="monotone" dataKey="views" stroke="#D4AF37" fillOpacity={1} fill="url(#colorViews)" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Devices</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={trafficData?.deviceBreakdown || []} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                        {trafficData?.deviceBreakdown.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center gap-6 mt-4">
                  {trafficData?.deviceBreakdown.map((item, index) => (
                    <div key={item.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                      <span className="text-xs text-muted-foreground">{item.name}</span>
                    </div>
                  ))}
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Revenue Tab */}
          <TabsContent value="revenue" className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <GlassCard className="p-6 border-gold/20 bg-gold/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-gold/60 font-black">Total Revenue</p>
                    <p className="text-4xl font-black mt-2 text-gold">KES {revenueData?.totalRevenue.toLocaleString()}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-gold/20 flex items-center justify-center">
                    <DollarSign className="h-7 w-7 text-gold" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Orders</p>
                    <p className="text-4xl font-black mt-2">{revenueData?.totalOrders}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-kenyan-green/10 flex items-center justify-center">
                    <Ticket className="h-7 w-7 text-kenyan-green" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Tickets Sold</p>
                    <p className="text-4xl font-black mt-2">{revenueData?.totalTickets}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center">
                    <Award className="h-7 w-7 text-blue-400" />
                  </div>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-widest text-muted-foreground font-black">Avg Order Value</p>
                    <p className="text-4xl font-black mt-2">KES {Math.round(revenueData?.avgOrderValue || 0).toLocaleString()}</p>
                  </div>
                  <div className="h-14 w-14 rounded-2xl bg-purple-500/10 flex items-center justify-center">
                    <TrendingUp className="h-7 w-7 text-purple-400" />
                  </div>
                </div>
              </GlassCard>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <GlassCard className="lg:col-span-2 p-6 border-white/5">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Revenue Over Time</h3>
                <div className="h-80">
                  <ChartContainer config={chartConfig} className="w-full h-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={revenueData?.dailyRevenue || []}>
                        <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}K`} />
                        <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                        <Line type="monotone" dataKey="revenue" stroke="#D4AF37" strokeWidth={3} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </div>
              </GlassCard>
              <GlassCard className="p-6 border-white/5">
                <h3 className="text-lg font-bold uppercase tracking-widest mb-6">Payment Methods</h3>
                <div className="space-y-6 mt-8">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-kenyan-green/20 flex items-center justify-center">
                      <Smartphone className="h-6 w-6 text-kenyan-green" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-sm">M-Pesa</span>
                        <span className="font-black text-kenyan-green">KES {revenueData?.mpesaRevenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full">
                        <div className="h-full bg-kenyan-green rounded-full" style={{ width: `${((revenueData?.mpesaRevenue || 0) / (revenueData?.totalRevenue || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-gold/20 flex items-center justify-center">
                      <CreditCard className="h-6 w-6 text-gold" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-sm">Card/Paystack</span>
                        <span className="font-black text-gold">KES {revenueData?.cardRevenue.toLocaleString()}</span>
                      </div>
                      <div className="h-2 bg-white/10 rounded-full">
                        <div className="h-full bg-gold rounded-full" style={{ width: `${((revenueData?.cardRevenue || 0) / (revenueData?.totalRevenue || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          {/* Events Tab */}
          <TabsContent value="events" className="mt-8 space-y-6">
            <GlassCard className="p-6 border-white/5">
              <h3 className="text-lg font-bold uppercase tracking-widest mb-6 flex items-center gap-3">
                <Trophy className="h-5 w-5 text-gold" />
                Top Performing Events
              </h3>
              <div className="space-y-4">
                {revenueData?.topEvents.map((event, idx) => (
                  <div key={event.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center font-black ${idx === 0 ? 'bg-gold text-obsidian' : idx === 1 ? 'bg-accent/80' : idx === 2 ? 'bg-orange-500/20 text-orange-400' : 'bg-accent/40 text-muted-foreground'}`}>
                        {idx + 1}
                      </div>
                      <div>
                        <p className="font-bold">{event.name}</p>
                        <p className="text-xs text-white/40">{event.tickets} tickets sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-gold">KES {event.revenue.toLocaleString()}</p>
                    </div>
                  </div>
                ))}
                {(!revenueData?.topEvents || revenueData.topEvents.length === 0) && (
                  <p className="text-center text-muted-foreground py-8">No event data available for this period</p>
                )}
              </div>
            </GlassCard>
          </TabsContent>

          {/* Trending Tab */}
          <TabsContent value="trending" className="mt-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold uppercase tracking-widest flex items-center gap-3">
                  <Flame className="h-5 w-5 text-orange-500" />
                  Trending Now
                </h3>
                <p className="text-muted-foreground text-sm mt-1">Updates every 85 hours based on views & purchases</p>
              </div>
              <Button variant="outline" onClick={refreshTrending} disabled={refreshingTrending} className="border-white/10">
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshingTrending ? 'animate-spin' : ''}`} />
                Refresh Now
              </Button>
            </div>
            <GlassCard className="p-6 border-white/5">
              <div className="space-y-4">
                {trending.map((item, idx) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-accent/50 rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-orange-500/20 flex items-center justify-center">
                        <Flame className="h-5 w-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="font-bold">{item.name}</p>
                        <p className="text-xs text-white/40">{item.type === 'event' ? 'Event' : 'Tour'} • {item.views} views • {item.purchases} purchases</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-orange-500">Score: {item.score.toFixed(1)}</p>
                    </div>
                  </div>
                ))}
                {trending.length === 0 && (
                  <p className="text-center text-muted-foreground py-8">No trending data yet. Click &quot;Refresh Now&quot; to calculate.</p>
                )}
              </div>
            </GlassCard>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
