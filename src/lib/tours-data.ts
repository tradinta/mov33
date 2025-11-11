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
  image: ImagePlaceholder;
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
    description: "Witness the Great Migration and the Big Five in Kenya's most famous game reserve. An unforgettable journey into the heart of the wild.",
    highlights: ["The Great Wildebeest Migration (seasonal)", "Big Five sightings (Lion, Leopard, Rhino, Elephant, Buffalo)", "Maasai village cultural visit", "Hot air balloon safari option"],
    includes: ["Park fees", "2 nights accommodation", "Game drives", "All meals"],
    image: PlaceHolderImages.find(p => p.id === 'mara-tour')!,
  },
  {
    id: "amboseli-kilimanjaro",
    name: "Amboseli & Kilimanjaro Views",
    duration: "2 Days, 1 Night",
    price: "28,000",
    rating: 4.8,
    reviews: 89,
    destination: "Amboseli",
    description: "Get up close with huge herds of elephants and enjoy breathtaking views of Mount Kilimanjaro, the highest peak in Africa.",
    highlights: ["Iconic views of Mt. Kilimanjaro", "Large herds of free-ranging elephants", "Observation Hill for panoramic views", "Abundant birdlife"],
    includes: ["Park fees", "1 night luxury tented camp stay", "Game drives", "All meals"],
    image: PlaceHolderImages.find(p => p.id === 'amboseli-tour')!,
  },
  {
    id: "coastal-escape-diani",
    name: "Diani Beach Coastal Escape",
    duration: "4 Days, 3 Nights",
    price: "35,000",
    rating: 4.7,
    reviews: 115,
    destination: "Diani",
    description: "Relax on the pristine white sands of one of the world's most beautiful beaches. Perfect for relaxation, water sports, and vibrant nightlife.",
    highlights: ["Award-winning white sand beaches", "Snorkeling & diving in Kisite-Mpunguti Marine Park", "Camel rides on the beach", "Vibrant nightlife"],
    includes: ["3 nights beach resort stay", "Daily breakfast", "Airport transfers", "Wasini Island dhow trip"],
    image: PlaceHolderImages.find(p => p.id === 'coast-tour')!,
  },
  {
    id: "nairobi-city-tour",
    name: "Nairobi National Park & City Tour",
    duration: "1 Day",
    price: "8,500",
    rating: 4.6,
    reviews: 204,
    destination: "Nairobi",
    description: "The world's only wildlife capital. See lions, giraffes, and rhinos against the backdrop of the city skyline, then explore key city landmarks.",
    highlights: ["Wildlife viewing in Nairobi National Park", "Visit the David Sheldrick Elephant Orphanage", "Giraffe Centre feeding experience", "Kazuri Beads Women's Cooperative"],
    includes: ["Hotel pickup and drop-off", "Game drive", "Entrance fees to all mentioned locations", "Professional guide"],
    image: PlaceHolderImages.find(p => p.id === 'nairobi-tour')!,
  },
];
