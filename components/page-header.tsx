import { SiteHeader } from "@/components/site-header";
import { ReactNode } from "react";

interface PageHeaderProps {
    title: string;
    description: string;
    children?: ReactNode;
}

export function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <div className="relative w-full overflow-hidden bg-zinc-950 min-h-[80vh] flex flex-col items-center justify-start pt-4">
            {/* Dynamic Premium Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {/* Animated glowing orbs */}
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[100px] animate-slow-pulse" />
                <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px]" />
                <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-400/5 blur-[100px] animate-slow-pulse" style={{ animationDelay: '2s' }} />

                {/* Subtle grid pattern overlay */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
            </div>

            <div className="relative z-10 flex flex-col w-full flex-1">
                <SiteHeader />

                <div className="flex-1 flex flex-col items-center justify-center text-center px-6 mt-16 md:mt-24 mb-24">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight text-white mb-6 uppercase tracking-wider">{title}</h1>
                    <p className="text-white/70 max-w-2xl mx-auto md:text-lg leading-relaxed">{description}</p>
                    {children && (
                        <div className="mt-8">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
