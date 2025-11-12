import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function OrderSuccessLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-background min-h-screen">
             <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <Logo />
                    <Link href="/shop" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        Continue Shopping
                    </Link>
                </div>
            </header>
            <main>{children}</main>
        </div>
    );
}
