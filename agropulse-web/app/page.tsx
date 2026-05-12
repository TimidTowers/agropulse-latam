import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/marketing/Hero";
import { CountryMarquee } from "@/components/marketing/CountryMarquee";
import { Stats } from "@/components/marketing/Stats";
import { FeatureGrid } from "@/components/marketing/FeatureGrid";
import { HowItWorks } from "@/components/marketing/HowItWorks";
import { PlansSummary } from "@/components/marketing/PlansSummary";
import { Testimonials } from "@/components/marketing/Testimonials";
import { CTA } from "@/components/marketing/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <CountryMarquee />
        <Stats />
        <FeatureGrid />
        <HowItWorks />
        <PlansSummary />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </>
  );
}
