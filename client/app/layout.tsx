import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { Providers } from "@/providers/Providers";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "https://studynook.vercel.app"
  ),
  title: {
    default: "StudyNook | Library Study Room Booking",
    template: "%s | StudyNook",
  },
  description:
    "Book premium study rooms at your library. Browse, filter, and reserve quiet study spaces with StudyNook — the modern room booking platform for students and researchers.",
  keywords: [
    "study room booking",
    "library rooms",
    "quiet study space",
    "room reservation",
    "studynook",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studynook.vercel.app",
    siteName: "StudyNook",
    title: "StudyNook | Library Study Room Booking",
    description:
      "Book premium study rooms at your library. Modern, fast, and conflict-free room booking.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "StudyNook Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "StudyNook | Library Study Room Booking",
    description: "Book premium study rooms at your library.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans antialiased min-h-screen bg-background text-foreground`}
      >
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
