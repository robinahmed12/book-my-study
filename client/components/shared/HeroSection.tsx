"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Star, Shield, Clock } from "lucide-react";

const STATS = [
  { value: "500+", label: "Study Rooms" },
  { value: "10k+", label: "Happy Bookers" },
  { value: "4.9★", label: "Average Rating" },
];

const TRUST_BADGES = [
  { icon: Star, text: "No booking fees" },
  { icon: Shield, text: "Secure payments" },
  { icon: Clock, text: "Instant confirmation" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary-500/5 via-background to-background pt-16 pb-24">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-500/5 rounded-full blur-3xl" />
      </div>

      <div className="section-container relative">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/5 text-sm font-medium text-primary-500 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-primary-500 animate-pulse" />
            Your perfect study space awaits
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight mb-6"
          >
            Book Study Rooms{" "}
            <span className="gradient-text">Without the Hassle</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-muted-foreground mb-8 leading-relaxed"
          >
            Browse premium library study rooms, check real-time availability, 
            and reserve your perfect space in seconds. No conflicts, no wait times.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center mb-12"
          >
            <Link
              href="/rooms"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-primary-500 text-white font-semibold hover:bg-primary-600 transition-all hover:shadow-lg hover:shadow-primary-500/25 hover:-translate-y-0.5"
            >
              Browse Rooms
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/rooms/add"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-border bg-background font-semibold hover:bg-muted transition-colors"
            >
              List Your Room
            </Link>
          </motion.div>

          {/* Trust badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-4 mb-12"
          >
            {TRUST_BADGES.map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-1.5 text-sm text-muted-foreground"
              >
                <Icon className="w-4 h-4 text-primary-500" />
                {text}
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="grid grid-cols-3 gap-8 p-6 rounded-2xl glass border"
          >
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-xs text-muted-foreground mt-1">{label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
