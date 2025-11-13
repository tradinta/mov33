import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import type { Tour } from "@/lib/tours-data";
import { ArrowRight, Clock, Star, Users } from "lucide-react";

export function TourCard({ tour }: { tour: Tour }) {
  return (
    <Card className="group overflow-hidden rounded-xl bg-card text-card-foreground shadow-sm transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          <Link href={`/tours/${tour.id}`}>
            <Image
              src={tour.image.imageUrl}
              alt={tour.image.description}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={tour.image.imageHint}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 25vw"
            />
          </Link>
          <div className="absolute top-3 left-3 z-10">
            <Badge className="bg-accent text-accent-foreground font-poppins">{tour.destination}</Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pb-2">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
             <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                <span>{tour.duration}</span>
            </div>
            <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400" />
                <span className="font-bold text-foreground">{tour.rating}</span>
            </div>
        </div>
        <h3 className="mt-2 font-headline text-lg font-bold text-foreground group-hover:text-accent transition-colors leading-tight">
            <Link href={`/tours/${tour.id}`}>{tour.name}</Link>
        </h3>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between items-center">
        <div>
            <p className="text-xs text-muted-foreground">From</p>
            <p className="font-headline font-bold text-xl text-accent">KES {tour.price}</p>
        </div>
        <Button asChild variant="outline" size="sm">
            <Link href={`/tours/${tour.id}`}>
                Details <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
