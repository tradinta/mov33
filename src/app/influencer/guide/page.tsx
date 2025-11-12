
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen } from "lucide-react";

export default function GuidePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Influencer Guide</CardTitle>
                <CardDescription>Learn how to maximize your earnings on Mov33.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                <BookOpen className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Influencer guide coming soon.</p>
            </CardContent>
        </Card>
    );
}
