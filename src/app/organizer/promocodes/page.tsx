
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Ticket } from "lucide-react";

export default function PromocodesPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Promocodes</CardTitle>
                <CardDescription>Manage and create promotional codes for your events.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                <Ticket className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Promocodes feature coming soon.</p>
            </CardContent>
        </Card>
    );
}
