import { MainLayout } from '@/components/layout/main-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, CheckCircle, Ticket, Star, Rocket } from 'lucide-react';

const standardPerks = [
    "Access to all standard events",
    "Standard customer support",
    "Save your favorite events"
];

const vipPerks = [
    "Access to exclusive VIP-only events",
    "Early access to ticket sales (24 hours before public)",
    "Dedicated VIP support line",
    "Special discounts on merchandise",
    "Invitations to private meet-and-greets"
];

export default function MembershipPage() {
    return (
        <MainLayout>
            <section className="bg-card/30 border-b">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
                     <Award className="mx-auto h-16 w-16 text-muted-gold" />
                    <h1 className="font-headline text-4xl md:text-5xl font-extrabold mt-4">Mov33 VIP Membership</h1>
                    <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                        Unlock a world of exclusive experiences. Elevate your event life with priority access, special perks, and unforgettable moments.
                    </p>
                </div>
            </section>
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                    {/* Standard Card */}
                    <Card className="flex flex-col">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl">Standard</CardTitle>
                            <CardDescription>Your free account with access to amazing events.</CardDescription>
                             <p className="text-3xl font-bold pt-2">Free</p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {standardPerks.map(perk => (
                                    <li key={perk} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-muted-foreground" />
                                        <span className="text-muted-foreground">{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full" disabled>Your Current Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* VIP Card */}
                    <Card className="flex flex-col border-accent ring-2 ring-accent shadow-lg shadow-accent/10">
                        <CardHeader>
                            <CardTitle className="font-headline text-2xl flex items-center gap-2">
                                <Award className="text-muted-gold" /> VIP Access
                            </CardTitle>
                            <CardDescription>The ultimate experience for true event lovers.</CardDescription>
                            <p className="pt-2">
                                <span className="text-3xl font-bold">KES 9,999</span>
                                <span className="text-muted-foreground">/year</span>
                            </p>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <ul className="space-y-3">
                                {vipPerks.map(perk => (
                                     <li key={perk} className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-accent" />
                                        <span className="text-foreground font-medium">{perk}</span>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button className="w-full text-lg font-poppins" size="lg">
                                <Rocket className="mr-2 h-5 w-5" /> Upgrade Now
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </section>
        </MainLayout>
    );
}
