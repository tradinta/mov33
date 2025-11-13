'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const formSchema = z.object({
  companyName: z.string().min(2, 'Company name is required.'),
  contactName: z.string().min(2, 'Your name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  phone: z.string().min(10, 'Please enter a valid phone number.'),
  website: z.string().url('Please enter a valid website URL.').optional().or(z.literal('')),
  experience: z.string().min(20, 'Please tell us a bit about your experience.'),
});

export default function OrganizerApplicationPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      companyName: '',
      contactName: '',
      email: '',
      phone: '',
      website: '',
      experience: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Application Submitted!',
      description: "Thank you for your interest. We'll be in touch soon.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Organizer Application</CardTitle>
          <CardDescription>
            Tell us about your organization. We're excited to learn more about how we can partner together.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company / Brand Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Awesome Events Inc." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <div className="grid md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="you@company.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Phone</FormLabel>
                        <FormControl>
                        <Input type="tel" placeholder="+254 712 345 678" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
               <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://your-company.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="experience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tell us about your events</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What kind of events do you host? What's your typical audience size? Share links to past events if you can."
                        className="resize-y min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" size="lg">Submit Application</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
