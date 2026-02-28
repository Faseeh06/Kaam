"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    id: "1",
    question: "How does Kaam differ from WhatsApp or Slack?",
    answer:
      "WhatsApp and Slack are great for chatting, but terrible for tracking tasks. Kaam is designed specifically for student societies and organizations, combining structured sub-teams, role-based access, Kanban task boards, and attendance tracking into a single unified platform.",
  },
  {
    id: "2",
    question: "Can members belong to multiple teams?",
    answer:
      "Yes! Our structure supports many-to-many relationships. A member can be part of the HR team and the Media team simultaneously, allowing them to see tasks for both departments on their personalized dashboard.",
  },
  {
    id: "3",
    question: "How does the invite and approval system work?",
    answer:
      "Society admins can generate invite links. When a user clicks the link, their request enters a pending state until approved by the society president or director, ensuring only authorized students gain access to internal data.",
  },
  {
    id: "4",
    question: "Does Kaam work offline?",
    answer:
      "Yes, Kaam is built as a Progressive Web App (PWA). You can install it on your mobile device or desktop. It provides offline support for viewing task boards and basic views, automatically syncing when your connection is restored.",
  },
  {
    id: "5",
    question: "Can we track attendance for meetings?",
    answer:
      "Absolutely. Admins can create events and take attendance for each member. The platform computes real-time attendance percentages, which are visible on the member's profile dashboard.",
  },
];

export function FaqSection() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleQuestion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section
      id="faq"
      className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Column - Header */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
              <div className="w-2.5 h-2.5 bg-amber-500" />
              <span className="text-sm font-medium text-zinc-400 tracking-wide">
                FAQ
              </span>
            </div>

            <h2 className="text-balance text-4xl md:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.1]">
              {"Common Questions".split(" ").map((word, i) => (
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
            </h2>

            <p className="text-balance text-base md:text-lg text-zinc-400 leading-relaxed max-w-md">
              Get quick answers about Kaam's task management platform and
              how we unify your organization's workflow. Can't
              find what you're looking for? Reach out below.
            </p>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="flex flex-col">
            {faqs.map((faq, index) => (
              <div
                key={faq.id}
                className={cn(
                  "border-t border-zinc-700/30",
                  index === faqs.length - 1 && "border-b"
                )}
              >
                <button
                  onClick={() => toggleQuestion(faq.id)}
                  className="w-full py-6 flex items-center justify-between gap-4 text-left group"
                >
                  <span className="text-lg md:text-xl font-normal text-white group-hover:text-zinc-300 transition-colors">
                    {faq.question}
                  </span>
                  <motion.div
                    animate={{ rotate: openId === faq.id ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="flex-shrink-0"
                  >
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  </motion.div>
                </button>

                <AnimatePresence>
                  {openId === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="pb-6 pr-12">
                        <p className="text-base leading-relaxed text-zinc-400">
                          {faq.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
