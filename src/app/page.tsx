import { Navbar } from "@/components/landing/navbar";
import { Hero } from "@/components/landing/hero";
import { TrustBar } from "@/components/landing/trust-bar";
import { FeatureGrid } from "@/components/landing/feature-grid";
import { HowItWorks } from "@/components/landing/how-it-works";
import { ArchitectureSection } from "@/components/landing/architecture-section";
import { ScreenshotsSection } from "@/components/landing/screenshots-section";
import { ShopperStatesMarquee } from "@/components/landing/shopper-states-marquee";
import { TestimonialsSection } from "@/components/landing/testimonials-section";
import { FaqSection } from "@/components/landing/faq-section";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background">
      <Navbar />
      <main>
        <Hero />
        <TrustBar />
        <FeatureGrid />
        <HowItWorks />
        <ArchitectureSection />
        <ScreenshotsSection />
        <ShopperStatesMarquee />
        <TestimonialsSection />
        <FaqSection />
        <FinalCta />
      </main>
      <Footer />
    </div>
  );
}
