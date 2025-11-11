import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const partners = [
  { name: "Global Events Inc.", image: PlaceHolderImages.find(p => p.id === 'partner-1')! },
  { name: "Alex Travel", image: PlaceHolderImages.find(p => p.id === 'partner-2')! },
  { name: "DJ Spark", image: PlaceHolderImages.find(p => p.id === 'partner-3')! },
  { name: "City Tours Co.", image: PlaceHolderImages.find(p => p.id === 'partner-4')! },
];

export function FeaturedPartners() {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Our Partners</h2>
        <p className="mt-2 text-lg text-muted-foreground">Proudly working with the best organizers and influencers.</p>
      </div>
      <div className="mt-12 flex flex-wrap justify-center items-center gap-x-12 gap-y-8">
        {partners.map((partner) => (
          <div key={partner.name} className="flex flex-col items-center gap-3">
            <Avatar className="h-20 w-20 border-2 border-accent">
              <AvatarImage src={partner.image.imageUrl} alt={partner.name} data-ai-hint={partner.image.imageHint} />
              <AvatarFallback>{partner.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <span className="font-poppins font-semibold text-sm">{partner.name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
