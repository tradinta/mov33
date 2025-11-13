import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, Megaphone, Ticket } from 'lucide-react';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Partner with Us | Mov33',
  description: 'Grow your brand and reach new audiences by partnering with Mov33. Join as an event organizer or influencer.',
};

const organizerPerks = [
    "Powerful dashboard to manage events",
    "Reach a dedicated audience of event-goers",
    "Seamless ticketing and secure payouts",
    "Advanced analytics and sales insights",
]

const influencerPerks = [
    "Monetize your influence with unique promo codes",
    "Get exclusive access to the hottest events",
    "Partner with top event organizers",
    "Track your commissions in real-time"
]


export default function PartnerPage() {
    return (
        <div className="bg-background">
             <section className="bg-card/30 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold">Partner with Mov33</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Whether you create unforgettable events or captivate audiences, we provide the tools to help you grow.
                    </p>
                </div>
            </section>
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
                    {/* Organizer Card */}
                    <Card className="flex flex-col border-2 border-accent/50 shadow-lg">
                        <CardHeader className="items-center text-center">
                            <Ticket className="h-12 w-12 text-accent" />
                            <CardTitle className="font-headline text-3xl mt-4">For Event Organizers</CardTitle>
                            <CardDescription className="max-w-sm">
                                Create, manage, and promote your events with our powerful, easy-to-use platform.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow p-6">
                            <ul className="space-y-3">
                                {organizerPerks.map(perk => (
                                    <li key={perk} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-accent flex-shrink-0 mt-1" />
                                        <span className="text-foreground">{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                             <Button asChild size="lg" className="w-full font-poppins text-lg">
                                <Link href="/partner/organizer-application">Apply as an Organizer</Link>
                            </Button>
                        </CardFooter>
                    </Card>

                    {/* Influencer Card */}
                    <Card className="flex flex-col">
                        <CardHeader className="items-center text-center">
                            <Megaphone className="h-12 w-12 text-primary" />
                            <CardTitle className="font-headline text-3xl mt-4">For Influencers</CardTitle>
                            <CardDescription className="max-w-sm">
                                Monetize your content and share exclusive event experiences with your audience.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow p-6">
                             <ul className="space-y-3">
                                {influencerPerks.map(perk => (
                                    <li key={perk} className="flex items-start gap-3">
                                        <Check className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1" />
                                        <span className="text-foreground">{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                             <Button asChild size="lg" className="w-full font-poppins text-lg" variant="outline">
                                <Link href="/partner/influencer-application">Join as an Influencer</Link>
                            </Button>
                        </CardFooter>
                    </Card>
                 </div>
            </section>
        </div>
    )
}
