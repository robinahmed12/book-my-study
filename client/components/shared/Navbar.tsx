"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Sun,
  Moon,
  Menu,
  X,
  User,
  LogOut,
  PlusCircle,
  CalendarDays,
  LayoutDashboard,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/rooms", label: "Browse Rooms" },
];

const AUTHENTICATED_LINKS = [
  { href: "/rooms/add", label: "List a Room", icon: PlusCircle },
  { href: "/dashboard/my-listings", label: "My Listings", icon: LayoutDashboard },
  { href: "/dashboard/my-bookings", label: "My Bookings", icon: CalendarDays },
];

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, isAuthenticated, logout } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setIsMobileOpen(false);
    setIsUserMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => pathname === href;

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled
          ? "glass shadow-sm"
          : "bg-transparent"
      }`}
    >
      <nav className="section-container">
        <div className="flex h-16 items-center justify-between">
          {/* ── Logo ─────────────────────────────────────── */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">
              Study<span className="text-primary-500">Nook</span>
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────── */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(link.href)
                    ? "bg-primary-500/10 text-primary-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/rooms/add"
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive("/rooms/add")
                    ? "bg-primary-500/10 text-primary-500"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                List a Room
              </Link>
            )}
          </div>

          {/* ── Right side actions ────────────────────────── */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="w-9 h-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle theme"
            >
              <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </button>

            {isAuthenticated && user ? (
              /* User menu */
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 rounded-lg px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <div className="w-7 h-7 rounded-full overflow-hidden bg-primary-500/10 flex items-center justify-center border border-border">
                    {user.photoURL ? (
                      <Image
                        src={user.photoURL}
                        alt={user.name}
                        width={28}
                        height={28}
                        className="object-cover"
                      />
                    ) : (
                      <span className="text-xs font-semibold text-primary-500">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-medium truncate max-w-[100px]">
                    {user.name.split(" ")[0]}
                  </span>
                  <ChevronDown className="h-3 w-3 text-muted-foreground" />
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 glass rounded-xl border shadow-lg overflow-hidden"
                    >
                      <div className="p-3 border-b border-border/50">
                        <p className="text-sm font-medium truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        {AUTHENTICATED_LINKS.map(({ href, label, icon: Icon }) => (
                          <Link
                            key={href}
                            href={href}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm hover:bg-muted transition-colors"
                          >
                            <Icon className="w-4 h-4 text-muted-foreground" />
                            {label}
                          </Link>
                        ))}
                        <button
                          onClick={logout}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-destructive hover:bg-destructive/10 transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign out
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              /* Auth buttons */
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/auth/login"
                  className="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  Sign in
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 rounded-lg text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileOpen(!isMobileOpen)}
              className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center hover:bg-muted transition-colors"
            >
              {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ───────────────────────────────── */}
        <AnimatePresence>
          {isMobileOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-border/50 pb-4 overflow-hidden"
            >
              <div className="pt-4 space-y-1">
                {NAV_LINKS.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive(link.href)
                        ? "bg-primary-500/10 text-primary-500"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted"
                    }`}
                  >
                    {link.label}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    {AUTHENTICATED_LINKS.map(({ href, label, icon: Icon }) => (
                      <Link
                        key={href}
                        href={href}
                        className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted"
                      >
                        <Icon className="w-4 h-4" />
                        {label}
                      </Link>
                    ))}
                    <button
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-destructive hover:bg-destructive/10"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </>
                ) : (
                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      href="/auth/login"
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-center border border-border hover:bg-muted"
                    >
                      Sign in
                    </Link>
                    <Link
                      href="/auth/register"
                      className="px-3 py-2.5 rounded-lg text-sm font-medium text-center bg-primary-500 text-white"
                    >
                      Get Started
                    </Link>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
