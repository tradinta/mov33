import { MainLayout } from '@/components/layout/main-layout';

export default function PartnerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <MainLayout>{children}</MainLayout>;
}
