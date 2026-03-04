import { PageHeader } from "@/components/page-header";
import { FeaturesSection } from "@/components/features-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";

export default function FeaturesPage() {
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

            <div className="bg-zinc-950 min-h-screen pb-24">
                <PageHeader
                    title="Powerful Features"
                    description="Discover all the tools Kaam provides to make multi-society management effortless."
                />
                <FeaturesSection />
            </div>

            <CtaSection />
            <Footer />
        </>
    );
}
