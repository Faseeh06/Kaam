"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    id: 1,
    quote:
      "Kaam transformed how we run our events. We used to struggle with tracking attendance and tasks across different teams, but now everything is centralized and visible to all directors.",
    author: "Sarah Chen",
    role: "PRESIDENT AT DEBATE SOCIETY",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=6B5B95",
  },
  {
    id: 2,
    quote:
      "Before Kaam, we were drowning in WhatsApp groups. The Kanban boards and role-based access allowed our media and HR teams to finally work without stepping on each other's toes.",
    author: "Marcus Rodriguez",
    role: "VP OF COMMUNICATIONS AT ROBOTICS CLUB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Marcus&backgroundColor=88498F",
  },
  {
    id: 3,
    quote:
      "The real-time notification system ensures that no submission is ever missed. Now, our design team hits their deadlines consistently and approvals are a breeze.",
    author: "Emily Thompson",
    role: "HEAD OF DESIGN AT CREATIVE MINDS",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily&backgroundColor=C55A7B",
  },
  {
    id: 4,
    quote:
      "Implementing Kaam was the easiest administrative upgrade we've ever done. The PWA offline support is perfect for campus events where Wi-Fi drops out frequently.",
    author: "David Kim",
    role: "EVENT COORDINATOR AT ESPORTS CLUB",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=4A5899",
  },
  {
    id: 5,
    quote:
      "The role-based access control is a game changer for large student bodies. Inviting members and assigning them specific sub-team access has never been so seamless.",
    author: "Jennifer Walsh",
    role: "HR DIRECTOR AT MODEL UN",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jennifer&backgroundColor=6B7280",
  },
  {
    id: 6,
    quote:
      "Passing down knowledge used to be our nightmare. Kaam preserves the history of our task records and planning files, making committee transitions incredibly straightforward.",
    author: "Robert Martinez",
    role: "GENERAL SECRETARY AT FILM CULT",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert&backgroundColor=7C3AED",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? testimonials.length - 1 : prev - 1
    );
  };

  return (
    <section className="w-full bg-zinc-900 py-24 md:py-32 border-b border-zinc-700/30">
      <div className="mx-auto max-w-7xl px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col gap-6 mb-16">
          <div className="flex items-center gap-3 px-4 py-2 border border-zinc-700 w-fit">
            <div className="w-2.5 h-2.5 bg-amber-500" />
            <span className="text-sm font-medium text-zinc-400 tracking-wide">
              Testimonials
            </span>
          </div>
          <div className="flex items-center justify-between gap-8">
            <h2 className="text-balance text-4xl md:text-5xl font-normal text-white">
              {"What Society Leaders Say About Kaam.".split(" ").map((word, i) => (
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
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={prevTestimonial}
                className="p-3 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextTestimonial}
                className="p-3 border border-zinc-700 bg-transparent text-white hover:bg-zinc-800 transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          {testimonials
            .slice(currentIndex, currentIndex + 3)
            .concat(
              testimonials.slice(
                0,
                Math.max(0, currentIndex + 3 - testimonials.length)
              )
            )
            .map((testimonial, index) => (
              <div
                key={testimonial.id}
                className={`p-8 border-zinc-700/30 ${index !== 2 ? "md:border-r border-b md:border-b-0" : ""
                  }`}
              >
                {/* Quote Icon */}
                <div className="text-amber-500 text-4xl font-bold mb-6">"</div>

                {/* Testimonial Text */}
                <p className="text-white text-base leading-relaxed mb-8 min-h-[200px]">
                  {testimonial.quote}
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.avatar || "/placeholder.svg"}
                    alt={testimonial.author}
                    className="w-12 h-12 object-cover"
                  />
                  <div>
                    <div className="text-white font-medium text-sm">
                      {testimonial.author}
                    </div>
                    <div className="text-zinc-500 text-xs uppercase tracking-wider">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </section>
  );
}
