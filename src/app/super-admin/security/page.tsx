
'use client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const securityLogs = [
    { event: "Admin Login", user: "John Doe", ip: "192.168.1.1", time: "2m ago", risk: "Low" },
    { event: "Payout Processed", user: "Jane Smith", ip: "203.0.113.25", time: "15m ago", risk: "Medium" },
    { event: "Failed Login (Super)", user: "root", ip: "104.28.212.12", time: "1h ago", risk: "High" },
    { event: "Platform Settings Changed", user: "Catherine Williams", ip: "198.51.100.2", time: "3h ago", risk: "Critical" },
]

export default function SecurityPage() {
    return (
        <Card>
             <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Security Logs</CardTitle>
                    <CardDescription>Critical security-related events.</CardDescription>
                </div>
                 <Button size="sm" variant="outline">
                    Export Logs
                </Button>
            </CardHeader>
            <CardContent>
                 <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>User</TableHead>
                             <TableHead>IP Address</TableHead>
                            <TableHead>Risk</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                         {securityLogs.map(log => (
                        <TableRow key={log.time}>
                            <TableCell>
                                <div className="font-medium">{log.event}</div>
                                <div className="text-sm text-muted-foreground">{log.time}</div>
                            </TableCell>
                            <TableCell>{log.user}</TableCell>
                            <TableCell>{log.ip}</TableCell>
                            <TableCell>
                                 <Badge variant="outline" className={
                                     log.risk === "High" ? "border-amber-500 text-amber-500" : 
                                     log.risk === "Critical" ? "border-red-500 text-red-500" : ""
                                 }>
                                     {log.risk}
                                </Badge>
                            </TableCell>
                        </TableRow>
                         ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
