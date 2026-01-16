import { MainLayout } from '@/components/layout/main-layout';

export default function RootProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MainLayout>
            {children}
        </MainLayout>
    );
}
