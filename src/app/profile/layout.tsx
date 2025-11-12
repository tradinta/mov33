import { MainLayout } from '@/components/layout/main-layout';
import { ProfileLayout } from '@/components/profile/profile-layout';

export default function RootProfileLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <MainLayout>
            <ProfileLayout>
                {children}
            </ProfileLayout>
        </MainLayout>
    );
}
