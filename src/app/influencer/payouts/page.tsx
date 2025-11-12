
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote } from "lucide-react";

export default function PayoutsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Payouts</CardTitle>
                <CardDescription>View your payout history and settings.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                <Banknote className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Payouts feature coming soon.</p>
            </CardContent>
        </Card>
    );
}
