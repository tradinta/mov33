import { toursData } from "@/lib/tours-data";
import { TourCard } from "./tour-card";

export function ToursList() {
  return (
    <div className="bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="space-y-12">
                {toursData.map(tour => (
                    <TourCard key={tour.id} tour={tour} />
                ))}
            </div>
        </div>
    </div>
  );
}
