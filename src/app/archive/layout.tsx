import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
    title: 'Event Archive',
    description: 'Relive the moments from past events and tours. Browse galleries and see what you missed.',
};

export default function ArchiveLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
