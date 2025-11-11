import { eventsData, type Event } from "./events-data";
import { toursData, type Tour } from "./tours-data";

export type Organizer = {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    events: Event[];
    tours: Tour[];
    isFollowed?: boolean;
};

export const organizersData: Organizer[] = [
    {
        id: 'kenya-rugby-union',
        name: "Kenya Rugby Union",
        logoUrl: "https://picsum.photos/seed/kru/200/200",
        description: "The official governing body of rugby in Kenya, dedicated to promoting the sport and organizing world-class tournaments.",
        events: eventsData.filter(event => event.organizerId === 'kenya-rugby-union'),
        tours: [],
        isFollowed: true,
    },
    {
        id: 'mov33-presents',
        name: "Mov33 Presents",
        logoUrl: "https://picsum.photos/seed/mov33/200/200",
        description: "Curators of premium live experiences in Kenya, bringing the world's best artists to the local stage.",
        events: eventsData.filter(event => event.organizerId === 'mov33-presents'),
        tours: []
    },
    {
        id: 'alex-travel',
        name: 'Alex Travel',
        logoUrl: "https://picsum.photos/seed/alextravel/200/200",
        description: "Your trusted partner for bespoke safaris and adventure travel in East Africa.",
        events: [],
        tours: toursData.filter(tour => tour.organizer.id === 'alex-travel'),
    },
    {
        id: 'city-tours-co',
        name: 'City Tours Co.',
        logoUrl: "https://picsum.photos/seed/citytours/200/200",
        description: "Specializing in unique urban explorations and day trips in and around Kenya's vibrant cities.",
        events: [],
        tours: toursData.filter(tour => tour.organizer.id === 'city-tours-co'),
    }
];
