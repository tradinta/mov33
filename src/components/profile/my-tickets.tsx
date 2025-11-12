import { ticketsData } from "@/lib/tickets-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket, Download, Share2 } from "lucide-react";
import Image from "next/image";
import { Button } from "../ui/button";

function TicketCard({ ticket }: { ticket: typeof ticketsData[0] }) {
    const [day, month, year] = ticket.date.split(" ");
    const isPast = new Date(ticket.date) < new Date();
    return (
        <Card className="flex flex-col md:flex-row overflow-hidden hover:shadow-lg transition-shadow bg-card/50">
            <div className="md:w-1/3 relative h-48 md:h-auto min-h-[200px]">
                <Image 
                    src={ticket.imageUrl} 
                    alt={ticket.eventName} 
                    fill
                    className="object-cover"
                />
                 <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            </div>
            <div className="p-6 flex flex-col justify-between flex-1">
                <div>
                    <div className="flex justify-between items-start">
                        <p className="text-sm text-muted-foreground">{ticket.location}</p>
                        <div className="text-center w-16 bg-muted rounded-md p-1.5 border">
                            <span className="block font-bold text-lg text-accent leading-none font-headline">{day}</span>
                            <span className="block text-xs uppercase leading-none">{month}</span>
                            <span className="block text-xs text-muted-foreground leading-none">{year}</span>
                        </div>
                    </div>
                    <CardTitle className="font-headline mt-2 text-2xl">{ticket.eventName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">Ticket Type: <span className="font-semibold text-foreground">{ticket.ticketType}</span></p>
                </div>
                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                     <p className="font-poppins font-semibold text-lg">{ticket.quantity}x Ticket{ticket.quantity > 1 ? 's' : ''}</p>
                    <div className="flex gap-2">
                        {!isPast && <>
                            <Button variant="outline" size="sm">
                                <Download className="mr-2 h-4 w-4" /> Download
                            </Button>
                            <Button size="sm">
                                <Share2 className="mr-2 h-4 w-4" /> Share
                            </Button>
                        </>}
                         {isPast && 
                            <Button variant="outline" size="sm">View Receipt</Button>
                        }
                    </div>
                </div>
            </div>
        </Card>
    )
}

export function MyTickets() {
    const upcomingTickets = ticketsData.filter(t => new Date(t.date) >= new Date());
    const pastTickets = ticketsData.filter(t => new Date(t.date) < new Date());

    return (
        <div className="space-y-12">
            <div>
                <h2 className="font-headline text-3xl font-bold">Upcoming Tickets</h2>
                {upcomingTickets.length > 0 ? (
                    <div className="mt-6 space-y-6">
                        {upcomingTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
                    </div>
                ) : (
                    <div className="mt-6 text-center py-12 border-2 border-dashed rounded-lg bg-card/30">
                        <Ticket className="mx-auto h-12 w-12 text-muted-foreground" />
                        <h3 className="mt-4 text-lg font-semibold">No Upcoming Tickets</h3>
                        <p className="mt-1 text-muted-foreground">Why not explore some events?</p>
                         <Button className="mt-4">Explore Events</Button>
                    </div>
                )}
            </div>
             <div>
                <h2 className="font-headline text-3xl font-bold">Past Tickets</h2>
                {pastTickets.length > 0 ? (
                    <div className="mt-6 space-y-6">
                        {pastTickets.map(ticket => <TicketCard key={ticket.id} ticket={ticket} />)}
                    </div>
                ) : (
                    <div className="mt-6 text-center py-12 border-2 border-dashed rounded-lg bg-card/30">
                        <p className="text-muted-foreground">You have no past tickets.</p>
                    </div>
                )}
            </div>
        </div>
    )
}