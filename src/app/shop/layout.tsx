import { Metadata } from 'next';
import { MainLayout } from '@/components/layout/main-layout';

export const metadata: Metadata = {
    title: 'Shop Merchandise',
    description: 'Exclusive Mov33 apparel, travel accessories, and festival gear.',
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
