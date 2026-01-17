'use client';

import React, { useEffect, useState } from 'react';
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
import { PlusCircle, Loader2, Calendar, MapPin, Eye } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/context/auth-context';
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { firestore } from '@/firebase';
import { EventListing, TourListing } from '@/lib/types';

export default function OrganizerListingsPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState<EventListing[]>([]);
  const [tours, setTours] = useState<TourListing[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      if (!profile?.uid) return;

      try {
        setLoading(true);
        // Fetch Events
        const eventsRef = collection(firestore, 'events');
        const eq = query(eventsRef, where('organizerId', '==', profile.uid), orderBy('date', 'desc'));
        const eventSnap = await getDocs(eq);
        const eventList = eventSnap.docs.map(doc => {
          const data = doc.data();
          // Convert Firebase Timestamp to string if necessary
          let dateStr = data.date;
          if (data.date && typeof data.date.toDate === 'function') {
            dateStr = data.date.toDate().toLocaleDateString();
          }
          return { id: doc.id, ...data, date: dateStr } as EventListing;
        });
        setEvents(eventList);

        // Fetch Tours
        const toursRef = collection(firestore, 'tours');
        const tq = query(toursRef, where('organizerId', '==', profile.uid));
        const tourSnap = await getDocs(tq);
        const tourList = tourSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as TourListing));
        setTours(tourList);
      } catch (error) {
        console.error("Error fetching listings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [profile?.uid]);

  const StatusBadge = ({ date }: { date: string }) => {
    const eventDate = new Date(date);
    const now = new Date();
    if (eventDate > now) {
      return (
        <Badge variant="outline" className="bg-kenyan-green/10 text-kenyan-green border-kenyan-green/20 uppercase text-[10px] font-bold">
          Active
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-white/5 text-muted-foreground border-white/10 uppercase text-[10px] font-bold">
        Past
      </Badge>
    );
  };

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Tabs defaultValue="events" className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black font-headline uppercase tracking-tighter">Your Platform Listings</h1>
            <p className="text-muted-foreground font-poppins text-sm leading-relaxed">
              Central command for your events and curated tour experiences.
            </p>
          </div>
          <TabsList className="grid w-full grid-cols-2 max-w-md bg-white/5 border border-white/10">
            <TabsTrigger value="events" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian font-bold">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="tours" className="data-[state=active]:bg-gold data-[state=active]:text-obsidian font-bold">Tours ({tours.length})</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="events" className="space-y-4">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Event Management</CardTitle>
                <CardDescription className="text-xs font-poppins">
                  Complete list of your published and draft events.
                </CardDescription>
              </div>
              <Button size="sm" asChild className="bg-gold hover:bg-gold/90 text-obsidian font-bold rounded-xl h-10 px-6 border-none">
                <Link href="/organizer/events/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Event
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gold/50" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-white/[0.02]">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="py-4 text-xs font-bold uppercase tracking-widest">Event Identity</TableHead>
                      <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest">Date & Time</TableHead>
                      <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest">Commercials</TableHead>
                      <TableHead className="text-right text-xs font-bold uppercase tracking-widest">Operations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {events.map((event) => (
                      <TableRow key={event.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
                              {event.imageUrl ? (
                                <picture>
                                  <img src={event.imageUrl} alt="" className="h-full w-full object-cover" />
                                </picture>
                              ) : (
                                <Calendar className="h-5 w-5 text-gold/40" />
                              )}
                            </div>
                            <div>
                              <div className="font-black text-sm uppercase tracking-tight group-hover:text-gold transition-colors">{event.name}</div>
                              <div className="flex items-center gap-2 mt-1">
                                <StatusBadge date={event.date} />
                                <span className="text-[10px] text-muted-foreground uppercase flex items-center gap-1">
                                  <MapPin className="h-2 w-2" /> {event.location || 'Nairobi'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs font-poppins font-medium text-white/90">{event.date}</div>
                          <div className="text-[10px] text-muted-foreground uppercase">{event.time || '18:00'} EAT</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs font-bold text-kenyan-green">{event.ticketsSold || 0} Sold</div>
                          <div className="text-[10px] text-muted-foreground uppercase">Target: {event.totalCapacity || 1000}</div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <div className="flex justify-end gap-2">
                            <Button size="sm" asChild variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5">
                              <Link href={`/events/${event.id}`} target="_blank">
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              </Link>
                            </Button>
                            <Button size="sm" asChild variant="outline" className="h-8 px-4 rounded-lg border-white/10 hover:border-gold/50 hover:bg-gold/10 text-xs font-bold group/btn">
                              <Link href={`/organizer/events/${event.id}`} className="group-hover/btn:text-gold">
                                Manage
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {events.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-poppins text-sm italic border-none">
                          No events found. Start by creating your first listing.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tours">
          <Card className="bg-white/5 border-white/10 backdrop-blur-md overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between border-b border-white/5 pb-6">
              <div>
                <CardTitle className="text-xl font-black uppercase tracking-tight">Tour Packages</CardTitle>
                <CardDescription className="text-xs font-poppins">
                  Manage your multi-day tours and safari experiences.
                </CardDescription>
              </div>
              <Button size="sm" asChild className="bg-gold hover:bg-gold/90 text-obsidian font-bold rounded-xl h-10 px-6 border-none">
                <Link href="/organizer/tours/new">
                  <PlusCircle className="mr-2 h-4 w-4" /> New Tour
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="flex items-center justify-center p-12">
                  <Loader2 className="h-8 w-8 animate-spin text-gold/50" />
                </div>
              ) : (
                <Table>
                  <TableHeader className="bg-white/[0.02]">
                    <TableRow className="border-white/5 hover:bg-transparent">
                      <TableHead className="py-4 text-xs font-bold uppercase tracking-widest">Package Name</TableHead>
                      <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest">Destination</TableHead>
                      <TableHead className="hidden md:table-cell text-xs font-bold uppercase tracking-widest">Booking Stats</TableHead>
                      <TableHead className="text-right text-xs font-bold uppercase tracking-widest">Operations</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {tours.map((tour) => (
                      <TableRow key={tour.id} className="border-white/5 hover:bg-white/[0.02] transition-colors group">
                        <TableCell className="py-5">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden text-gold/40">
                              <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                              <div className="font-black text-sm uppercase tracking-tight group-hover:text-gold transition-colors">{tour.name}</div>
                              <div className="text-[10px] text-muted-foreground uppercase flex items-center gap-1 mt-1 font-bold">
                                {tour.duration || '3 Days'} Package
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs font-bold text-white/90">{tour.destination}</div>
                        </TableCell>
                        <TableCell className="hidden md:table-cell">
                          <div className="text-xs font-bold text-kenyan-green">{tour.bookings || 0} Booked</div>
                        </TableCell>
                        <TableCell className="text-right pr-6">
                          <Button size="sm" asChild variant="outline" className="h-8 px-4 rounded-lg border-white/10 hover:border-gold/50 hover:bg-gold/10 text-xs font-bold group/btn">
                            <Link href={`/tours/${tour.id}`} className="group-hover/btn:text-gold">Manage</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {tours.length === 0 && !loading && (
                      <TableRow>
                        <TableCell colSpan={4} className="h-32 text-center text-muted-foreground font-poppins text-sm italic border-none">
                          You haven't listed any tours yet.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
