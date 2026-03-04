import { PageHeader } from "@/components/page-header";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AboutPage() {
    return (
        <>
            {/* Vertical margin lines */}
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
                    title="About Kaam"
                    description="Learn about the problems we are solving and the solutions we provide for multi-society management."
                >
                    <div className="flex gap-4 justify-center">
                        <Link href="/signup">
                            <Button size="lg" className="bg-white px-6 text-slate-900 hover:bg-white/90">Get Started</Button>
                        </Link>
                    </div>
                </PageHeader>
                <div className="border-t border-zinc-700/30">
                    <ProblemSection />
                </div>
                <SolutionSection />
            </div>

            <CtaSection />
            <Footer />
        </>
    );
}
