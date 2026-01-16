
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Expeditions & Safaris',
    description: 'Book curated tours, hiking trips, and luxury safaris across Kenya. Best price guaranteed.',
};

export default function ToursLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
