
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const admins = [
  { name: "John Doe", email: "john.doe@mov33.com", role: "Content Admin", status: "Active" },
  { name: "Jane Smith", email: "jane.smith@mov33.com", role: "Finance Admin", status: "Active" },
  { name: "Mike Johnson", email: "mike.j@mov33.com", role: "User Admin", status: "Inactive" },
];

export default function AdminManagementPage() {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Platform Administrators</CardTitle>
                <CardDescription>A read-only view of all platform administrators.</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {admins.map(admin => (
                        <TableRow key={admin.email}>
                            <TableCell>
                            <div className="font-medium">{admin.name}</div>
                            <div className="text-sm text-muted-foreground">{admin.email}</div>
                            </TableCell>
                            <TableCell>{admin.role}</TableCell>
                            <TableCell>
                            <Badge variant={admin.status === "Active" ? "secondary" : "outline"} className={admin.status === "Active" ? "bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300" : ""}>{admin.status}</Badge>
                            </TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
