import { LogoCloud } from "@/components/ui/logo-cloud-2";
import { cn } from "@/lib/utils";

export function LogoSection({ className }: { className?: string }) {
  return (
    <section className={cn("relative w-full bg-zinc-900 py-16 md:py-24 border-b border-zinc-700/30", className)}>
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <h2 className="mb-12 text-center font-normal text-4xl text-white tracking-tight md:text-5xl">
          Trusted by leading student societies and organizations
        </h2>

        <LogoCloud />
      </div>
    </section>
  );
}
