import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { toursData, type Tour } from '@/lib/tours-data';
import { TourDetailHero } from '@/components/tours/tour-detail-hero';
import { TourBookingCard } from '@/components/tours/tour-booking-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Check, X } from 'lucide-react';


type TourDetailPageProps = {
  params: { id: string };
};

export async function generateMetadata({ params }: TourDetailPageProps): Promise<Metadata> {
  const tour = toursData.find((t) => t.id === params.id);

  if (!tour) {
    return {
      title: "Tour Not Found | Mov33",
      description: "The tour you are looking for could not be found.",
    };
  }

  return {
    title: `${tour.name} | Mov33 Tours`,
    description: `Book the ${tour.name} and explore ${tour.destination}. ${tour.description}`,
  };
}


export default function TourDetailPage({ params }: TourDetailPageProps) {
  const tour = toursData.find((t) => t.id === params.id);

  if (!tour) {
    notFound();
  }
  
  return (
    <div className="bg-background text-foreground">
        <TourDetailHero tour={tour} />

        {/* Main Grid Layout */}
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-[1fr,420px] gap-12 px-4 py-12">
            {/* Left Column: Tour Info */}
            <main className="space-y-12">
                <section id="about">
                    <h2 className="font-headline text-3xl font-bold">About the Tour</h2>
                    <div className="mt-4 prose prose-invert max-w-none text-muted-foreground font-body leading-relaxed text-lg">
                      <p>{tour.description}</p>
                    </div>
                </section>

                <Separator />

                <section id="highlights">
                    <h2 className="font-headline text-3xl font-bold">Tour Highlights</h2>
                    <ul className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {tour.highlights.map((highlight, index) => (
                            <li key={index} className="flex items-start gap-3">
                                <div className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                                    <Star className="h-4 w-4" />
                                </div>
                                <span className="text-muted-foreground">{highlight}</span>
                            </li>
                        ))}
                    </ul>
                </section>
                
                <Separator />

                <section id="inclusions" className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                           <Check className="h-6 w-6 text-green-500" /> What's Included
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {tour.includes.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                    <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                     <div>
                        <h3 className="font-headline text-2xl font-bold flex items-center gap-2">
                           <X className="h-6 w-6 text-destructive" /> What's Not Included
                        </h3>
                        <ul className="mt-4 space-y-3">
                            {tour.notIncludes.map((item, i) => (
                                <li key={i} className="flex items-center gap-3 text-muted-foreground">
                                    <X className="h-4 w-4 text-destructive flex-shrink-0" />
                                    <span>{item}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <Separator />

                <section id="organizer">
                    <h2 className="font-headline text-3xl font-bold">Tour Operator</h2>
                     <Link href={`/organizers/${tour.organizer.id}`} className="block group">
                        <Card className="mt-4 flex items-center gap-4 p-4 bg-card/50 group-hover:bg-accent/10 transition-colors">
                            <Avatar className="h-16 w-16 border">
                                <AvatarImage src={tour.organizer.logoUrl} alt={tour.organizer.name}/>
                                <AvatarFallback>{tour.organizer.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                                <h3 className="font-poppins font-semibold text-lg group-hover:text-accent">{tour.organizer.name}</h3>
                                <p className="text-sm text-muted-foreground">Trusted partner for unforgettable adventures.</p>
                            </div>
                        </Card>
                    </Link>
                </section>

            </main>

            {/* Right Column: Booking */}
            <aside>
                <div className="sticky top-24 space-y-6">
                   <TourBookingCard price={tour.price} />
                </div>
            </aside>
        </div>
    </div>
  );
}
