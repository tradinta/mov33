
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function ProfilePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Organizer Profile</CardTitle>
                <CardDescription>Manage your public organizer profile.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                <User className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Profile management feature coming soon.</p>
            </CardContent>
        </Card>
    );
}
