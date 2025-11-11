'use client';

import Link from 'next/link';
import { ChevronDown, Menu, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { Cart } from '@/components/cart/cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/tours', label: 'Tours' },
  { href: '/shop', label: 'Shop' },
];

const dashboardLinks = [
    { href: '/admin', label: 'Admin Portal' },
    { href: '/organizer', label: 'Organizer Portal' },
    { href: '/super-admin', label: 'Super Admin Portal' },
    { href: '/influencer', label: 'Influencer Dashboard' },
    { href: '/verification', label: 'Verification Portal' },
];

export function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[65px]">
      <div className="container flex h-full items-center">
        <Logo />
        <nav className="ml-10 hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'font-poppins font-semibold text-muted-foreground transition-colors hover:text-foreground',
                pathname.startsWith(link.href) && 'text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-1 font-poppins font-semibold text-muted-foreground transition-colors hover:text-foreground focus:outline-none">
                Dashboards
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>Portals</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dashboardLinks.map(link => (
                    <DropdownMenuItem key={link.href} asChild>
                         <Link href={link.href}>{link.label}</Link>
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <Cart />
          <Button variant="ghost" className="hidden sm:inline-flex font-poppins">
            Sign In
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins">
            Sign Up
          </Button>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="flex flex-col h-full">
                <div className="p-4 border-b">
                  <Logo />
                </div>
                <nav className="flex flex-col gap-4 p-4 text-lg font-medium">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="font-poppins text-muted-foreground hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="pt-2">
                    <h3 className="px-1 text-sm font-semibold text-muted-foreground">Dashboards</h3>
                     <div className="mt-2 flex flex-col gap-4">
                        {dashboardLinks.map((link) => (
                            <Link
                            key={link.href}
                            href={link.href}
                            className="font-poppins text-muted-foreground hover:text-foreground"
                            >
                            {link.label}
                            </Link>
                        ))}
                    </div>
                  </div>
                </nav>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
