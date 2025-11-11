import { eventsData, type Event } from "./events-data";

export type Organizer = {
    id: string;
    name: string;
    logoUrl: string;
    description: string;
    events: Event[];
};

export const organizersData: Organizer[] = [
    {
        id: 'kenya-rugby-union',
        name: "Kenya Rugby Union",
        logoUrl: "https://picsum.photos/seed/kru/200/200",
        description: "The official governing body of rugby in Kenya, dedicated to promoting the sport and organizing world-class tournaments.",
        events: eventsData.filter(event => event.organizerId === 'kenya-rugby-union')
    },
    {
        id: 'mov33-presents',
        name: "Mov33 Presents",
        logoUrl: "https://picsum.photos/seed/mov33/200/200",
        description: "Curators of premium live experiences in Kenya, bringing the world's best artists to the local stage.",
        events: eventsData.filter(event => event.organizerId === 'mov33-presents')
    }
];
