import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
    title: 'Discover Events',
    description: 'Find tickets for concerts, festivals, tech summits, and exclusive parties in Nairobi and beyond.',
};

export default function EventsLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
