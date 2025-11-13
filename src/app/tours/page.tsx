
import { ToursHero } from '@/components/tours/tours-hero';
import { ToursList } from '@/components/tours/tours-list';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Kenya Tours & Safaris | Mov33',
  description: 'Book unforgettable tours and safari adventures in Kenya. From the Maasai Mara to the pristine beaches of Diani, discover your next journey with Mov33.',
};

export default function ToursPage() {
  return (
    <div>
      <ToursHero />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-lg">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="today">Today</TabsTrigger>
                <TabsTrigger value="this-weekend">This Weekend</TabsTrigger>
                <TabsTrigger value="past" asChild>
                    <Link href="/archive">Past</Link>
                </TabsTrigger>
            </TabsList>
            <TabsContent value="all">
                <ToursList />
            </TabsContent>
            <TabsContent value="today">
                 <ToursList />
            </TabsContent>
            <TabsContent value="this-weekend">
                 <ToursList />
            </TabsContent>
             <TabsContent value="past">
                {/* This content is now handled by the /archive page */}
            </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
