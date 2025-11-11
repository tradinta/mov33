import { PlaceHolderImages, type ImagePlaceholder } from "./placeholder-images";

export type Tour = {
  id: string;
  name: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
  destination: string;
  description: string;
  highlights: string[];
  includes: string[];
  notIncludes: string[];
  image: ImagePlaceholder;
  gallery: ImagePlaceholder[];
  organizer: {
    id: string;
    name: string;
    logoUrl: string;
  }
};

export const toursData: Tour[] = [
  {
    id: "masai-mara-safari",
    name: "3-Day Maasai Mara Grand Safari",
    duration: "3 Days, 2 Nights",
    price: "45,000",
    rating: 4.9,
    reviews: 132,
    destination: "Maasai Mara",
    description: "Witness the Great Migration and the Big Five in Kenya's most famous game reserve. This safari offers an unparalleled opportunity to experience the stunning landscapes and abundant wildlife of the Mara ecosystem. An unforgettable journey into the heart of the wild.",
    highlights: ["The Great Wildebeest Migration (seasonal)", "Big Five sightings (Lion, Leopard, Rhino, Elephant, Buffalo)", "Maasai village cultural visit", "Game drives in a 4x4 Land Cruiser"],
    includes: ["Park entrance fees", "2 nights accommodation in a luxury lodge", "All meals (Breakfast, Lunch, Dinner)", "Professional English-speaking guide", "Bottled water during drives"],
    notIncludes: ["International flights", "Visa fees", "Hot air balloon safari", "Gratuities and personal items"],
    image: PlaceHolderImages.find(p => p.id === 'mara-tour')!,
    gallery: [
      PlaceHolderImages.find(p => p.id === 'mara-tour')!,
      { id: "mara-gallery-1", imageUrl: "https://picsum.photos/seed/mara1/600/400", description: "Lions resting in the savanna", imageHint: "lions savanna" },
      { id: "mara-gallery-2", imageUrl: "https://picsum.photos/seed/mara2/600/400", description: "Wildebeest crossing a river", imageHint: "wildebeest migration" },
      { id: "mara-gallery-3", imageUrl: "https://picsum.photos/seed/mara3/600/400", description: "Maasai warriors jumping", imageHint: "maasai people" },
    ],
    organizer: {
        id: "alex-travel",
        name: "Alex Travel",
        logoUrl: "https://picsum.photos/seed/alextravel/100/100"
    }
  },
  {
    id: "amboseli-kilimanjaro",
    name: "Amboseli & Kilimanjaro Views",
    duration: "2 Days, 1 Night",
    price: "28,000",
    rating: 4.8,
    reviews: 89,
    destination: "Amboseli",
    description: "Get up close with huge herds of free-ranging elephants and enjoy breathtaking, postcard-perfect views of Mount Kilimanjaro, the highest peak in Africa. This short but impactful tour is perfect for those with limited time.",
    highlights: ["Iconic views of Mt. Kilimanjaro", "Large herds of free-ranging elephants", "Observation Hill for panoramic views", "Abundant birdlife"],
    includes: ["Park entrance fees", "1 night in a luxury tented camp", "Game drives", "All meals"],
    notIncludes: ["Drinks", "Laundry", "Gratuities"],
    image: PlaceHolderImages.find(p => p.id === 'amboseli-tour')!,
    gallery: [
       PlaceHolderImages.find(p => p.id === 'amboseli-tour')!,
       { id: "amboseli-gallery-1", imageUrl: "https://picsum.photos/seed/amboseli1/600/400", description: "A large elephant with Kilimanjaro in the background", imageHint: "elephant mountain" },
       { id: "amboseli-gallery-2", imageUrl: "https://picsum.photos/seed/amboseli2/600/400", description: "Zebras grazing in Amboseli", imageHint: "zebras grazing" },
    ],
     organizer: {
        id: "city-tours-co",
        name: "City Tours Co.",
        logoUrl: "https://picsum.photos/seed/citytours/100/100"
    }
  },
  {
    id: "coastal-escape-diani",
    name: "Diani Beach Coastal Escape",
    duration: "4 Days, 3 Nights",
    price: "35,000",
    rating: 4.7,
    reviews: 115,
    destination: "Diani",
    description: "Relax on the pristine white sands of one of the world's most beautiful beaches. This package is perfect for relaxation, water sports, and enjoying the vibrant local culture and nightlife of the Kenyan coast.",
    highlights: ["Award-winning white sand beaches", "Snorkeling & diving in Kisite-Mpunguti Marine Park", "Camel rides on the beach", "Exploring the ancient Kongo Mosque"],
    includes: ["3 nights in a beach-front resort", "Daily breakfast and dinner", "Return airport transfers (Moi International)", "Full-day Wasini Island dhow trip with seafood lunch"],
    notIncludes: ["Lunches (except on Wasini trip)", "Water sports activities", "Spa treatments"],
    image: PlaceHolderImages.find(p => p.id === 'coast-tour')!,
    gallery: [
        PlaceHolderImages.find(p => p.id === 'coast-tour')!,
        { id: "diani-gallery-1", imageUrl: "https://picsum.photos/seed/diani1/600/400", description: "Dhow sailing on the ocean at sunset", imageHint: "dhow sunset" },
        { id: "diani-gallery-2", imageUrl: "https://picsum.photos/seed/diani2/600/400", description: "Colorful fish while snorkeling", imageHint: "snorkeling fish" },
        { id: "diani-gallery-3", imageUrl: "https://picsum.photos/seed/diani3/600/400", description: "A seaside restaurant in Diani", imageHint: "seaside restaurant" },
    ],
     organizer: {
        id: "alex-travel",
        name: "Alex Travel",
        logoUrl: "https://picsum.photos/seed/alextravel/100/100"
    }
  },
  {
    id: "nairobi-city-tour",
    name: "Nairobi National Park & City Highlights",
    duration: "1 Day",
    price: "8,500",
    rating: 4.6,
    reviews: 204,
    destination: "Nairobi",
    description: "Experience the world's only wildlife capital. See lions, giraffes, and rhinos against the backdrop of the city skyline, then explore key city landmarks and animal conservation centers in this packed one-day tour.",
    highlights: ["Game drive in Nairobi National Park", "Visit to the David Sheldrick Elephant Orphanage", "Giraffe feeding at the Giraffe Centre", "Cultural shopping at Kazuri Beads Women's Cooperative"],
    includes: ["Hotel pickup and drop-off", "Private game drive", "Entrance fees to all mentioned locations", "Professional guide"],
    notIncludes: ["Lunch", "Gratuities"],
    image: PlaceHolderImages.find(p => p.id === 'nairobi-tour')!,
    gallery: [
        PlaceHolderImages.find(p => p.id === 'nairobi-tour')!,
        { id: "nairobi-gallery-1", imageUrl: "https://picsum.photos/seed/nairobi1/600/400", description: "Feeding a giraffe at the Giraffe Centre", imageHint: "giraffe feeding" },
        { id: "nairobi-gallery-2", imageUrl: "https://picsum.photos/seed/nairobi2/600/400", description: "A baby elephant at the Sheldrick Trust", imageHint: "baby elephant" },
    ],
     organizer: {
        id: "city-tours-co",
        name: "City Tours Co.",
        logoUrl: "https://picsum.photos/seed/citytours/100/100"
    }
  },
];
