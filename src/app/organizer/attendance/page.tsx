
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function AttendancePage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Attendance</CardTitle>
                <CardDescription>View attendance data for your events.</CardDescription>
            </CardHeader>
            <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
                <Users className="h-12 w-12 text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">Attendance feature coming soon.</p>
            </CardContent>
        </Card>
    );
}
