import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';

export default function NotFound() {
  return (
    <MainLayout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
            <Search className="w-24 h-24 text-accent/20" strokeWidth={1} />
            <h1 className="mt-8 text-5xl md:text-7xl font-headline font-extrabold text-foreground">
                404 - Page Not Found
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-lg">
                Oops! The page you're looking for seems to have taken a detour. It might have been moved, deleted, or never existed in the first place.
            </p>
            <div className="mt-8 flex gap-4">
                <Button asChild size="lg">
                    <Link href="/">Return Home</Link>
                </Button>
                <Button variant="outline" size="lg">
                    <Link href="/events">Explore Events</Link>
                </Button>
            </div>
        </div>
    </MainLayout>
  );
}
