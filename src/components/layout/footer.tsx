"use client";

import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/logo';
import { Facebook, Twitter, Instagram, Linkedin, Youtube, Music2 } from 'lucide-react';
import { useSettings } from '@/context/settings-context';
import { FaTiktok, FaWhatsapp } from 'react-icons/fa'; // Assuming we have or can add react-icons, if not defaults to lucide

export function Footer() {
  const { settings } = useSettings();

  // Helper to ensure valid URL or #
  const getLink = (url: string) => url && url.length > 0 ? url : '#';

  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 py-16">
          <div className="col-span-2 lg:col-span-1">
            <Logo />
            <p className="mt-4 text-sm text-muted-foreground">
              Discover and book your next live experience.
            </p>
            <div className="mt-6 flex flex-col gap-1 text-xs text-muted-foreground">
              {settings.contact?.address && <p>{settings.contact.address}</p>}
              {settings.contact?.supportPhone && <p>Support: {settings.contact.supportPhone}</p>}
              {settings.contact?.supportEmail && <p>Email: {settings.contact.supportEmail}</p>}
            </div>
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
              <li><Link href={settings.termsUrl || "#"} className="text-muted-foreground hover:text-foreground">Terms of Service</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-poppins font-semibold text-foreground">Policies</h3>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link href={settings.privacyUrl || "#"} className="text-muted-foreground hover:text-foreground">Privacy Policy</Link></li>
              <li><Link href={settings.termsUrl || "#"} className="text-muted-foreground hover:text-foreground">Terms</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Cookie Policy</Link></li>
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
            &copy; {new Date().getFullYear()} {settings.platformName}. All rights reserved.
          </p>
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {settings.socials.facebook && <Link href={getLink(settings.socials.facebook)} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors"><Facebook className="h-5 w-5" /></Link>}
            {settings.socials.twitter && <Link href={getLink(settings.socials.twitter)} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors"><Twitter className="h-5 w-5" /></Link>}
            {settings.socials.instagram && <Link href={getLink(settings.socials.instagram)} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors"><Instagram className="h-5 w-5" /></Link>}
            {settings.socials.linkedin && <Link href={getLink(settings.socials.linkedin)} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors"><Linkedin className="h-5 w-5" /></Link>}
            {settings.socials.youtube && <Link href={getLink(settings.socials.youtube)} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors"><Youtube className="h-5 w-5" /></Link>}
            {settings.socials.tiktok && <Link href={getLink(settings.socials.tiktok)} target="_blank" className="text-muted-foreground hover:text-foreground transition-colors"><Music2 className="h-5 w-5" /></Link>}
          </div>
        </div>
      </div>
    </footer>
  );
}
