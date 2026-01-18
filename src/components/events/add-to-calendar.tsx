'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface AddToCalendarProps {
    title: string;
    description: string;
    location: string;
    startDate: Date;
    endDate?: Date;
}

export function AddToCalendar({ title, description, location, startDate, endDate }: AddToCalendarProps) {
    const generateGoogleUrl = () => {
        const start = format(startDate, "yyyyMMdd'T'HHmmss'Z'");
        const end = format(endDate || new Date(startDate.getTime() + 2 * 60 * 60 * 1000), "yyyyMMdd'T'HHmmss'Z'");

        return `https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    };

    return (
        <Button
            variant="outline"
            className="w-full rounded-2xl border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[10px] h-12 gap-2"
            onClick={() => window.open(generateGoogleUrl(), '_blank')}
        >
            <Calendar className="h-4 w-4" />
            Add to Calendar
        </Button>
    );
}
