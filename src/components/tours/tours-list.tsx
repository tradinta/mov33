import { toursData } from "@/lib/tours-data";
import { TourCard } from "./tour-card";

export function ToursList() {
  return (
    <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {toursData.map(tour => (
                    <TourCard key={tour.id} tour={tour} />
                ))}
            </div>
        </div>
    </div>
  );
}
