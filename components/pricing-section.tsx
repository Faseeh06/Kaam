"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PricingPlan {
  id: string;
  name: string;
  priceMonthly: number | string;
  priceYearly: number | string;
  description: string;
  features: string[];
  cta: string;
  popular?: boolean;
  type: "subscription" | "custom";
}

const plans: PricingPlan[] = [
  {
    id: "basic",
    name: "Free Forever",
    priceMonthly: 0,
    priceYearly: 0,
    description:
      "Full-featured task management for growing societies and student teams.",
    features: [
      "Up to 200+ members",
      "Unlimited sub-teams",
      "Role-based access control",
      "Attendance tracking",
      "Real-time notifications",
      "Priority email support",
    ],
    cta: "Start Free",
    type: "subscription",
  },
];

export function PricingSection({ className }: { className?: string }) {
  return (
    <section
      id="pricing"
      className={cn("w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30", className)}
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-16 flex flex-col items-center text-center gap-4">
          <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
            <div className="w-2.5 h-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">Pricing</span>
          </div>
          <h2 className="text-balance text-4xl md:text-5xl tracking-tight leading-tight font-normal text-white">
            <span className="block">
              {"Simple, Transparent pricing".split(" ").map((word, i) => (
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
            </span>
            <span className="block text-zinc-500 text-2xl md:text-3xl mt-4">
              {"Always free for small teams".split(" ").map((word, i) => (
                <motion.span
                  key={i + 3}
                  initial={{ filter: "blur(10px)", opacity: 0 }}
                  whileInView={{ filter: "blur(0px)", opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (i + 3) * 0.05 }}
                  className="inline-block mr-[0.25em]"
                >
                  {word}
                </motion.span>
              ))}
            </span>
          </h2>
        </div>

        {/* Plan Container */}
        <div className="flex justify-center w-full">
          {/* Pricing Card */}
          <div className="max-w-md w-full">
            {plans.map((plan) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{
                  scale: 1.02,
                }}
                className={cn(
                  "relative flex flex-col gap-6 p-8 transition-all duration-300 bg-zinc-800/50 border border-zinc-700/50 shadow-2xl"
                )}
              >
                {/* Card Head */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-normal text-white">
                      {plan.name}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <h3 className="text-5xl font-normal text-white tracking-tighter">
                      $0
                    </h3>
                    <span className="text-sm text-zinc-500">/forever</span>
                  </div>

                  <p className="text-balance text-sm leading-relaxed text-zinc-400 min-h-[40px]">
                    {plan.description}
                  </p>
                </div>

                {/* CTA Button */}
                <button
                  className={cn(
                    "w-full py-4 px-4 text-sm font-medium transition-all duration-200 cursor-pointer bg-white text-zinc-900 hover:bg-zinc-200"
                  )}
                >
                  {plan.cta}
                </button>

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-[1px] bg-zinc-700" />
                  <span className="text-xs text-zinc-500 shrink-0">
                    What's Included
                  </span>
                  <div className="flex-1 h-[1px] bg-zinc-700" />
                </div>

                {/* Features List */}
                <ul className="flex flex-col gap-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-3 group">
                      <CheckCircle2 className="w-5 h-5 text-amber-500 shrink-0" />
                      <span className="text-base text-zinc-400 group-hover:text-zinc-300 transition-colors">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
