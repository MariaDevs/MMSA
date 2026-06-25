import HeroSection from "@/components/home/HeroSection";
import SearchBar from "@/components/home/SearchBar";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import DealerCTA from "@/components/home/DealerCTA";
import PackagesSection from "@/components/home/PackagesSection";
import TrustBadges from "@/components/home/TrustBadges";
import HowItWorks from "@/components/home/HowItWorks";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <SearchBar />
      <TrustBadges />
      <FeaturedVehicles />
      <HowItWorks />
      <PackagesSection />
      <DealerCTA />
    </>
  );
}
