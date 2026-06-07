"use client";

import { motion } from "framer-motion";
import { Search, CalendarDays, CheckCircle, BookOpen } from "lucide-react";

const STEPS = [
  {
    icon: Search,
    step: "01",
    title: "Browse & Search",
    description:
      "Explore our curated collection of study rooms. Filter by capacity, amenities, price, and floor to find your ideal space.",
    color: "text-primary-500",
    bg: "bg-primary-500",
  },
  {
    icon: CalendarDays,
    step: "02",
    title: "Pick Your Slot",
    description:
      "Choose your date and time. Our live availability calendar shows exactly what's free — no guessing, no surprises.",
    color: "text-secondary",
    bg: "bg-secondary",
  },
  {
    icon: CheckCircle,
    step: "03",
    title: "Instant Confirmation",
    description:
      "Hit 'Book Now' and you're done. Receive immediate confirmation and a summary of your booking details.",
    color: "text-accent",
    bg: "bg-accent",
  },
  {
    icon: BookOpen,
    step: "04",
    title: "Study in Peace",
    description:
      "Show up at your reserved time and enjoy your dedicated study space. Manage or cancel anytime from your dashboard.",
    color: "text-green-500",
    bg: "bg-green-500",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium text-primary-500 mb-2 uppercase tracking-wider">
            Simple Process
          </p>
          <h2 className="text-3xl font-bold mb-4">Book a room in 4 steps</h2>
          <p className="text-muted-foreground">
            From discovery to your first study session in under 2 minutes.
          </p>
        </div>

        <div className="relative">
          {/* Connector line (desktop only) */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary-500 via-secondary via-accent to-green-500 opacity-20" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {STEPS.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.12 }}
                className="relative text-center"
              >
                {/* Icon circle */}
                <div className="relative inline-flex mb-5">
                  <div
                    className={`w-16 h-16 rounded-2xl ${step.bg}/10 border-2 border-dashed border-current ${step.color} flex items-center justify-center`}
                  >
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>
                  <div
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full ${step.bg} text-white text-xs font-bold flex items-center justify-center`}
                  >
                    {index + 1}
                  </div>
                </div>

                <h3 className="font-semibold text-base mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
