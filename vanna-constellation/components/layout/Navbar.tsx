"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/providers/ThemeProvider";
import Image from "next/image";

const navLinks = [
  { label: "How It Works", href: "#flow" },
  { label: "Features", href: "#calculator" },
  { label: "Ecosystem", href: "#constellation" },
  { label: "Dashboard", href: "#dashboard" },
];

function SunIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 pt-4"
      >
        <div
          className={`max-w-6xl mx-auto flex items-center justify-between rounded-full px-4 sm:px-6 transition-all duration-500 ${
            scrolled ? "py-2.5" : "py-3"
          }`}
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(30, 30, 35, 0.95)"
                : "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(20px)",
            border:
              theme === "dark"
                ? "1px solid rgba(255, 255, 255, 0.08)"
                : "1px solid rgba(0, 0, 0, 0.08)",
            boxShadow:
              theme === "dark"
                ? scrolled
                  ? "0 8px 32px rgba(0, 0, 0, 0.3)"
                  : "0 4px 20px rgba(0, 0, 0, 0.2)"
                : scrolled
                  ? "0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(0,0,0,0.04)"
                  : "0 4px 20px rgba(0, 0, 0, 0.06)",
          }}
        >
          {/* Logo */}
          <a href="#" className="flex items-center shrink-0">
            <Image
              src={
                theme === "dark"
                  ? "/icons/vanna-white.png"
                  : "/icons/vanna.png"
              }
              alt="Vanna"
              width={100}
              height={32}
              className="h-7 w-auto object-contain"
            />
          </a>

          {/* Desktop Nav Links — center */}
          <div className="hidden lg:flex items-center gap-1 mx-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`relative px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-200 ${
                  theme === "dark"
                    ? "text-white/70 hover:text-white hover:bg-white/[0.07]"
                    : "text-gray-600 hover:text-gray-900 hover:bg-black/[0.04]"
                }`}
              >
                {link.label}
              </a>
            ))}

            {/* Separator */}
            <div
              className={`w-px h-4 mx-2 ${
                theme === "dark" ? "bg-white/15" : "bg-black/10"
              }`}
            />

            {/* Community link after separator */}
            <a
              href="#cta"
              className={`px-4 py-2 text-[13px] font-medium rounded-full transition-all duration-200 ${
                theme === "dark"
                  ? "text-white/70 hover:text-white hover:bg-white/[0.07]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/[0.04]"
              }`}
            >
              Community
            </a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${
                theme === "dark"
                  ? "text-white/60 hover:text-white hover:bg-white/[0.08]"
                  : "text-gray-500 hover:text-gray-900 hover:bg-black/[0.05]"
              }`}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Launch App CTA */}
            <a
              href="#"
              className="hidden sm:inline-flex items-center px-5 py-2 rounded-full text-[13px] font-semibold text-white bg-vanna-gradient transition-all duration-200 hover:opacity-90 hover:shadow-lg"
              style={{
                boxShadow: "0 4px 15px rgba(112, 58, 230, 0.3)",
              }}
            >
              Launch App
            </a>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                theme === "dark"
                  ? "text-white/70 hover:text-white hover:bg-white/[0.08]"
                  : "text-gray-600 hover:text-gray-900 hover:bg-black/[0.05]"
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{
              backgroundColor:
                theme === "dark"
                  ? "rgba(17, 17, 17, 0.98)"
                  : "rgba(255, 255, 255, 0.98)",
            }}
          >
            <div className="flex flex-col items-center justify-center h-full gap-6">
              {[...navLinks, { label: "Community", href: "#cta" }].map(
                (link, i) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                    className={`text-xl font-semibold transition-colors ${
                      theme === "dark"
                        ? "text-white/80 hover:text-white"
                        : "text-gray-700 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </motion.a>
                ),
              )}
              <motion.a
                href="#"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-6 px-8 py-3 rounded-full text-base font-semibold text-white bg-vanna-gradient"
                onClick={() => setMobileMenuOpen(false)}
              >
                Launch App
              </motion.a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
