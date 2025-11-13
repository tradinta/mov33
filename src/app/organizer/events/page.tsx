
'use client';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { eventsData } from '@/lib/events-data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toursData } from '@/lib/tours-data';

// We'll just show data for one organizer for this demo
const ORGANIZER_ID = 'kenya-rugby-union';
const organizerEvents = eventsData.filter(
  (event) => event.organizerId === ORGANIZER_ID
);
const organizerTours = toursData.filter(
  (tour) => tour.organizer.id === ORGANIZER_ID
);

export default function OrganizerListingsPage() {
  return (
    <Tabs defaultValue="events">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold font-headline">Your Listings</h1>
          <p className="text-muted-foreground">
            View and manage all your event and tour listings.
          </p>
        </div>
        <div className='flex gap-2'>
           <Button size="sm" asChild>
            <Link href="/organizer/events/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
            </Link>
          </Button>
           <Button size="sm" variant="outline" asChild>
            <Link href="/organizer/tours/new">
              <PlusCircle className="mr-2 h-4 w-4" /> Create New Tour
            </Link>
          </Button>
        </div>
      </div>
      <TabsList className="grid w-full grid-cols-2 max-w-md">
        <TabsTrigger value="events">Events ({organizerEvents.length})</TabsTrigger>
        <TabsTrigger value="tours">Tours ({organizerTours.length})</TabsTrigger>
      </TabsList>
      <TabsContent value="events">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Event Listings</CardTitle>
            <CardDescription>
              Your upcoming and past event listings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Event</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Tickets Sold
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizerEvents.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>
                      <div className="font-medium">{event.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {event.date}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                        Published
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">523 / 1000</TableCell>
                    <TableCell className="text-right">
                        <Button size="sm" asChild variant="outline">
                            <Link href={`/organizer/events/${event.id}`}>Manage</Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
       <TabsContent value="tours">
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Tour Listings</CardTitle>
            <CardDescription>
              Your active and past tour packages.
            </CardDescription>
          </CardHeader>
          <CardContent>
             <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tour</TableHead>
                  <TableHead className="hidden md:table-cell">Status</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Bookings
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {organizerTours.map((tour) => (
                  <TableRow key={tour.id}>
                    <TableCell>
                      <div className="font-medium">{tour.name}</div>
                      <div className="text-sm text-muted-foreground md:hidden">
                        {tour.destination}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">
                        Active
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">124</TableCell>
                    <TableCell className="text-right">
                        <Button size="sm" asChild variant="outline">
                            {/* This link would go to a tour management page */}
                            <Link href={`/tours/${tour.id}`}>Manage</Link>
                        </Button>
                    </TableCell>
                  </TableRow>
                ))}
                 {organizerTours.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            You have no tour listings.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
       </TabsContent>
    </Tabs>
  );
}
