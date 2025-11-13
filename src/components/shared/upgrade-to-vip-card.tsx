import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Rocket } from 'lucide-react';

export function UpgradeToVipCard() {
    return (
        <Card className="bg-gradient-to-br from-card/50 via-card/70 to-muted-gold/10 border-muted-gold shadow-lg shadow-black/10">
            <CardHeader className="items-center text-center">
                <div className="p-4 bg-muted-gold/10 rounded-full border-2 border-muted-gold/20">
                     <Award className="h-10 w-10 text-muted-gold" />
                </div>
                <CardTitle className="font-headline text-2xl mt-4">This is a VIP Event</CardTitle>
                <CardDescription className="max-w-md">
                    To book tickets for this exclusive event, you need to be a Mov33 VIP member. Unlock this and many other perks by upgrading your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
                <Link href="/membership">
                    <Button size="lg" className="bg-muted-gold hover:bg-muted-gold/90 text-white font-poppins text-lg">
                        <Rocket className="mr-2 h-5 w-5" /> Upgrade to VIP
                    </Button>
                </Link>
            </CardContent>
        </Card>
    );
}
