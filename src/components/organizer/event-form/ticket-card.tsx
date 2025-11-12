
'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import type { EventFormValues } from '@/app/organizer/events/new/page';
import { DollarSign, Percent, PlusCircle, Trash2 } from 'lucide-react';

interface TicketCardProps {
  index: number;
  remove: (index: number) => void;
  isAdvanced: boolean;
}

export function TicketCard({ index, remove, isAdvanced }: TicketCardProps) {
  const { control, getValues, formState } = useFormContext<EventFormValues>();

  const { fields: discountFields, append: appendDiscount, remove: removeDiscount } = useFieldArray({
    control,
    name: `tickets.${index}.discounts`,
  });

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
          <div className='md:col-span-2 space-y-4 pt-4 border-t'>
            <h4 className='font-poppins font-semibold'>Quantity Discounts</h4>
            <div className='space-y-3'>
              {discountFields.map((field, discountIndex) => (
                <div key={field.id} className="flex items-end gap-2 p-3 bg-muted/50 rounded-lg">
                    <p className='mt-8 font-semibold text-muted-foreground'>Buy</p>
                    <FormField
                      control={control}
                      name={`tickets.${index}.discounts.${discountIndex}.quantity`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl><Input type="number" className='w-24' placeholder="e.g., 5" {...field} /></FormControl>
                        </FormItem>
                      )}
                    />
                     <p className='mt-8 font-semibold text-muted-foreground'>or more, get</p>
                    <FormField
                      control={control}
                      name={`tickets.${index}.discounts.${discountIndex}.percentage`}
                      render={({ field }) => (
                        <FormItem className='flex-grow'>
                          <FormLabel>Discount</FormLabel>
                           <div className="relative">
                            <Percent className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <FormControl><Input type="number" placeholder="e.g., 10" className='pr-8' {...field} /></FormControl>
                           </div>
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeDiscount(discountIndex)}>
                        <Trash2 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                </div>
              ))}
            </div>
             <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => appendDiscount({ quantity: 0, percentage: 0 })}
            >
                <PlusCircle className="mr-2 h-4 w-4" /> Add Discount Tier
            </Button>
             <FormMessage>{formState.errors.tickets?.[index]?.discounts?.message}</FormMessage>
          </div>
        )}
      </div>
    </Card>
  );
}
