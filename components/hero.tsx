"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { SiteHeader } from "@/components/site-header"

export function Hero() {

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Dynamic Premium Background */}
      <div className="absolute inset-0 bg-zinc-950 overflow-hidden">
        {/* Animated glowing orbs */}
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[100px] animate-slow-pulse" />
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[60%] rounded-full bg-orange-600/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[40%] h-[40%] rounded-full bg-amber-400/5 blur-[100px] animate-slow-pulse" style={{ animationDelay: '2s' }} />

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Navigation */}
        <SiteHeader />

        {/* Hero Content - Positioned in upper portion */}
        <div className="flex flex-1 flex-col items-center px-6 pt-16 text-center md:pt-24">
          <h1 className="max-w-3xl text-balance text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl">
            {"Manage Societies & Teams with Ease".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ filter: "blur(10px)", opacity: 0 }}
                whileInView={{ filter: "blur(0px)", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>

          <p className="mt-6 max-w-xl text-balance text-center text-sm leading-relaxed text-white/70 md:text-base">
            The ultimate multi-society task management platform. Assign tasks, track progress, and manage teams all in one place.
          </p>

          {/* CTAs - Two buttons side by side */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-white px-6 text-slate-900 hover:bg-white/90"
              >
                Get Started
              </Button>
            </Link>
            <Button
              variant="outline"
              size="lg"
              className="border-white/30 bg-transparent px-6 text-white hover:bg-white/10 hover:text-white"
            >
              Learn More
            </Button>
          </div>
        </div>

        {/* Scroll Indicator - At bottom */}

      </div>
    </section>
  )
}
