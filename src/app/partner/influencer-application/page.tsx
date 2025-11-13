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
  fullName: z.string().min(2, 'Your name is required.'),
  email: z.string().email('Please enter a valid email address.'),
  instagram: z.string().min(3, 'Instagram handle is required.'),
  tiktok: z.string().optional(),
  twitter: z.string().optional(),
  primaryAudience: z.string().min(3, 'Please describe your audience.'),
  why: z.string().min(20, 'Please tell us a bit more.'),
});

export default function InfluencerApplicationPage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
        fullName: '',
        email: '',
        instagram: '',
        tiktok: '',
        twitter: '',
        primaryAudience: '',
        why: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    toast({
      title: 'Application Submitted!',
      description: "Thank you for your interest. We'll be in touch if it's a good fit.",
    });
    form.reset();
  }

  return (
    <div className="container mx-auto max-w-2xl py-16">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-3xl">Influencer Application</CardTitle>
          <CardDescription>
            Ready to share the best events with your audience? Fill out the form below to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
               <div className="grid md:grid-cols-2 gap-8">
                 <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                        <Input placeholder="e.g., Alex Influencer" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                    <FormItem>
                        <FormLabel>Contact Email</FormLabel>
                        <FormControl>
                        <Input type="email" placeholder="you@domain.com" {...field} />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                    )}
                />
               </div>
                <div>
                    <FormLabel>Social Media Handles</FormLabel>
                    <div className="grid md:grid-cols-3 gap-4 mt-2">
                        <FormField
                            control={form.control}
                            name="instagram"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="@instagram" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="tiktok"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="@tiktok (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="twitter"
                            render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                <Input placeholder="@twitter (optional)" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                    </div>
                </div>
               <FormField
                control={form.control}
                name="primaryAudience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Describe your primary audience</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Nairobi-based foodies, aged 20-30" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="why"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Why do you want to partner with Mov33?</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell us what kind of events you're passionate about and why you'd be a great fit."
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
