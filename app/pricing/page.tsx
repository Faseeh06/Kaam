import { SiteHeader } from "@/components/site-header";
import { PricingSection } from "@/components/pricing-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function PricingPage() {
    return (
        <>
            <div className="pointer-events-none fixed inset-0 z-50">
                <div className="mx-auto h-full max-w-7xl">
                    <div className="relative h-full">
                        <div className="absolute left-0 top-0 h-full w-px bg-zinc-700/30" />
                        <div className="absolute right-0 top-0 h-full w-px bg-zinc-700/30" />
                    </div>
                </div>
            </div>

            <div className="bg-zinc-950 min-h-screen pt-4 pb-24">
                <SiteHeader />
                <div className="pt-24 pb-12 text-center px-6">
                    <h1 className="text-4xl md:text-5xl font-medium tracking-tight text-white mb-6">Simple Pricing</h1>
                    <p className="text-white/70 max-w-2xl mx-auto">Choose a plan that matches your organization's ambitions. Includes a free plan to get started.</p>
                </div>
                <PricingSection />
            </div>

            <CtaSection />
            <Footer />
        </>
    );
}
