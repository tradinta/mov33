import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";

const testimonials = [
  {
    quote: "Mov33 made finding and booking tickets for my favorite concert a breeze. The entire experience was seamless and so polished!",
    name: "Jessica Miller",
    handle: "@jess_m",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-1')!
  },
  {
    quote: "As an event organizer, the dashboard is a game-changer. I can manage everything from ticket sales to influencer campaigns in one place.",
    name: "David Chen",
    handle: "@dchen_events",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-2')!
  },
  {
    quote: "Finally, a platform that gets nightlife. I discovered so many cool spots and parties I would have missed otherwise. Highly recommend!",
    name: "Sarah Kim",
    handle: "@sarahk_nightowl",
    image: PlaceHolderImages.find(p => p.id === 'testimonial-3')!
  }
];

export function Testimonials() {
  return (
    <section className="bg-sand text-charcoal rounded-lg p-8 md:p-16">
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">What People Are Saying</h2>
        <p className="mt-2 text-lg text-muted-foreground">Stories from our vibrant community.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <Card key={index} className="bg-card text-card-foreground flex flex-col justify-between shadow-lg">
            <CardContent className="p-6">
              <blockquote className="text-base italic">"{testimonial.quote}"</blockquote>
            </CardContent>
            <div className="flex items-center gap-4 p-6 pt-0">
              <Avatar className="h-12 w-12">
                <AvatarImage src={testimonial.image.imageUrl} alt={testimonial.name} data-ai-hint={testimonial.image.imageHint} />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-poppins font-semibold">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.handle}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
