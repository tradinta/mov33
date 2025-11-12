
'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { EventFormValues } from '@/app/organizer/events/new/page';
import { DollarSign, Trash2 } from 'lucide-react';

interface TicketCardProps {
  index: number;
  remove: (index: number) => void;
  isAdvanced: boolean;
}

export function TicketCard({ index, remove, isAdvanced }: TicketCardProps) {
  const { control } = useFormContext<EventFormValues>();

  return (
    <Card className="p-4 bg-background relative overflow-hidden">
        <div className="absolute top-2 right-2">
            <Button variant="ghost" size="icon" onClick={() => remove(index)}>
                <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
        </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
        <FormField
          control={control}
          name={`tickets.${index}.tier`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tier Name</FormLabel>
              <FormControl>
                <Input placeholder="e.g., VIP, Early Bird" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name={`tickets.${index}.price`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Price (KES)</FormLabel>
              <FormControl>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input type="number" placeholder="2500" className="pl-8" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
         <FormField
            control={control}
            name={`tickets.${index}.description`}
            render={({ field }) => (
                <FormItem className="md:col-span-2">
                <FormLabel>Tier Description</FormLabel>
                <FormControl>
                    <Textarea placeholder="A short summary of what this ticket includes." className="min-h-[60px]" {...field} />
                </FormControl>
                <FormMessage />
                </FormItem>
            )}
        />
        <FormField
          control={control}
          name={`tickets.${index}.perks`}
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>Perks</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Express Entry, Free Drink, Exclusive Seating" {...field} />
              </FormControl>
              <FormDescription className="text-xs">Comma-separated list of perks for this tier.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {isAdvanced && (
          <>
            <FormField
              control={control}
              name={`tickets.${index}.status`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Available">Available</SelectItem>
                      <SelectItem value="Sold Out">Sold Out</SelectItem>
                      <SelectItem value="Almost Gone">Almost Gone</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
                control={control}
                name={`tickets.${index}.remaining`}
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Remaining Tickets (Optional)</FormLabel>
                    <FormControl>
                        <Input type="number" placeholder="e.g., 50" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={control}
                name={`tickets.${index}.discount`}
                render={({ field }) => (
                    <FormItem className="md:col-span-2">
                    <FormLabel>Promotional Discount (Optional)</FormLabel>
                    <FormControl>
                        <Input placeholder="e.g., Group discount available, Buy 4 get 1 free!" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
          </>
        )}
      </div>
    </Card>
  );
}
