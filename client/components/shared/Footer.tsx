import Link from "next/link";
import { BookOpen, Github, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-bold">
                Study<span className="text-primary-500">Nook</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-xs">
              The modern library room booking platform. Reserve study spaces
              instantly, manage your bookings with ease.
            </p>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Platform</h4>
            <ul className="space-y-2">
              {[
                { href: "/rooms", label: "Browse Rooms" },
                { href: "/rooms/add", label: "List Your Room" },
                { href: "/dashboard/my-bookings", label: "My Bookings" },
                { href: "/auth/register", label: "Get Started" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-sm font-semibold mb-3">Connect</h4>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "#", label: "GitHub" },
                { icon: Twitter, href: "#", label: "Twitter" },
                { icon: Mail, href: "mailto:hello@studynook.app", label: "Email" },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary-500 transition-colors"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} StudyNook. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["Privacy", "Terms", "Support"].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
