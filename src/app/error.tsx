'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { MainLayout } from '@/components/layout/main-layout';
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <MainLayout>
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <AlertTriangle className="w-24 h-24 text-destructive/80" strokeWidth={1.5} />
        <h1 className="mt-8 text-4xl md:text-5xl font-headline font-extrabold text-foreground">
          Something went wrong
        </h1>
        <p className="mt-4 text-lg text-muted-foreground max-w-lg">
          We're sorry, but an unexpected error occurred. Our team has been notified. Please try again in a few moments.
        </p>
        <p className="mt-2 text-sm text-muted-foreground/60 max-w-md">
            Error: {error.message}
        </p>
        <div className="mt-8">
          <Button onClick={() => reset()} size="lg">
            Try Again
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
