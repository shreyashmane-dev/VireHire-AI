"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Shield, X } from "lucide-react";
import { useState } from "react";

const navigationLinks = [
  { href: "/features", label: "Features" },
  { href: "/threat-feed", label: "Threat Feed" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-white/10 bg-black/65 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link className="flex items-center gap-2" href="/">
            <Shield className="h-8 w-8 text-indigo-500" />
            <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-lg font-semibold text-transparent sm:text-xl">
              VeriHire AI
            </span>
          </Link>

          <div className="hidden md:flex md:items-center md:gap-8">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                className="text-sm text-zinc-400 transition-colors hover:text-white"
                href={item.href}
              >
                {item.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <Link
              className="text-sm text-zinc-400 transition-colors hover:text-white"
              href="/login"
            >
              Login
            </Link>
            <Link
              className="rounded-full bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 neon-glow"
              href="/signup"
            >
              Get Started
            </Link>
          </div>

          <button
            aria-expanded={isOpen}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            className="inline-flex rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-300 transition hover:text-white md:hidden"
            onClick={() => setIsOpen((open) => !open)}
            type="button"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {isOpen ? (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="border-t border-white/10 bg-zinc-950/95 md:hidden"
          initial={{ opacity: 0, y: -12 }}
        >
          <div className="space-y-2 px-4 py-4 sm:px-6">
            {navigationLinks.map((item) => (
              <Link
                key={item.href}
                className="block rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
                href={item.href}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}

            <div className="my-2 border-t border-white/10" />

            <Link
              className="block rounded-2xl px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/[0.04] hover:text-white"
              href="/login"
              onClick={closeMenu}
            >
              Login
            </Link>
            <Link
              className="block rounded-2xl bg-indigo-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-indigo-500"
              href="/signup"
              onClick={closeMenu}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      ) : null}
    </nav>
  );
}
