import { MainLayout } from '@/components/layout/main-layout';

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
