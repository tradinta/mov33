
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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

export default function AnalyticsPage() {
    return (
         <Card className="lg:col-span-2">
            <CardHeader>
                <CardTitle>Revenue Overview</CardTitle>
                <CardDescription>Last 6 months revenue trend.</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
                <RevenueChart />
            </CardContent>
        </Card>
    );
}
