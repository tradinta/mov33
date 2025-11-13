
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NewTourPage() {
    const router = useRouter();

    useEffect(() => {
        const params = new URLSearchParams();
        params.set('type', 'tour');
        router.replace(`/organizer/events/new?${params.toString()}`);
    }, [router]);

    return (
        <div className="flex items-center justify-center h-64">
            <p className="text-muted-foreground">Redirecting to listing creation...</p>
        </div>
    );
}
