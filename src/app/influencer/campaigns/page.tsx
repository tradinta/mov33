
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Megaphone } from "lucide-react";

export default function CampaignsPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Campaigns</CardTitle>
                <CardDescription>View your active and past campaigns.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                <Megaphone className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Campaigns feature coming soon.</p>
            </CardContent>
        </Card>
    );
}
