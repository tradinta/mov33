
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Shop Merchandise',
    description: 'Exclusive Mov33 apparel, travel accessories, and festival gear.',
};

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
