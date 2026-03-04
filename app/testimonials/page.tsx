import { PageHeader } from "@/components/page-header";
import { TestimonialsSection } from "@/components/testimonials-section";
import { CtaSection } from "@/components/cta-section";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogoSection } from "@/components/logo-section";

export default function TestimonialsPage() {
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
                    title="What Our Users Say"
                    description="Hear from societies and organizations that have transformed their management with Kaam."
                >
                    <div className="flex flex-col items-center w-full">
                        <div className="flex gap-4 justify-center mb-16">
                            <Link href="/signup">
                                <Button size="lg" className="bg-white px-6 text-slate-900 hover:bg-white/90">Get Started</Button>
                            </Link>
                        </div>
                        <div className="w-full relative z-10">
                            <LogoSection className="!bg-transparent !border-none !py-0" />
                        </div>
                    </div>
                </PageHeader>
                <div className="bg-zinc-900">
                    <TestimonialsSection />
                </div>
            </div>

            <CtaSection />
            <Footer />
        </>
    );
}
