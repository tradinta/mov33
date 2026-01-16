'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Bell, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-3xl font-black uppercase tracking-tighter">Control Room</h1>
        <p className="text-muted-foreground">High-level overview of system status and activity.</p>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="activity">
            Live Activity
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Quick Cards - can link to detailed analytics */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                <span className="text-xs text-muted-foreground">+20.1% from last month</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">KES 45,231.89</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <span className="text-xs text-muted-foreground">+180 since last hour</span>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">+2350</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            {/* Main Chart Placeholder */}
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>System Load</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <div className="h-[200px] flex items-center justify-center text-muted-foreground">
                  Activity Chart Component Here
                </div>
              </CardContent>
            </Card>
            {/* Recent Sales Placeholder */}
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>You made 265 sales this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {/* List of sales */}
                  <div className="flex items-center">
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none">Olivia Martin</p>
                      <p className="text-sm text-muted-foreground">olivia.martin@email.com</p>
                    </div>
                    <div className="ml-auto font-medium">+KES 1,999.00</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Audit Log</CardTitle>
              <CardDescription>Recent administrative actions.</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">No recent activity.</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>System Alerts</CardTitle>
              <CardDescription>Critical system notifications.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 bg-yellow-500/10 p-4 rounded-lg border border-yellow-500/20 text-yellow-600">
                <Activity className="h-5 w-5" />
                <div>
                  <p className="font-bold text-sm">High Traffic Detected</p>
                  <p className="text-xs">Server load spiking in Nairobi region.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

      </Tabs>
    </div>
  );
}
