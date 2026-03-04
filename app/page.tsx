import { Hero } from "@/components/hero";
import { LogoSection } from "@/components/logo-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { FeaturesSection } from "@/components/features-section";
import { TestimonialsSection } from "@/components/testimonials-section";
import { PricingSection } from "@/components/pricing-section";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <LogoSection />
        <ProblemSection />
        <SolutionSection />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <FaqSection />
        <CtaSection />
      </main>

      <Footer />
    </>
  );
}
