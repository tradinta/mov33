
'use client';

import { useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AccordionContent, AccordionTrigger } from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import type { EventFormValues } from '@/app/organizer/events/new/page';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import { FormMessage } from '@/components/ui/form';
import { TicketCard } from './ticket-card';


export function TicketsSection() {
    const { control, formState: { errors } } = useFormContext<EventFormValues>();
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'tickets',
    });
    const [isAdvanced, setIsAdvanced] = useState(false);

    return (
        <Card>
            <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                Tickets
            </AccordionTrigger>
            <AccordionContent className="p-6 pt-0 space-y-4">
                <div className="flex items-center justify-end space-x-2">
                    <Label htmlFor="advanced-ticket-setup" className="font-poppins">Advanced Setup</Label>
                    <Switch id="advanced-ticket-setup" checked={isAdvanced} onCheckedChange={setIsAdvanced} />
                </div>
                <div className="space-y-4">
                    {fields.map((field, index) => (
                        <TicketCard key={field.id} index={index} remove={remove} isAdvanced={isAdvanced} />
                    ))}
                </div>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ tier: '', price: 0, perks: '', description: '' })}
                >
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Ticket Tier
                </Button>
                <FormMessage>{errors.tickets?.message}</FormMessage>
            </AccordionContent>
        </Card>
    )
}
