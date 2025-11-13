
'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Card,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
  ArrowLeft,
  CalendarIcon,
  Check,
  PlusCircle,
  Star,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { TicketsSection } from '@/components/organizer/event-form/tickets-section';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';

const ticketSchema = z.object({
    tier: z.string().min(2, 'Tier name is required.'),
    price: z.coerce.number().min(0, 'Price must be a positive number.'),
    description: z.string().optional(),
    perks: z.string().min(3, 'Please list at least one perk.'),
});


const formSchema = z.object({
  listingType: z.enum(['event', 'tour']).default('event'),
  name: z.string().min(3, 'Listing name must be at least 3 characters.'),
  description: z.string().min(10, 'A short description is required.'),
  
  // Event-specific
  date: z.date().optional(),
  venue: z.string().optional(),

  // Tour-specific
  duration: z.string().optional(),
  destination: z.string().optional(),
  highlights: z.string().optional(),
  includes: z.string().optional(),
  notIncludes: z.string().optional(),
  privateBooking: z.boolean().default(false),
  minGuests: z.coerce.number().optional(),
  maxGuests: z.coerce.number().optional(),


  // Common
  location: z.string().min(2, 'Location is required.'),
  about: z.string().min(50, 'The "About" section must be at least 50 characters.'),
  tags: z.string().min(1, 'Please enter at least one tag, separated by commas.'),
  mainImage: z.string().url('Please enter a valid image URL.'),
  
  tickets: z.array(ticketSchema).optional(),

  schedule: z.array(z.object({
    day: z.string().min(1, 'Day description is required.'),
    items: z.array(z.object({
        time: z.string().min(1, 'Time is required'),
        title: z.string().min(3, 'Title is required'),
    })).min(1, "You must add at least one schedule item for the day."),
  })).optional(),

  artists: z.array(z.object({
      name: z.string().min(2, 'Artist name is required'),
      role: z.string().min(3, 'Artist role is required'),
      imageUrl: z.string().url('Please enter a valid image URL.'),
  })).optional(),

  gallery: z.array(z.object({
      imageUrl: z.string().url('Please enter a valid image URL.'),
      description: z.string().min(3, 'Description is required.'),
  })).optional(),

  faqs: z.array(z.object({
      q: z.string().min(5, 'Question is required.'),
      a: z.string().min(5, 'Answer is required.'),
  })).optional(),

}).refine(data => {
    if (data.listingType === 'event') {
        return !!data.date && !!data.venue && (data.tickets || []).length > 0;
    }
    return true;
}, {
    message: "Date, Venue, and at least one ticket tier are required for events.",
    path: ['listingType'],
}).refine(data => {
    if (data.listingType === 'tour') {
        return !!data.duration && !!data.destination && !!data.highlights && !!data.includes && !!data.notIncludes;
    }
    return true;
}, {
    message: "Duration, Destination, Highlights, and Inclusions/Exclusions are required for tours.",
    path: ['listingType'],
});


export type EventFormValues = z.infer<typeof formSchema>;

