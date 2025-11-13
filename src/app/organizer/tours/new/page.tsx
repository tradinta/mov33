
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Map } from 'lucide-react';
import Link from 'next/link';

export default function NewTourPage() {
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
          <h1 className="text-2xl font-bold font-headline">Create a New Tour</h1>
          <p className="text-muted-foreground">
            Fill out the details below to list your tour package on Mov33.
          </p>
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Coming Soon</CardTitle>
          <CardDescription>
            The tour creation form is currently under development.
          </CardDescription>
        </CardHeader>
        <CardContent className="h-60 flex flex-col items-center justify-center border-2 border-dashed rounded-lg">
          <Map className="h-12 w-12 text-muted-foreground" />
          <p className="mt-4 text-muted-foreground">
            You'll soon be able to create and manage tour packages here.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
