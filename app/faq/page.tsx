import { PageHeader } from "@/components/page-header";
import { FaqSection } from "@/components/faq-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function FaqPage() {
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

            <div className="bg-zinc-950 min-h-screen">
                <PageHeader
                    title="Frequently Asked Questions"
                    description="Find answers to the most common questions about using Kaam for your society or organization."
                >
                    <div className="flex gap-4 justify-center mb-16">
                        <Link href="/signup">
                            <Button size="lg" className="bg-white px-6 text-slate-900 hover:bg-white/90">Get Started</Button>
                        </Link>
                    </div>
                    <div className="w-full relative z-10">
                        <FaqSection className="!bg-transparent !border-none !py-0" />
                    </div>
                </PageHeader>
            </div>

            <CtaSection />
            <Footer />
        </>
    );
}
