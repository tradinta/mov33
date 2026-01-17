
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { WelcomePopup } from '@/components/onboarding/welcome-popup';

export function MainLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative flex min-h-screen flex-col">
            <WelcomePopup />
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    );
}
