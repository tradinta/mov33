import { HeroSection } from "@/components/home/hero-section";
import { DiscoverSection } from "@/components/home/discover-section";
import { VipHighlights } from "@/components/home/vip-highlights";
import { FeaturedPartners } from "@/components/home/featured-partners";
import { Testimonials } from "@/components/home/testimonials";
import { ShopHighlights } from "@/components/home/shop-highlights";
import { MainLayout } from "@/components/layout/main-layout";
import { EventGrid } from "@/components/events/event-grid";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20 md:space-y-28 py-16 md:py-24">
          <div>
            <div className="text-center">
              <h2 className="font-headline text-3xl md:text-4xl font-bold">Now Trending</h2>
              <p className="mt-2 text-lg text-muted-foreground">The hottest events right now.</p>
            </div>
            <EventGrid />
          </div>
          <DiscoverSection />
          <VipHighlights />
          <FeaturedPartners />
          <Testimonials />
          <ShopHighlights />
        </div>
      </div>
    </MainLayout>
  );
}
