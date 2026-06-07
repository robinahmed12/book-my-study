"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "Sarah Chen",
    role: "PhD Candidate, MIT",
    avatar: "SC",
    rating: 5,
    text: "StudyNook completely changed how I plan my research sessions. I used to waste 20 minutes at the library looking for an available room. Now I book the night before and walk straight in.",
    color: "bg-purple-500",
  },
  {
    name: "Marcus Williams",
    role: "Undergraduate, Stanford",
    avatar: "MW",
    rating: 5,
    text: "The conflict detection is a game-changer. I booked a room for my study group for finals week and didn't have to worry about someone else showing up. Flawless experience.",
    color: "bg-primary-500",
  },
  {
    name: "Priya Nair",
    role: "Graduate Student, UCL",
    avatar: "PN",
    rating: 5,
    text: "I listed two study pods I manage and started getting bookings within the first day. The dashboard makes it incredibly easy to track everything. Love this platform.",
    color: "bg-cyan-500",
  },
  {
    name: "James Park",
    role: "Researcher, Cambridge",
    avatar: "JP",
    rating: 5,
    text: "Clean UI, fast bookings, and zero double-booking issues in 6 months of use. Exactly what university libraries needed. Highly recommended to anyone in academia.",
    color: "bg-green-500",
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium text-primary-500 mb-2 uppercase tracking-wider">
            Testimonials
          </p>
          <h2 className="text-3xl font-bold mb-4">
            Trusted by thousands of students
          </h2>
          <p className="text-muted-foreground">
            See what our community of learners and room owners have to say.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TESTIMONIALS.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="p-6 rounded-2xl bg-card border border-border hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-5 right-5 w-8 h-8 text-muted/30" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                &ldquo;{t.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-full ${t.color} flex items-center justify-center text-white text-xs font-bold flex-shrink-0`}
                >
                  {t.avatar}
                </div>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
