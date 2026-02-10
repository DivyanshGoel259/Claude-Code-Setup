import Navbar from "@/components/layout/Navbar";
import CalculatorSection from "@/components/sections/CalculatorSection";
import FlowSection from "@/components/sections/FlowSection";
import DashboardSection from "@/components/sections/DashboardSection";
import ConstellationSection from "@/components/sections/ConstellationSection";
import StrategySection from "@/components/sections/StrategySection";
import YieldVaultSection from "@/components/sections/YieldVaultSection";
import CreditCardSection from "@/components/sections/CreditCardSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import HeroSectionV2 from "@/components/sections/HeroSectionV2";

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden">
      <Navbar />
      <HeroSectionV2 />
      <CalculatorSection />
      <FlowSection />
      <DashboardSection />
      <ConstellationSection />
      <StrategySection />
      <YieldVaultSection />
      <CreditCardSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
}
