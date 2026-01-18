
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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import {
    ArrowLeft,
    CalendarIcon,
    PlusCircle,
    Trash2,
    Loader2,
    AlertTriangle,
} from 'lucide-react';
import Link from 'next/link';
import { TicketsSection } from '@/components/organizer/event-form/tickets-section';
import { createListing } from '@/lib/listing-service';
import { useUser } from '@/firebase/auth/use-user';
import { useRouter } from 'next/navigation';
import React from 'react';
import { ImageUploader } from '@/components/organizer/image-uploader';
import { Eye, TrendingUp } from 'lucide-react';
import { NotificationEstimate } from '@/components/organizer/notification-estimate';
import { EventCard } from '@/components/events/event-card';
import { Timestamp } from 'firebase/firestore';


const ticketDiscountSchema = z.object({
    quantity: z.coerce.number().min(1, 'Quantity must be at least 1.'),
    percentage: z.coerce.number().min(1, 'Discount must be at least 1%').max(100, 'Discount cannot exceed 100%'),
});

const ticketSchema = z.object({
    tier: z.string().min(2, 'Tier name is required.'),
    price: z.coerce.number().min(0, 'Price must be a positive number.'),
    description: z.string().optional(),
    perks: z.string().min(3, 'Please list at least one perk.'),
    discounts: z.array(ticketDiscountSchema).optional(),
});

const formSchema = z.object({
    name: z.string().min(3, 'Event name must be at least 3 characters.'),
    description: z.string().min(10, 'A short description is required.'),
    date: z.date({ required_error: 'An event date is required.' }),
    venue: z.string().min(2, 'A venue is required.'),
    location: z.string().min(2, 'Location is required.'),
    about: z.string().min(50, 'The "About" section must be at least 50 characters.'),
    tags: z.string().min(1, 'Please enter at least one tag, separated by commas.'),
    mainImage: z.string().url('Please upload a main image for the event.'),

    // Personalization tags
    personaTags: z.string().optional(),
    vibeTags: z.string().optional(),

    // Engagement fields
    dealCode: z.string().optional(),
    dealDescription: z.string().optional(),

    tickets: z.array(ticketSchema).min(1, 'You must add at least one ticket tier.'),

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
        imageUrl: z.string().url('Please upload a valid image.'),
        description: z.string().min(3, 'Description is required.'),
    })).optional(),

    faqs: z.array(z.object({
        q: z.string().min(5, 'Question is required.'),
        a: z.string().min(5, 'Answer is required.'),
    })).optional(),
});


export type EventFormValues = z.infer<typeof formSchema>;

