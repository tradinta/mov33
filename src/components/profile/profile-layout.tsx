
'use client';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Award, CreditCard, Heart, History, LogOut, Ticket, User, Wallpaper } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navItems = [
    { href: "/profile", label: "My Tickets", icon: Ticket },
    { href: "/profile/favorites", label: "Favorites", icon: Heart },
    { href: "/profile/transactions", label: "Transactions", icon: CreditCard },
    { href: "/profile/view-history", label: "View History", icon: History },
    { href: "/profile/promo-codes", label: "Promo Codes", icon: Award },
    { href: "/profile/settings", label: "Account Settings", icon: User },
];

function ProfileSidebar() {
    const pathname = usePathname();
    return (
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0">
            <div className="space-y-2">
                {navItems.map(item => (
                    <Link href={item.href} key={item.label}>
                         <Button variant="ghost" className={cn(
                            "w-full justify-start text-base",
                            pathname === item.href ? "bg-accent/10 text-accent" : ""
                         )}>
                            <item.icon className="mr-3 h-5 w-5" />
                            {item.label}
                        </Button>
                    </Link>
                ))}
            </div>
            <Separator className="my-4"/>
             <Button variant="ghost" className="w-full justify-start text-base">
                <LogOut className="mr-3 h-5 w-5" />
                Logout
            </Button>
        </aside>
    )
}


export function ProfileLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-background">
            {/* Profile Header */}
            <section className="relative bg-card border-b py-16 md:py-24">
                <div className="absolute inset-0 bg-gradient-to-r from-black/5 to-transparent">
                    <Image src="https://picsum.photos/seed/profilebg/1920/400" alt="background" fill className="object-cover opacity-10" data-ai-hint="abstract background" />
                </div>
                 <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                    <div className="flex items-center gap-6">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background shadow-lg">
                            <AvatarImage src="https://picsum.photos/seed/profilepic/200/200" />
                            <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div>
                            <h1 className="font-headline text-3xl md:text-4xl font-extrabold">John Doe</h1>
                            <p className="text-muted-foreground mt-1">john.doe@example.com</p>
                        </div>
                        <Card className="ml-auto p-4 hidden sm:block">
                            <div className="text-center">
                                <p className="font-headline text-3xl font-bold text-accent">1,250</p>
                                <p className="text-sm text-muted-foreground font-poppins">Mov Points</p>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

             {/* Main Content */}
            <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12">
                    <ProfileSidebar />
                    <main className="flex-1">
                        {children}
                    </main>
                </div>
            </section>
        </div>
    );
}
