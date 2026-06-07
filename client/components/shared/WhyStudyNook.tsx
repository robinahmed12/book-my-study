"use client";

import { motion } from "framer-motion";
import {
  Zap,
  Shield,
  BarChart3,
  Clock,
  Users,
  CalendarCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant Booking",
    description:
      "Reserve your room in seconds. No waiting for approval — real-time availability, instant confirmation.",
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    icon: Shield,
    title: "Conflict-Free",
    description:
      "Our smart conflict detection prevents double bookings. Your reservation is guaranteed once confirmed.",
    color: "text-green-500",
    bg: "bg-green-500/10",
  },
  {
    icon: Clock,
    title: "Flexible Hours",
    description:
      "Book by the hour from 7AM to 10PM, 7 days a week. Scale from 1 hour to a full day.",
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    icon: Users,
    title: "Rooms for All",
    description:
      "Solo study pods to group rooms for 20+. Filter by capacity to find your perfect fit.",
    color: "text-purple-500",
    bg: "bg-purple-500/10",
  },
  {
    icon: CalendarCheck,
    title: "Easy Management",
    description:
      "View, modify, or cancel bookings from your dashboard. Full booking history at your fingertips.",
    color: "text-primary-500",
    bg: "bg-primary-500/10",
  },
  {
    icon: BarChart3,
    title: "List & Earn",
    description:
      "Have a study room? List it on StudyNook and start earning. Manage your listings easily.",
    color: "text-cyan-500",
    bg: "bg-cyan-500/10",
  },
];

export function WhyStudyNook() {
  return (
    <section className="py-20">
      <div className="section-container">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-sm font-medium text-primary-500 mb-2 uppercase tracking-wider">
            Why Choose Us
          </p>
          <h2 className="text-3xl font-bold mb-4">
            Everything you need in a booking platform
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for students, researchers, and anyone who needs a focused
            environment to do great work.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4, delay: index * 0.08 }}
              className="p-6 rounded-2xl border border-border bg-card hover:shadow-md transition-shadow"
            >
              <div
                className={`w-11 h-11 rounded-xl ${feature.bg} flex items-center justify-center mb-4`}
              >
                <feature.icon className={`w-5 h-5 ${feature.color}`} />
              </div>
              <h3 className="font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
