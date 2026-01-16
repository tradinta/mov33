'use client';

import Link from 'next/link';
import { Award, ChevronDown, Menu, Search, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Logo } from '@/components/logo';
import { cn } from '@/lib/utils';
import { usePathname, useRouter } from 'next/navigation';
import { Cart } from '@/components/cart/cart';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { ThemeToggle } from '../theme-toggle';
import { useUser } from '@/firebase/auth/use-user';
import { getAuth, signOut } from 'firebase/auth';

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/tours', label: 'Tours' },
  { href: '/shop', label: 'Shop' },
];

const dashboardLinks = [
  { href: '/admin', label: 'Admin Portal' },
  { href: '/super-admin', label: 'Super Admin Portal' },
  { href: '/organizer', label: 'Organizer Portal' },
  { href: '/influencer', label: 'Influencer Dashboard' },
  { href: '/verify', label: 'Verification Portal' },
];

function UserNav() {
  const { user, loading } = useUser();
  const router = useRouter();
  const auth = getAuth();
  // Mock membership status for now
  const membership = "Standard" as "Standard" | "VIP";

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/');
  };

  if (loading) {
    return <div className="h-10 w-24 rounded-full bg-muted animate-pulse" />;
  }

  if (!user) {
    return (
      <>
        <Button variant="ghost" className="hidden sm:inline-flex font-poppins" asChild>
          <Link href="/login">Sign In</Link>
        </Button>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground font-poppins" asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </>
    )
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.uid}/100/100`} alt={user.displayName || 'User'} />
            <AvatarFallback>{user.displayName?.charAt(0) || user.email?.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <DropdownMenuLabel>
          <div className="flex items-center gap-2">
            <div className="font-bold">{user.displayName || 'User'}</div>
            {membership === 'VIP' && (
              <div className="flex items-center gap-1 text-xs bg-muted-gold text-white px-2 py-0.5 rounded-full">
                <Award className="h-3 w-3" />
                <span>VIP</span>
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">{user.email}</div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile"><User className="mr-2 h-4 w-4" /> My Profile</Link>
        </DropdownMenuItem>
        {membership !== 'VIP' && (
          <DropdownMenuItem asChild>
            <Link href="/membership" className="text-accent">
              <Award className="mr-2 h-4 w-4" /> Upgrade to VIP
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Logout</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/super-admin">Go to Super Admin</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Header() {
  const pathname = usePathname();

  if (pathname === '/login' || pathname === '/signup' || pathname.startsWith('/admin') || pathname.startsWith('/super-admin') || pathname.startsWith('/organizer')) {
    return null;
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 h-[65px]">
      <div className="container flex h-full items-center">
        <Logo />
        <nav className="ml-6 hidden md:flex items-center">
          <div className="flex items-center gap-1 bg-black/5 dark:bg-white/10 backdrop-blur-md border border-black/5 dark:border-white/10 rounded-full px-1.5 py-1.5 p-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300',
                  pathname.startsWith(link.href)
                    ? 'bg-gold text-obsidian shadow-lg shadow-gold/20'
                    : 'text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10'
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="w-[1px] h-4 bg-border/50 mx-1" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-1 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-muted-foreground transition-all hover:text-foreground hover:bg-black/5 dark:hover:bg-white/10 focus:outline-none">
                  More
                  <ChevronDown className="h-3 w-3" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                <DropdownMenuLabel>Dashboards</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {dashboardLinks.map(link => (
                  <DropdownMenuItem key={link.href} asChild>
                    <Link href={link.href}>{link.label}</Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-2">
          <Button variant="ghost" size="icon" className="hidden md:inline-flex">
            <Search className="h-4 w-4" />
            <span className="sr-only">Search</span>
          </Button>
          <ThemeToggle />
          <Cart />
          <UserNav />
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
