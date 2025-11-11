import { eventsData } from "@/lib/events-data";
import { EventCard, EventCardSkeleton } from "./event-card";

export function EventGrid() {
  // In a real app, you would fetch this data and handle loading states.
  const isLoading = false; 

  return (
    <div className="mt-12">
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <EventCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {eventsData.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
      {/* Implement infinite scroll or pagination here */}
    </div>
  );
}
