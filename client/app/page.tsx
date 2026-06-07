import type { Metadata } from "next";
import { HeroSection } from "@/components/shared/HeroSection";
import { LatestRoomsSection } from "@/components/rooms/LatestRoomsSection";
import { WhyStudyNook } from "@/components/shared/WhyStudyNook";
import { HowItWorks } from "@/components/shared/HowItWorks";
import { TestimonialsSection } from "@/components/shared/TestimonialsSection";
import { CTASection } from "@/components/shared/CTASection";

export const metadata: Metadata = {
  title: "StudyNook | Library Study Room Booking",
  description:
    "Find and book your perfect study space. Browse hundreds of library rooms, check availability, and reserve instantly.",
};

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <LatestRoomsSection />
      <WhyStudyNook />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
