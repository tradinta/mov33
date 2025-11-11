import { PlaceHolderImages, type ImagePlaceholder } from "./placeholder-images";

export type Event = {
  id: string;
  name: string;
  date: string;
  location: string;
  price: string;
  tags: string[];
  image: ImagePlaceholder;
  description: string;
  organizerId: string;
};

// Replace with more specific images if they exist in placeholder-images.json
const defaultImage = PlaceHolderImages[0];

export const eventsData: Event[] = [
  {
    id: "sauti-sol-live",
    name: "Sauti Sol: Live in Nairobi",
    date: "Sat, 24 Dec 2024",
    location: "Uhuru Gardens, Nairobi",
    price: "5,000",
    tags: ["Concert", "Trending"],
    image: PlaceHolderImages.find(p => p.id === 'hero-1') || defaultImage,
    description: "Experience the vibrant sounds of Kenya with top local and international artists.",
    organizerId: "mov33-presents"
  },
  {
    id: "lamu-festival",
    name: "Lamu Cultural Festival",
    date: "15-18 Nov 2024",
    location: "Lamu Old Town, Lamu",
    price: "1,500",
    tags: ["Festival", "Culture"],
    image: {
      id: "lamu-festival",
      description: "Traditional dhow race during the Lamu Cultural Festival",
      imageUrl: "https://images.unsplash.com/photo-1590391471343-98780c7a5f64?q=80&w=1974&auto=format&fit=crop",
      imageHint: "kenyan festival"
    },
    description: "Immerse yourself in the unique Swahili heritage of one of Kenya's oldest towns.",
    organizerId: "mov33-presents"
  },
  {
    id: "safari-sevens",
    name: "Safari Sevens Rugby",
    date: "20-22 Oct 2024",
    location: "RFUEA Ground, Nairobi",
    price: "2,500",
    tags: ["Sports", "Popular"],
    image: {
      id: "safari-sevens",
      description: "Rugby players in action during a match",
      imageUrl: "https://images.unsplash.com/photo-1544298133-03c86c13a486?q=80&w=2070&auto=format&fit=crop",
      imageHint: "rugby match"
    },
    description: "Experience the thrill of Africa's premier seven-a-side rugby tournament.",
    organizerId: "kenya-rugby-union"
  },
  {
    id: "mombasa-food-fest",
    name: "Mombasa Food Festival",
    date: "Sat, 12 Oct 2024",
    location: "Mama Ngina Waterfront, Mombasa",
    price: "1,000",
    tags: ["Food", "Community"],
    image: {
      id: "mombasa-food",
      description: "A delicious plate of Swahili food",
      imageUrl: "https://images.unsplash.com/photo-1594935422899-b91a34341938?q=80&w=2070&auto=format&fit=crop",
      imageHint: "kenyan food"
    },
    description: "Taste the authentic flavors of the Kenyan coast in this guided street food adventure.",
    organizerId: "mov33-presents"
  },
  {
    id: "rhino-charge",
    name: "The Rhino Charge",
    date: "Sun, 01 Jun 2025",
    location: "Undisclosed, Kenya",
    price: "15,000",
    tags: ["Sports", "Adventure", "VIP"],
    image: {
      id: "rhino-charge",
      description: "A 4x4 vehicle tackling a tough off-road course",
      imageUrl: "https://images.unsplash.com/photo-1551648352-4934443657b9?q=80&w=2070&auto=format&fit=crop",
      imageHint: "offroad vehicle"
    },
    description: "An exhilarating off-road challenge to raise funds for rhino conservation in Kenya.",
    organizerId: "kenya-rugby-union"
  },
  {
    id: "blankets-and-wine",
    name: "Blankets & Wine Festival",
    date: "Sun, 08 Dec 2024",
    location: "Laurette Garden, Nairobi",
    price: "4,500",
    tags: ["Festival", "Music"],
    image: PlaceHolderImages.find(p => p.id === 'discover-events') || defaultImage,
    description: "Nairobi's premier picnic-style music festival celebrating African talent.",
    organizerId: "mov33-presents"
  },
  {
    id: "nairobi-tech-week",
    name: "Nairobi Tech Week",
    date: "04-08 Nov 2024",
    location: "iHub, Nairobi",
    price: "Free",
    tags: ["Tech", "Community"],
    image: {
      id: "nairobi-tech",
      description: "People networking at a tech conference",
      imageUrl: "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop",
      imageHint: "tech conference"
    },
    description: "Connect with the brightest minds in African tech and innovation.",
    organizerId: "mov33-presents"
  },
  {
    id: "diani-beach-party",
    name: "Diani New Year Beach Party",
    date: "Tue, 31 Dec 2024",
    location: "Forty Thieves, Diani",
    price: "7,500",
    tags: ["Nightlife", "VIP"],
    image: PlaceHolderImages.find(p => p.id === 'hero-3') || defaultImage,
    description: "Usher in the new year with the ultimate beach party on the beautiful shores of Diani.",
    organizerId: "mov33-presents"
  },
];
