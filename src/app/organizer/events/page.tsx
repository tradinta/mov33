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
import { PlusCircle, ArrowUpRight } from 'lucide-react';
import { eventsData } from '@/lib/events-data';

// We'll just show events for the Kenya Rugby Union for this demo
const organizerEvents = eventsData.filter(
  (event) => event.organizerId === 'kenya-rugby-union'
);

export default function OrganizerEventsPage() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Your Events</CardTitle>
          <CardDescription>
            View and manage all your event listings.
          </CardDescription>
        </div>
        <Button size="sm" asChild>
          <Link href="/organizer/events/new">
            <PlusCircle className="mr-2 h-4 w-4" /> Create New Event
          </Link>
        </Button>
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
  );
}
