import { PlaceHolderImages, type ImagePlaceholder } from "./placeholder-images";

export type Product = {
  id: string;
  name: string;
  price: number;
  image: ImagePlaceholder;
  category: 'Apparel' | 'Accessories' | 'Drinkware';
  description: string;
  sizes: string[];
  colors: { name: string; hex: string }[];
  gallery: ImagePlaceholder[];
};

export const shopData: Product[] = [
    {
        id: "mov33-signature-tee",
        name: "Mov33 Signature Tee",
        price: 2500,
        image: PlaceHolderImages.find(p => p.id === 'shop-1')!,
        category: "Apparel",
        description: "The official Mov33 signature t-shirt. Made from 100% premium, soft-touch cotton for a comfortable fit that lasts. Perfect for any event, from a concert to a casual day out.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "White", hex: "#FFFFFF" },
            { name: "Orange", hex: "#F56600" }
        ],
        gallery: [
            PlaceHolderImages.find(p => p.id === 'shop-1')!,
            { id: "tee-2", description: "T-shirt on a model", imageUrl: "https://picsum.photos/seed/shoptee2/800/800", imageHint: "t-shirt model" },
            { id: "tee-3", description: "Close up of t-shirt fabric", imageUrl: "https://picsum.photos/seed/shoptee3/800/800", imageHint: "fabric texture" },
        ]
    },
    {
        id: "the-night-owl-cap",
        name: "The Night Owl Cap",
        price: 2000,
        image: PlaceHolderImages.find(p => p.id === 'shop-2')!,
        category: "Accessories",
        description: "A stylish and comfortable 6-panel cap to wear on your next adventure. Features an embroidered Mov33 logo and an adjustable strap for the perfect fit.",
        sizes: ["One Size"],
        colors: [
            { name: "Black", hex: "#000000" },
            { name: "Navy", hex: "#000080" },
        ],
        gallery: [
             PlaceHolderImages.find(p => p.id === 'shop-2')!,
        ]
    },
    {
        id: "explorers-bottle",
        name: "Explorer's Bottle",
        price: 1800,
        image: PlaceHolderImages.find(p => p.id === 'shop-3')!,
        category: "Drinkware",
        description: "Stay hydrated with the Explorer's Bottle. This stainless steel bottle is double-wall insulated to keep your drinks cool for 24 hours or hot for 12. Leak-proof and durable.",
        sizes: ["750ml"],
        colors: [
            { name: "Stainless Steel", hex: "#A9A9A9" },
            { name: "Matte Black", hex: "#000000" },
        ],
        gallery: [
             PlaceHolderImages.find(p => p.id === 'shop-3')!,
        ]
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
        description: "Keep warm during those late-night festival sets with this cozy hoodie. Features a soft fleece interior, a minimalist front logo, and a large back graphic.",
        sizes: ["S", "M", "L", "XL"],
        colors: [
            { name: "Heather Grey", hex: "#C0C0C0" },
            { name: "Black", hex: "#000000" },
        ],
        gallery: [
            { id: "hoodie-1", description: "Black hoodie front", imageUrl: "https://picsum.photos/seed/shophoodie1/800/800", imageHint: "black hoodie" },
            { id: "hoodie-2", description: "Black hoodie back", imageUrl: "https://picsum.photos/seed/shophoodie2/800/800", imageHint: "hoodie design" },
        ]
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
        description: "The perfect carry-all for your daily essentials or for packing light for a weekend getaway. Made from heavy-duty canvas with reinforced straps.",
        sizes: ["One Size"],
        colors: [
            { name: "Natural", hex: "#F5F5DC" },
            { name: "Black", hex: "#000000" },
        ],
        gallery: [
            { id: "tote-1", description: "Tote bag", imageUrl: "https://picsum.photos/seed/shoptote1/800/800", imageHint: "tote bag" },
        ]
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
        description: "Start your day right with the Sunrise Mug. A classic 12oz ceramic mug that's perfect for your morning coffee or tea. Microwave and dishwasher safe.",
         sizes: ["12oz"],
        colors: [
            { name: "White", hex: "#FFFFFF" },
        ],
        gallery: [
            { id: "mug-1", description: "Mug", imageUrl: "https://picsum.photos/seed/shopmug1/800/800", imageHint: "coffee mug" },
        ]
    },
];
