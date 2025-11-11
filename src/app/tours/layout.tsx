import { MainLayout } from '@/components/layout/main-layout';

export default function ToursLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