export default function NewEventPage() {
    const { toast } = useToast();
    const { user, loading } = useUser();
    const router = useRouter();
    const [isPublishing, setIsPublishing] = React.useState(false);
    const [isSavingDraft, setIsSavingDraft] = React.useState(false);

    const form = useForm<EventFormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            venue: '',
            location: '',
            description: '',
            about: '',
            tags: '',
            mainImage: '',
            personaTags: '',
            vibeTags: '',
            dealCode: '',
            dealDescription: '',
            tickets: [{ tier: 'Regular', price: 0, perks: 'General Access', description: '' }],
            schedule: [{ day: 'Day 1', items: [{ time: '06:00 PM', title: 'Doors Open' }] }],
            artists: [],
            gallery: [],
            faqs: [],
        },
    });

    const { fields: scheduleFields, append: appendSchedule, remove: removeSchedule } = useFieldArray({
        control: form.control,
        name: 'schedule',
    });
    const { fields: artistFields, append: appendArtist, remove: removeArtist } = useFieldArray({
        control: form.control,
        name: 'artists',
    });

    const watchedPersonaTags = form.watch('personaTags');
    const watchedVibeTags = form.watch('vibeTags');
    const watchedCategory = form.watch('tags'); // Assuming category is derived from tags for now
    const { fields: galleryFields, append: appendGallery, remove: removeGallery } = useFieldArray({
        control: form.control,
        name: 'gallery',
    });
    const { fields: faqFields, append: appendFaq, remove: removeFaq } = useFieldArray({
        control: form.control,
        name: 'faqs',
    });

    const [missingFields, setMissingFields] = React.useState<string[]>([]);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = React.useState(false);

    // Persistence: Load from localStorage
    React.useEffect(() => {
        const savedData = localStorage.getItem('event-form-draft');
        if (savedData) {
            try {
                const parsed = JSON.parse(savedData);
                if (parsed.date) parsed.date = new Date(parsed.date);
                form.reset(parsed);
            } catch (e) {
                console.error("Failed to load draft from localStorage", e);
            }
        }
    }, [form]);

    // Persistence: Save to localStorage (Real-time)
    const watchAllFields = form.watch();
    React.useEffect(() => {
        const dataToSave = { ...watchAllFields };
        localStorage.setItem('event-form-draft', JSON.stringify(dataToSave));
    }, [watchAllFields]);

    const clearPersistence = () => {
        localStorage.removeItem('event-form-draft');
    }

    async function handlePublishAttempt() {
        // Trigger validation but don't stop execution
        const valid = await form.trigger();
        if (!valid) {
            const errors = form.formState.errors;
            const fields: string[] = [];

            // Map common fields to readable names
            if (errors.name) fields.push("Event Name");
            if (errors.date) fields.push("Event Date");
            if (errors.venue) fields.push("Venue");
            if (errors.location) fields.push("Location");
            if (errors.description) fields.push("Short Description");
            if (errors.about) fields.push("Detailed 'About' section");
            if (errors.mainImage) fields.push("Main Image Upload");
            if (errors.tickets) fields.push("At least one Ticket Tier");

            setMissingFields(fields);
            setIsModalOpen(true);
        } else {
            // If perfectly valid, just submit
            form.handleSubmit(onSubmit)();
        }
    }

    async function onSubmit(data: any) {
        if (!user) return;
        setIsPublishing(true);
        try {
            await createListing({ listingType: 'event', status: 'published', ...data }, user.uid);
            toast({
                title: "Event Published!",
                description: `Your event "${data.name}" is now live.`
            });
            clearPersistence();
            router.push('/organizer/events');
        } catch (error) {
            console.error("Failed to publish event:", error);
            toast({
                variant: "destructive",
                title: "Failed to publish event",
                description: "An unexpected error occurred. Please try again."
            })
        } finally {
            setIsPublishing(false);
            setIsModalOpen(false);
        }
    }

    const handleSaveDraft = async () => {
        if (!user) return;

        const data = form.getValues();
        if (!data.name) {
            toast({
                variant: "destructive",
                title: "Missing Name",
                description: "Please enter at least an event name to save as draft."
            });
            return;
        }

        setIsSavingDraft(true);
        try {
            await createListing({ listingType: 'event', status: 'draft', ...data }, user.uid);
            toast({
                title: "Draft Saved",
                description: `"${data.name}" has been saved to your drafts.`
            });
            clearPersistence(); // Clear local storage once successfully saved to DB
            router.push('/organizer/events');
        } catch (error) {
            console.error("Failed to save draft:", error);
            toast({
                variant: "destructive",
                title: "Error",
                description: "Failed to save draft. Please try again."
            });
        } finally {
            setIsSavingDraft(false);
        }
    }
    const addScheduleItem = (dayIndex: number) => {
        const currentItems = form.getValues(`schedule.${dayIndex}.items`);
        form.setValue(`schedule.${dayIndex}.items`, [...(currentItems || []), { time: '', title: '' }]);
    }

    const removeScheduleItem = (dayIndex: number, itemIndex: number) => {
        const currentItems = form.getValues(`schedule.${dayIndex}.items`);
        form.setValue(`schedule.${dayIndex}.items`, (currentItems || []).filter((_, i) => i !== itemIndex));
    }

    if (loading) {
        return <p>Loading user...</p>
    }

    if (!user) {
        router.push('/login');
        return null;
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
                    <h1 className="text-2xl font-bold font-headline">Create a New Event</h1>
                    <p className="text-muted-foreground">
                        Fill out the details below to list your event on Mov33.
                    </p>
                </div>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit, (errors) => {
                    console.log("Validation errors:", errors);
                    toast({
                        variant: "destructive",
                        title: "Validation Error",
                        description: "Please check the form for missing required fields."
                    });
                })} className="space-y-8">
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
                                                    <FormLabel>Event Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., Sauti Sol: Live in Nairobi" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
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
                                                <FormLabel>Main Event Image</FormLabel>
                                                <FormControl>
                                                    <ImageUploader name={field.name} folder="events" />
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
                                                <FormLabel>About The Event</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Tell people more about this event, what to expect, and why they should book..."
                                                        className="resize-y min-h-[120px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormDescription>A detailed description for the event page. Supports Markdown.</FormDescription>
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

                        {/* Personalization & Engagement */}
                        <AccordionItem value="item-personalization" className="border-b-0">
                            <Card>
                                <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                                    Personalization & Engagement
                                </AccordionTrigger>
                                <AccordionContent className="p-6 pt-0 space-y-6">
                                    <NotificationEstimate
                                        category={watchedCategory}
                                        personaTags={watchedPersonaTags?.split(',').map(s => s.trim())}
                                        vibeTags={watchedVibeTags?.split(',').map(s => s.trim())}
                                    />
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="personaTags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Persona Tags</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., socialite, raver, explorer" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Identify target personas for this event.</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="vibeTags"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Vibe Tags</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="e.g., chill, high-energy, boutique" {...field} />
                                                    </FormControl>
                                                    <FormDescription>Describe the event vibe (comma separated).</FormDescription>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="pt-4 border-t border-white/5 space-y-6">
                                        <h4 className="text-sm font-bold uppercase tracking-widest text-gold/60">Flash Deal (Optional)</h4>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <FormField
                                                control={form.control}
                                                name="dealCode"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Deal Code</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., FLASH20" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Code for the gamified reveal.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                            <FormField
                                                control={form.control}
                                                name="dealDescription"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Deal Hook</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="e.g., Get 20% off if you book now!" {...field} />
                                                        </FormControl>
                                                        <FormDescription>Catchy description for the unlock.</FormDescription>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </AccordionContent>
                            </Card>
                        </AccordionItem>

                        <AccordionItem value="item-3" className="border-b-0">
                            <TicketsSection />
                        </AccordionItem>


                        {/* Schedule */}
                        <AccordionItem value="item-4" className="border-b-0">
                            <Card>
                                <AccordionTrigger className="p-6 font-headline text-lg data-[state=closed]:rounded-lg data-[state=open]:rounded-t-lg hover:no-underline bg-muted/50">
                                    Schedule
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
                                                        <Button type="button" variant="ghost" size="icon" onClick={() => removeScheduleItem(dayIndex, itemIndex)}>
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
                                        onClick={() => appendSchedule({ day: `Day ${(scheduleFields || []).length + 1}`, items: [{ time: '', title: '' }] })}
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
                                                        <FormField control={form.control} name={`artists.${index}.imageUrl`} render={({ field }) => (
                                                            <FormItem className="md:col-span-1">
                                                                <FormLabel>Artist Photo</FormLabel>
                                                                <FormControl>
                                                                    <ImageUploader
                                                                        name={field.name}
                                                                        folder="artists"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )} />
                                                        <Button type="button" variant="ghost" size="icon" className="mt-8" onClick={() => removeArtist(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                                                        <FormField
                                                            control={form.control}
                                                            name={`gallery.${index}.imageUrl`}
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Image {index + 1}</FormLabel>
                                                                    <FormControl>
                                                                        <ImageUploader name={field.name} folder="events" />
                                                                    </FormControl>
                                                                </FormItem>
                                                            )} />
                                                        <FormField control={form.control} name={`gallery.${index}.description`} render={({ field }) => (<FormItem><FormLabel>Description</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
                                                    </div>
                                                    <Button type="button" variant="ghost" size="icon" className="float-right -mt-10" onClick={() => removeGallery(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
                                                        <Button type="button" variant="ghost" size="icon" className="mt-8" onClick={() => removeFaq(index)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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

                    <div className="flex justify-end gap-3 mt-12 pb-12">
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isPublishing || isSavingDraft}
                            onClick={() => setIsPreviewOpen(true)}
                            className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs border-white/10"
                        >
                            <Eye className="mr-2 h-4 w-4" /> Preview
                        </Button>
                        <Button
                            variant="outline"
                            type="button"
                            disabled={isPublishing || isSavingDraft}
                            onClick={handleSaveDraft}
                            className="h-12 px-8 rounded-xl font-bold uppercase tracking-widest text-xs"
                        >
                            {isSavingDraft ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</>
                            ) : 'Save as Draft'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            disabled={isPublishing || isSavingDraft}
                            onClick={() => setIsPreviewOpen(true)}
                            className="h-12 px-6 rounded-xl font-bold uppercase tracking-widest text-xs border-gold/30 text-gold hover:bg-gold/10"
                        >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                        </Button>
                        <Button
                            type="button"
                            disabled={isPublishing || isSavingDraft}
                            onClick={handlePublishAttempt}
                            className="h-12 px-8 rounded-xl bg-gold hover:bg-gold/90 text-obsidian font-bold uppercase tracking-widest text-xs"
                        >
                            {isPublishing ? (
                                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</>
                            ) : 'Publish Event'}
                        </Button>
                    </div>
                </form>

                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogContent className="max-w-md bg-obsidian border-gold/20 text-white">
                        <DialogHeader>
                            <DialogTitle className="flex items-center gap-2 text-gold">
                                <AlertTriangle className="h-5 w-5" />
                                Missing Fields
                            </DialogTitle>
                            <DialogDescription className="text-white/70">
                                Some required fields are missing or invalid. Do you want to continue editing or publish anyway?
                            </DialogDescription>
                        </DialogHeader>

                        <div className="py-4">
                            <h4 className="text-sm font-semibold mb-2 text-white/90 uppercase tracking-wider text-xs">Missing/Invalid:</h4>
                            <ul className="space-y-1">
                                {missingFields.map((field, idx) => (
                                    <li key={idx} className="text-sm text-white/60 flex items-center gap-2">
                                        <span className="h-1 w-1 bg-gold rounded-full" />
                                        {field}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button variant="ghost" onClick={() => setIsModalOpen(false)} className="text-white hover:bg-white/10">
                                Continue Editing
                            </Button>
                            <Button
                                className="bg-gold hover:bg-gold/90 text-obsidian font-bold"
                                onClick={() => onSubmit(form.getValues())}
                                disabled={isPublishing}
                            >
                                {isPublishing ? (
                                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Publishing...</>
                                ) : 'Publish Anyway'}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                    <DialogContent className="max-w-4xl bg-obsidian border-white/5 text-white p-0 overflow-hidden">
                        <div className="grid md:grid-cols-2">
                            <div className="p-8 bg-black/40 border-r border-white/5">
                                <h3 className="text-xl font-headline font-black uppercase italic tracking-tighter mb-6 text-gold">Card Preview</h3>
                                <div className="max-w-xs mx-auto">
                                    <EventCard event={{
                                        ...form.getValues(),
                                        id: 'preview',
                                        date: Timestamp.fromDate(form.getValues('date') || new Date()),
                                        imageUrl: form.getValues('mainImage'),
                                        title: form.getValues('name'),
                                        price: Math.min(...(form.getValues('tickets')?.map(t => t.price) || [0])),
                                        ticketsSold: 0,
                                        capacity: 100,
                                        organizerId: user?.uid || '',
                                        status: 'published',
                                        tags: form.getValues('tags').split(',').map(t => t.trim()),
                                        isPrivate: false,
                                    } as any} />
                                </div>
                            </div>
                            <div className="p-8 space-y-6">
                                <h3 className="text-xl font-headline font-black uppercase italic tracking-tighter text-white/40">Quick Stats</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-[10px] uppercase font-black text-muted-foreground mb-1">Price Range</div>
                                        <div className="text-xl font-black italic text-gold">
                                            KES {Math.min(...(form.getValues('tickets')?.map(t => t.price) || [0]))} - {Math.max(...(form.getValues('tickets')?.map(t => t.price) || [0]))}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                        <div className="text-[10px] uppercase font-black text-muted-foreground mb-1">Ticket Types</div>
                                        <div className="text-xl font-black italic text-white">{form.getValues('tickets')?.length || 0} Tiers</div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <div className="text-[10px] uppercase font-black text-white/40 tracking-widest">About Preview</div>
                                    <p className="text-sm text-muted-foreground">This is how your event will appear in the main feed. Make sure your title and image are catchy!</p>
                                </div>
                                <Button onClick={() => setIsPreviewOpen(false)} className="w-full bg-white/5 hover:bg-white/10 text-white font-bold uppercase tracking-widest text-xs h-12 rounded-xl mt-8">
                                    Continue Editing
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </Form>
        </div>
    );
}
