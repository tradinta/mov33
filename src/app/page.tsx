import { HeroSection } from "@/components/home/hero-section";
import { DiscoverSection } from "@/components/home/discover-section";
import { VipHighlights } from "@/components/home/vip-highlights";
import { FeaturedPartners } from "@/components/home/featured-partners";
import { Testimonials } from "@/components/home/testimonials";
import { ShopHighlights } from "@/components/home/shop-highlights";
import { AIRecommendations } from "@/components/home/ai-recommendations";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-20 md:space-y-28 py-16 md:py-24">
          <DiscoverSection />
          <VipHighlights />
          <FeaturedPartners />
          <Testimonials />
          <AIRecommendations />
          <ShopHighlights />
        </div>
      </div>
    </>
  );
}
