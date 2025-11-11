import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "../ui/button";

const shopItems = [
  {
    name: "Mov33 Signature Tee",
    price: "$25.00",
    image: PlaceHolderImages.find(p => p.id === 'shop-1')!,
  },
  {
    name: "The Night Owl Cap",
    price: "$20.00",
    image: PlaceHolderImages.find(p => p.id === 'shop-2')!,
  },
  {
    name: "Explorer's Bottle",
    price: "$18.00",
    image: PlaceHolderImages.find(p => p.id === 'shop-3')!,
  },
];

export function ShopHighlights() {
  return (
    <section>
      <div className="text-center">
        <h2 className="font-headline text-3xl md:text-4xl font-bold">Get The Gear</h2>
        <p className="mt-2 text-lg text-muted-foreground">Rep your love for live experiences.</p>
      </div>
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {shopItems.map((item) => (
          <Card key={item.name} className="overflow-hidden group shadow-lg transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
            <CardContent className="p-0">
              <div className="relative aspect-square w-full bg-card">
                <Image
                  src={item.image.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  data-ai-hint={item.image.imageHint}
                />
              </div>
            </CardContent>
            <CardFooter className="flex-col items-start p-4">
              <h3 className="font-poppins font-semibold">{item.name}</h3>
              <div className="flex justify-between items-center w-full mt-2">
                <p className="text-muted-foreground">{item.price}</p>
                <Button variant="outline" size="sm" className="font-poppins">Add to Cart</Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
      <div className="text-center mt-12">
        <Button size="lg" variant="link" className="font-poppins text-accent text-lg">
          <Link href="/shop">Visit The Full Shop &rarr;</Link>
        </Button>
      </div>
    </section>
  );
}