export default function NewEventPage() {
  const { toast } = useToast();
  const form = useForm<EventFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      listingType: 'event',
      name: '',
      venue: '',
      location: '',
      description: '',
      about: '',
      tags: '',
      mainImage: '',
      tickets: [{ tier: 'Regular', price: 0, perks: 'General Access', description: '' }],
      schedule: [{ day: 'Day 1', items: [{ time: '06:00 PM', title: 'Doors Open'}] }],
      artists: [],
      gallery: [],
      faqs: [],
      duration: '',
      destination: '',
      highlights: '',
      includes: '',
      notIncludes: '',
      privateBooking: false,
    },
  });

  const listingType = form.watch('listingType');

  const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
    control: form.control,
    name: 'schedule',
  });
  const { fields: artistFields, append: appendArtist, remove: removeArtist } = useFieldArray({
    control: form.control,
    name: 'artists',
  });
   const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
    control: form.control,
    name: 'gallery',
  });
  const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
    control: form.control,
    name: 'faqs',
  });


  function onSubmit(data: EventFormValues) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const addScheduleItem = (dayIndex: number) => {
    const currentItems = form.getValues(`schedule.${dayIndex}.items`);
    form.setValue(`schedule.${dayIndex}.items`, [...(currentItems || []), { time: '', title: '' }]);
  }

  const removeScheduleItem = (dayIndex: number, itemIndex: number) => {
    const currentItems = form.getValues(`schedule.${dayIndex}.items`);
    form.setValue(`schedule.${dayIndex}.items`, (currentItems || []).filter((_, i) => i !== itemIndex));
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/organizer/events">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back to listings</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold font-headline">Create a New Listing</h1>
          <p className="text-muted-foreground">
            Fill out the details below to list your event or tour on Mov33.
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <Card className='p-6'>
                 <FormField
                    control={form.control}
                    name="listingType"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                        <FormLabel>What are you listing?</FormLabel>
                        <FormControl>
                            <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex space-x-4"
                            >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="event" />
                                </FormControl>
                                <FormLabel className="font-normal">Event</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                <RadioGroupItem value="tour" />
                                </FormControl>
                                <FormLabel className="font-normal">Tour</FormLabel>
                            </FormItem>
                            </RadioGroup>
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
            </Card>

          <Accordion type="multiple" defaultValue={['item-1', 'item-3']} className="w-full space-y-4">
            {/* Core Details */}
            <AccordionItem value="item-1" className="border-b-0">
                <Card>
                    <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                        Core Details
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="grid md:grid-cols-2 gap-6">
                           <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem className="md:col-span-2">
                                <FormLabel>{listingType === 'event' ? 'Event Name' : 'Tour Name'}</FormLabel>
                                <FormControl>
                                    <Input placeholder={listingType === 'event' ? "e.g., Sauti Sol: Live in Nairobi" : "e.g., 3-Day Maasai Mara Safari"} {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                            />

                            {listingType === 'event' && (
                                <>
                                 <FormField
                                    control={form.control}
                                    name="date"
                                    render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                        <FormLabel>Event Date</FormLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                                >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                            <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                disabled={(date) =>
                                                date < new Date() || date < new Date("1900-01-01")
                                                }
                                                initialFocus
                                            />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="venue"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Venue</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Uhuru Gardens" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                </>
                            )}
                             {listingType === 'tour' && (
                                <>
                                 <FormField
                                    control={form.control}
                                    name="duration"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Tour Duration</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., 3 Days, 2 Nights" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="destination"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Destination</FormLabel>
                                        <FormControl>
                                            <Input placeholder="e.g., Maasai Mara" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                </>
                            )}


                             <FormField
                                control={form.control}
                                name="location"
                                render={({ field }) => (
                                    <FormItem className="md:col-span-2">
                                    <FormLabel>Location</FormLabel>
                                    <FormControl>
                                        <Input placeholder="e.g., Nairobi" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </AccordionContent>
                </Card>
            </AccordionItem>
            
            {/* Display & SEO */}
            <AccordionItem value="item-2" className="border-b-0">
                <Card>
                    <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                        Display & SEO
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 space-y-6">
                         <FormField
                            control={form.control}
                            name="mainImage"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Main Image</FormLabel>
                                <FormControl>
                                    <div className='flex items-center gap-2'>
                                        <Input placeholder="https://..." {...field} />
                                        <Button variant="outline" size="icon"><Upload /></Button>
                                    </div>
                                </FormControl>
                                <FormDescription>This is the main image shown on the listing card.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                         <FormField
                            control={form.control}
                            name="about"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>About The {listingType === 'event' ? 'Event' : 'Tour'}</FormLabel>
                                <FormControl>
                                    <Textarea
                                    placeholder="Tell people more about this listing, what to expect, and why they should book..."
                                    className="resize-y min-h-[120px]"
                                    {...field}
                                    />
                                </FormControl>
                                 <FormDescription>A detailed description for the listing page. Supports Markdown.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                            />
                         <FormField
                            control={form.control}
                            name="tags"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., Concert, Trending, Music" {...field} />
                                </FormControl>
                                <FormDescription>Comma-separated tags for filtering.</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                    </AccordionContent>
                </Card>
            </AccordionItem>
            
            {listingType === 'event' ? (
                <AccordionItem value="item-3" className="border-b-0">
                    <TicketsSection />
                </AccordionItem>
            ) : (
                 <AccordionItem value="item-3" className="border-b-0">
                    <Card>
                        <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                            Tour Details & Pricing
                        </AccordionTrigger>
                         <AccordionContent className="p-6 pt-0 space-y-6">
                             <div className='grid md:grid-cols-2 gap-6'>
                                <FormField
                                    control={form.control}
                                    name="minGuests"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className="flex items-center gap-2"><Users className='w-4 h-4' /> Min. Guests</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 2" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="maxGuests"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel className="flex items-center gap-2"><Users className='w-4 h-4' /> Max. Guests</FormLabel>
                                        <FormControl><Input type="number" placeholder="e.g., 8" {...field} /></FormControl>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                 <FormField
                                    control={form.control}
                                    name="privateBooking"
                                    render={({ field }) => (
                                        <FormItem className="md:col-span-2 flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Allow Private Bookings</FormLabel>
                                            <FormDescription>
                                            Allow a single person or group to book this tour exclusively.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                            checked={field.value}
                                            onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                        </FormItem>
                                    )}
                                />

                             </div>
                            <FormField
                                control={form.control}
                                name="highlights"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Star className='w-4 h-4 text-accent'/> Highlights</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="List the main highlights, separated by commas." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="includes"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="flex items-center gap-2"><Check className='w-4 h-4 text-green-500'/> What's Included</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="List what the price includes, separated by commas." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="notIncludes"
                                render={({ field }) => (
                                    <FormItem>
                                    <FormLabel className="flex items-center gap-2"><X className='w-4 h-4 text-destructive'/> What's Not Included</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="List what the price excludes, separated by commas." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                    </FormItem>
                                )}
                            />
                         </AccordionContent>
                    </Card>
                </AccordionItem>
            )}


             {/* Schedule */}
            <AccordionItem value="item-4" className="border-b-0">
                <Card>
                    <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                        Schedule / Itinerary
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 space-y-4">
                       {scheduleFields.map((dayField, dayIndex) => (
                           <Card key={dayField.id} className="p-4 bg-background">
                                <div className="flex items-center justify-between mb-4">
                                     <FormField
                                        control={form.control}
                                        name={`schedule.${dayIndex}.day`}
                                        render={({ field }) => (
                                            <FormItem className="flex-grow">
                                                <FormLabel>Day / Stage Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="e.g., Day 1: Main Stage" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button variant="ghost" size="icon" className="mt-8 ml-4" onClick={() => removeSchedule(dayIndex)}>
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                               </div>
                               <div className='space-y-3'>
                                 {(form.getValues(`schedule.${dayIndex}.items`) || []).map((itemField, itemIndex) => (
                                    <div key={`${dayField.id}-${itemIndex}`} className="flex items-end gap-2">
                                        <FormField
                                            control={form.control}
                                            name={`schedule.${dayIndex}.items.${itemIndex}.time`}
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Time</FormLabel>
                                                    <FormControl><Input placeholder="8:00 PM" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name={`schedule.${dayIndex}.items.${itemIndex}.title`}
                                            render={({ field }) => (
                                                <FormItem className="flex-grow">
                                                    <FormLabel>Activity</FormLabel>
                                                    <FormControl><Input placeholder="Opening Act: Nviiri" {...field} /></FormControl>
                                                </FormItem>
                                            )}
                                        />
                                        <Button variant="ghost" size="icon" onClick={() => removeScheduleItem(dayIndex, itemIndex)}>
                                            <Trash2 className="h-4 w-4 text-muted-foreground" />
                                        </Button>
                                    </div>
                                ))}
                                <Button type="button" variant="link" size="sm" onClick={() => addScheduleItem(dayIndex)}>
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Activity
                                </Button>
                               </div>
                           </Card>
                       ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => appendSchedule({ day: `Day ${(scheduleFields || []).length + 1}`, items: [{time: '', title: ''}]})}
                        >
                           <PlusCircle className="mr-2 h-4 w-4" /> Add Day / Stage
                        </Button>
                         <FormMessage>{form.formState.errors.schedule?.message}</FormMessage>
                    </AccordionContent>
                </Card>
            </AccordionItem>

            {/* Additional Information */}
            <AccordionItem value="item-5" className="border-b-0">
                <Card>
                    <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                        Additional Information (Optional)
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0 space-y-8">
                       {/* Artists */}
                       <div>
                            <h4 className="font-poppins font-semibold mb-2">Artists / Lineup</h4>
                            <div className="space-y-4">
                                {artistFields.map((field, index) => (
                                    <Card key={field.id} className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr,1fr,2fr,auto] gap-4 items-start">
                                            <FormField control={form.control} name={`artists.${index}.name`} render={({ field }) => (<FormItem><FormLabel>Name</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField control={form.control} name={`artists.${index}.role`} render={({ field }) => (<FormItem><FormLabel>Role</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField control={form.control} name={`artists.${index}.imageUrl`} render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <Button variant="ghost" size="icon" className="mt-8" onClick={() => removeArtist(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => appendArtist({ name: '', role: '', imageUrl: '' })}><PlusCircle className="mr-2 h-4 w-4" />Add Artist</Button>
                            </div>
                       </div>
                        {/* Gallery */}
                       <div>
                            <h4 className="font-poppins font-semibold mb-2">Image Gallery</h4>
                            <div className="space-y-4">
                                {galleryFields.map((field, index) => (
                                     <Card key={field.id} className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr,auto] gap-4 items-start">
                                            <FormField control={form.control} name={`gallery.${index}.imageUrl`} render={({ field }) => (<FormItem><FormLabel>Image URL</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField control={form.control} name={`gallery.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <Button variant="ghost" size="icon" className="mt-8" onClick={() => removeGallery(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => appendGallery({ imageUrl: '', description: '' })}><PlusCircle className="mr-2 h-4 w-4" />Add Gallery Image</Button>
                            </div>
                       </div>
                        {/* FAQs */}
                       <div>
                            <h4 className="font-poppins font-semibold mb-2">FAQs</h4>
                            <div className="space-y-4">
                                {faqFields.map((field, index) => (
                                     <Card key={field.id} className="p-4 bg-muted/30">
                                        <div className="grid grid-cols-1 md:grid-cols-[1fr,2fr,auto] gap-4 items-start">
                                            <FormField control={form.control} name={`faqs.${index}.q`} render={({ field }) => (<FormItem><FormLabel>Question</FormLabel><FormControl><Input {...field} /></FormControl></FormItem>)} />
                                            <FormField control={form.control} name={`faqs.${index}.a`} render={({ field }) => (<FormItem><FormLabel>Answer</FormLabel><FormControl><Textarea className="min-h-0" {...field} /></FormControl></FormItem>)} />
                                            <Button variant="ghost" size="icon" className="mt-8" onClick={() => removeFaq(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                                        </div>
                                    </Card>
                                ))}
                                <Button type="button" variant="outline" size="sm" onClick={() => appendFaq({ q: '', a: '' })}><PlusCircle className="mr-2 h-4 w-4" />Add FAQ</Button>
                            </div>
                       </div>

                    </AccordionContent>
                </Card>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end gap-2">
            <Button variant="outline" type="button">Save as Draft</Button>
            <Button type="submit">Publish {listingType === 'event' ? 'Event' : 'Tour'}</Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

    