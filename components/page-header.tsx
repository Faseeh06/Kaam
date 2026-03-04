import { SiteHeader } from "@/components/site-header";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description: string;
    children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <section className="relative min-h-screen w-full bg-zinc-950">
            {/* Dynamic Premium Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                {/* Animated glowing orbs */}
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[100px] animate-slow-pulse" />
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-400/5 blur-[100px] animate-slow-pulse" style={{ animationDelay: '2s' }} />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 flex h-full flex-col w-full mx-auto pb-16">
                <SiteHeader />

                <div className="flex flex-col items-center px-4 md:px-6 pt-16 md:pt-24 w-full">
                    <div className="text-center max-w-4xl mx-auto">
                        <h1 className="text-balance text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl">
                            {title}
                        </h1>
                        <p className="mt-6 text-balance text-center text-sm leading-relaxed text-white/70 md:text-base max-w-2xl mx-auto">
                            {description}
                        </p>
                    </div>
                    {children && (
                        <div className="mt-16 w-full flex flex-col items-center">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
