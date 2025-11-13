import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 py-16">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Discover and book your next live experience.
            </p>
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-foreground">Navigate</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="/events" className="text-muted-foreground hover:text-foreground">Events</Link></li>
              <li><Link href="/tours" className="text-muted-foreground hover:text-foreground">Tours</Link></li>
              <li><Link href="/shop" className="text-muted-foreground hover:text-foreground">Shop</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">About Us</Link></li>
              <li><Link href="/partner" className="text-muted-foreground hover:text-foreground">Partner with Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Careers</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Press</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-foreground">Support</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Help Center</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Contact Us</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <h3 className="font-poppins font-semibold text-foreground">Stay Connected</h3>
            <p className="mt-2 text-sm text-muted-foreground">Get the latest events and updates in your inbox.</p>
            <form className="mt-4 flex w-full max-w-sm items-center space-x-2">
              <Input type="email" placeholder="Enter your email" className="flex-1" />
              <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Subscribe</Button>
            </form>
          </div>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-center py-6 border-t border-border/40">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Mov33. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            <Link href="#" className="text-muted-foreground hover:text-foreground"><Facebook className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground"><Twitter className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground"><Instagram className="h-5 w-5" /></Link>
            <Link href="#" className="text-muted-foreground hover:text-foreground"><Linkedin className="h-5 w-5" /></Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
