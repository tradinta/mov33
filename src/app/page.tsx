import { HeroSection } from "@/components/home/hero-section";
import { DiscoverSection } from "@/components/home/discover-section";
import { VipHighlights } from "@/components/home/vip-highlights";
import { FeaturedPartners } from "@/components/home/featured-partners";
import { Testimonials } from "@/components/home/testimonials";
import { ShopHighlights } from "@/components/home/shop-highlights";
import { MainLayout } from "@/components/layout/main-layout";
import { TrendingEvents } from "@/components/home/trending-events";

export default function Home() {
  return (
    <MainLayout>
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20 md:space-y-28 py-16 md:py-24">
          <TrendingEvents />
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
