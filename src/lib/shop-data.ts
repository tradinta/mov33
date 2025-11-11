import { PlaceHolderImages, type ImagePlaceholder } from "./placeholder-images";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: ImagePlaceholder;
  category: 'Apparel' | 'Accessories' | 'Drinkware';
  description: string;
};

export const shopData: Product[] = [
    {
        id: "mov33-signature-tee",
        name: "Mov33 Signature Tee",
        price: 2500,
        image: PlaceHolderImages.find(p => p.id === 'shop-1')!,
        category: "Apparel",
        description: "The official Mov33 signature t-shirt. Made from 100% premium cotton for a soft, comfortable fit. Perfect for any event.",
    },
    {
        id: "the-night-owl-cap",
        name: "The Night Owl Cap",
        price: 2000,
        image: PlaceHolderImages.find(p => p.id === 'shop-2')!,
        category: "Accessories",
        description: "A stylish and comfortable cap to wear on your next adventure. Features an embroidered Mov33 logo.",
    },
    {
        id: "explorers-bottle",
        name: "Explorer's Bottle",
        price: 1800,
        image: PlaceHolderImages.find(p => p.id === 'shop-3')!,
        category: "Drinkware",
        description: "Stay hydrated with the Explorer's Bottle. Insulated to keep your drinks cool for hours.",
    },
    {
        id: "festival-hoodie",
        name: "Festival Hoodie",
        price: 4500,
        image: {
            "id": "shop-hoodie",
            "description": "A comfortable black hoodie with a minimalist design",
            "imageUrl": "https://picsum.photos/seed/shophoodie/800/800",
            "imageHint": "black hoodie"
        },
        category: "Apparel",
        description: "Keep warm during those late-night festival sets with this cozy hoodie. Features a fleece interior and a minimalist design.",
    },
    {
        id: "adventure-tote-bag",
        name: "Adventure Tote Bag",
        price: 1500,
        image: {
            "id": "shop-tote",
            "description": "A durable and stylish canvas tote bag",
            "imageUrl": "https://picsum.photos/seed/shoptote/800/800",
            "imageHint": "tote bag"
        },
        category: "Accessories",
        description: "The perfect carry-all for your daily essentials or for packing light for a weekend getaway.",
    },
    {
        id: "sunrise-mug",
        name: "Sunrise Mug",
        price: 1200,
        image: {
            "id": "shop-mug",
            "description": "A ceramic coffee mug with a subtle logo",
            "imageUrl": "https://picsum.photos/seed/shopmug/800/800",
            "imageHint": "coffee mug"
        },
        category: "Drinkware",
        description: "Start your day right. A classic ceramic mug that's perfect for your morning coffee or tea.",
    },
];
