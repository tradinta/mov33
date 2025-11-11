import { ToursHero } from '@/components/tours/tours-hero';
import { ToursList } from '@/components/tours/tours-list';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kenya Tours & Safaris | Mov33',
  description: 'Book unforgettable tours and safari adventures in Kenya. From the Maasai Mara to the pristine beaches of Diani, discover your next journey with Mov33.',
};

export default function ToursPage() {
  return (
    <div>
      <ToursHero />
      <ToursList />
    </div>
  );
}
