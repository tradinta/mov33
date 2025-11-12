'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Delete, Edit, BarChart2, Users, Settings } from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { eventsData } from '@/lib/events-data';

export default function ManageEventPage({ params }: { params: { id: string } }) {
  const event = eventsData.find((e) => e.id === params.id);

  if (!event) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
            <Button variant="outline" size="icon" asChild>
                <Link href="/organizer/events">
                    <ArrowLeft className="h-4 w-4" />
                    <span className="sr-only">Back to events</span>
                </Link>
            </Button>
            <div>
                <h1 className="text-2xl font-bold font-headline">{event.name}</h1>
                <p className="text-muted-foreground">{event.date} &middot; {event.venue}</p>
            </div>
        </div>
        <div className="flex gap-2">
            <Button variant="outline">
                <Edit className="mr-2 h-4 w-4" /> Edit Event
            </Button>
             <Button variant="destructive">
                <Delete className="mr-2 h-4 w-4" /> Delete
            </Button>
        </div>
      </div>
      
      <Tabs defaultValue="analytics" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analytics"><BarChart2 className="mr-2 h-4 w-4"/> Analytics</TabsTrigger>
          <TabsTrigger value="attendees"><Users className="mr-2 h-4 w-4"/> Attendees</TabsTrigger>
          <TabsTrigger value="settings"><Settings className="mr-2 h-4 w-4"/> Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Ticket Sales Analytics</CardTitle>
              <CardDescription>
                An overview of your ticket sales performance for this event.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Analytics Chart Coming Soon</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="attendees">
           <Card>
            <CardHeader>
              <CardTitle>Attendee List</CardTitle>
              <CardDescription>
                View all registered attendees for this event.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Attendee List Coming Soon</p>
            </CardContent>
          </Card>
        </TabsContent>
         <TabsContent value="settings">
           <Card>
            <CardHeader>
              <CardTitle>Event Settings</CardTitle>
              <CardDescription>
                Manage your event details and publishing options.
              </CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex items-center justify-center border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">Settings Form Coming Soon</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
