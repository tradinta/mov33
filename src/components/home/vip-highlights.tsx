import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { MapPin, Calendar } from "lucide-react";

const vipEvents = [
  {
    title: "Sunset Yacht Gala",
    location: "Marina Bay",
    date: "Dec 15, 2024",
    image: PlaceHolderImages.find(p => p.id === 'vip-1')!,
  },
  {
    title: "Rooftop City Lights",
    location: "The Sky Lounge",
    date: "Every Friday",
    image: PlaceHolderImages.find(p => p.id === 'vip-2')!,
  }
];

export function VipHighlights() {
  return (
    <section className="bg-sand text-charcoal rounded-lg p-8 md:p-16">
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Exclusive Access</h2>
        <p className="mt-2 text-lg text-muted-foreground">Elevate your experience with our VIP events.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {vipEvents.map((event) => (
          <Card key={event.title} className="bg-card text-card-foreground shadow-lg overflow-hidden group">
            <div className="md:flex">
              <div className="md:w-1/2 relative min-h-[250px]">
                <Image
                  src={event.image.imageUrl}
                  alt={event.image.description}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={event.image.imageHint}
                />
              </div>
              <div className="md:w-1/2 p-6 flex flex-col">
                <CardHeader className="p-0">
                  <Badge className="bg-muted-gold text-white font-poppins w-fit">VIP</Badge>
                  <CardTitle className="font-headline text-2xl mt-2">{event.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-0 mt-4 flex-grow">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mt-2">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{event.date}</span>
                  </div>
                </CardContent>
                <div className="mt-6">
                  <Button className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-poppins">
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
