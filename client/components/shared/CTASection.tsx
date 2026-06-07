"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-20">
      <div className="section-container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary-500 via-primary-600 to-secondary p-12 text-center text-white"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-2xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-white/20 mb-6">
              <BookOpen className="w-7 h-7 text-white" />
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
              Ready to find your perfect study space?
            </h2>
            <p className="text-lg text-white/80 mb-8 max-w-xl mx-auto">
              Join thousands of students already using StudyNook. Browse rooms, book instantly, and focus on what matters — your studies.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/rooms"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white text-primary-500 font-semibold hover:bg-white/90 transition-colors"
              >
                Browse Rooms Now
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-white/10 text-white font-semibold border border-white/20 hover:bg-white/20 transition-colors"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
