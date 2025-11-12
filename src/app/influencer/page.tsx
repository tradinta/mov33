
'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { DollarSign, Users, Ticket, Activity } from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";

const commissionData = [
  { month: "Jan", commission: 12000 },
  { month: "Feb", commission: 18000 },
  { month: "Mar", commission: 15000 },
  { month: "Apr", commission: 22000 },
  { month: "May", commission: 25000 },
  { month: "Jun", commission: 30000 },
];

const chartConfig = {
  commission: {
    label: "Commission",
    color: "hsl(var(--accent))",
  },
} satisfies ChartConfig;


function CommissionChart() {
    return (
      <ChartContainer config={chartConfig} className="w-full h-full">
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={commissionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                 <defs>
                    <linearGradient id="colorCommission" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-commission)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-commission)" stopOpacity={0}/>
                    </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `KES ${Number(value) / 1000}K`} />
                <Tooltip content={<ChartTooltipContent indicator="dot" />} />
                <Area type="monotone" dataKey="commission" stroke="var(--color-commission)" fillOpacity={1} fill="url(#colorCommission)" />
            </AreaChart>
        </ResponsiveContainer>
      </ChartContainer>
    )
}


export default function InfluencerDashboard() {
  return (
    <div className="space-y-8">
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-bold font-headline">Welcome, Alex</h1>
                <p className="text-muted-foreground">Here's your campaign performance overview.</p>
            </div>
        </div>

      <section>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Commission</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">KES 122,000</div>
              <p className="text-xs text-muted-foreground">+25.2% from last month</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
              <Ticket className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+152</div>
              <p className="text-xs text-muted-foreground">+80.1% from last month</p>
            </CardContent>
          </Card>
           <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">1 campaign ending this week</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Link Clicks</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,540</div>
              <p className="text-xs text-muted-foreground">+500 this month</p>
            </CardContent>
          </Card>
        </div>
      </section>

       <Card>
            <CardHeader>
                <CardTitle>Commission Overview</CardTitle>
                <CardDescription>Last 6 months commission trend.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                <CommissionChart />
            </CardContent>
        </Card>

    </div>
  );
}
