import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Tour } from "@/lib/tours-data";
import { ArrowRight, CheckCircle, Clock, Star, Users } from "lucide-react";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Card className="group grid grid-cols-1 md:grid-cols-[3fr,4fr] overflow-hidden rounded-xl bg-card text-card-foreground shadow-md transition-all duration-300 ease-in-out hover:shadow-xl hover:shadow-accent/10 hover:-translate-y-1">
      {/* Image Section */}
      <div className="relative aspect-[4/3] md:aspect-auto w-full overflow-hidden">
        <Image
          src={tour.image.imageUrl}
          alt={tour.image.description}
          fill
          sizes="(max-width: 768px) 100vw, 30vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          data-ai-hint={tour.image.imageHint}
        />
        <div className="absolute top-4 left-4 z-10">
            <Badge className="bg-accent text-accent-foreground font-poppins">{tour.destination}</Badge>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6 flex flex-col">
        <div className="flex items-start justify-between gap-4">
            <h3 className="font-headline text-2xl font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
              <Link href={`/tours/${tour.id}`}>{tour.name}</Link>
            </h3>
            <div className="flex items-center gap-2 flex-shrink-0">
                <Star className="h-5 w-5 text-amber-400" />
                <span className="font-bold text-foreground">{tour.rating}</span>
                <span className="text-sm text-muted-foreground">({tour.reviews} reviews)</span>
            </div>
        </div>

        <p className="mt-2 text-sm text-muted-foreground font-body flex-grow">
          {tour.description}
        </p>

        <div className="mt-4">
            <h4 className="font-poppins font-semibold text-sm">Tour Highlights:</h4>
            <ul className="mt-2 space-y-1 text-xs text-muted-foreground list-disc list-inside">
                {tour.highlights.slice(0, 2).map(highlight => (
                    <li key={highlight}>{highlight}</li>
                ))}
            </ul>
        </div>
        
        <div className="mt-6 border-t pt-4 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4 text-accent" />
                    <span>Duration: <span className="font-semibold text-foreground">{tour.duration}</span></span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4 text-accent" />
                    <span>Group Size: Up to 6 people</span>
                </div>
            </div>
            <div className="text-left sm:text-right">
                <span className="text-sm text-muted-foreground">From</span>
                <p className="font-headline text-3xl font-bold text-accent">KES {tour.price}</p>
                <Link href={`/tours/${tour.id}`}>
                    <Button variant="link" className="p-0 h-auto text-accent font-poppins">
                        View Details <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                </Link>
            </div>
        </div>
      </div>
    </Card>
  );
}
