import Navbar from "@/components/layout/Navbar";
import HowItWorksSection from "@/components/sections/HowItWorksSection";
import ConstellationSection from "@/components/sections/ConstellationSection";
import SocialProofSection from "@/components/sections/SocialProofSection";
import CTASection from "@/components/sections/CTASection";
import Footer from "@/components/layout/Footer";
import HeroReactor from "@/components/sections/HeroReactor";

export default function Home() {
  return (
    <main className="min-h-screen" style={{ overflowX: "clip" }}>
      <Navbar />

      <HeroReactor />
      <HowItWorksSection />
      <ConstellationSection />
      <SocialProofSection />
      <CTASection />
      <Footer />
    </main>
  );
}
