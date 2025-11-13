
'use client';
import { useState } from 'react';
import { ToursHero } from '@/components/tours/tours-hero';
import { ToursList } from '@/components/tours/tours-list';
import type { Metadata } from 'next';
import { TourFilter } from '@/components/tours/tour-filter';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Link from 'next/link';

// export const metadata: Metadata = {
//   title: 'Kenya Tours & Safaris | Mov33',
//   description: 'Book unforgettable tours and safari adventures in Kenya. From the Maasai Mara to the pristine beaches of Diani, discover your next journey with Mov33.',
// };

export default function ToursPage() {
  const [isFilterSheetOpen, setFilterSheetOpen] = useState(false);

  return (
    <div>
      <ToursHero />
       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
           {/* Filters Column (Desktop) */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24">
              <TourFilter />
            </div>
          </aside>
          
           {/* Main Content Column */}
          <main className="lg:col-span-3">
             {/* Mobile Filter Button */}
            <div className="lg:hidden my-6 flex justify-between items-center">
                <h2 className="font-headline text-2xl font-bold">All Tours</h2>
                <Dialog open={isFilterSheetOpen} onOpenChange={setFilterSheetOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline">
                            <SlidersHorizontal className="mr-2 h-4 w-4" />
                            Filters
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>Tour Filters</DialogTitle>
                        </DialogHeader>
                        <TourFilter />
                        <DialogFooter>
                          <Button onClick={() => setFilterSheetOpen(false)} className="w-full">Apply Filters</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>
            
            <div className="flex justify-between items-center">
              <h2 className="font-headline text-3xl font-bold hidden lg:block">Available Tours</h2>
              <Tabs defaultValue="all" className="w-full">
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="today">Today</TabsTrigger>
                  <TabsTrigger value="tomorrow">This Weekend</TabsTrigger>
                  <TabsTrigger value="past" asChild>
                    <Link href="/archive">Past</Link>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            <ToursList />
          </main>
        </div>
      </div>
    </div>
  );
}
