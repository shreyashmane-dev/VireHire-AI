"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Search, ShieldAlert, Zap } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0">
        <div className="absolute left-[10%] top-[18%] h-64 w-64 rounded-full bg-indigo-600/20 blur-[110px] sm:h-80 sm:w-80" />
        <div className="absolute bottom-[12%] right-[8%] h-64 w-64 rounded-full bg-fuchsia-600/20 blur-[110px] sm:h-80 sm:w-80" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.04),transparent_35%)]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <div className="text-center">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-300 sm:text-sm"
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8 }}
          >
            <Zap className="h-4 w-4 fill-indigo-400" />
            <span>New: AI Scam DNA Matching Live</span>
          </motion.div>

          <motion.h1
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-5xl text-4xl font-semibold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.15, duration: 0.8 }}
          >
            Detect Fake Jobs
            <br />
            <span className="bg-gradient-to-r from-indigo-400 via-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
              Before They Scam You.
            </span>
          </motion.h1>

          <motion.p
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto mt-6 max-w-3xl text-base leading-7 text-zinc-400 sm:text-lg md:text-xl"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            The enterprise-grade AI recruitment threat intelligence platform that spots
            phishing campaigns, fake recruiters, and payment traps before they reach you.
          </motion.p>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="mt-10 flex flex-col items-stretch justify-center gap-3 sm:flex-row"
            initial={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.45, duration: 0.8 }}
          >
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-semibold text-black transition hover:bg-zinc-200"
              href="/signup"
            >
              <Search className="h-5 w-5" />
              Start Free Protection
            </Link>
            <Link
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-zinc-900/90 px-6 py-3 text-base font-semibold text-white transition hover:bg-zinc-800"
              href="/login"
            >
              <ShieldAlert className="h-5 w-5" />
              Sign in
            </Link>
          </motion.div>
        </div>

        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="mt-14 sm:mt-20"
          initial={{ opacity: 0, scale: 0.94, y: 40 }}
          transition={{ delay: 0.6, duration: 0.9 }}
        >
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/80 shadow-2xl shadow-indigo-950/25">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(168,85,247,0.15),transparent_28%)]" />
            <div className="relative p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="text-xs uppercase tracking-[0.26em] text-zinc-500">
                    Secure intelligence terminal
                  </div>
                  <div className="mt-2 text-lg font-medium text-white sm:text-xl">
                    Live recruitment threat analysis
                  </div>
                </div>
                <div className="rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
                  Critical risk detected
                </div>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-4">
                  <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-4">
                    <div className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
                      Flagged phrase
                    </div>
                    <p className="mt-2 text-sm leading-7 text-zinc-200">
                      &quot;Please deposit Rs 5000 as a refundable security amount for the
                      company laptop before onboarding.&quot;
                    </p>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Risk score
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-red-400">92/100</div>
                    </div>
                    <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                      <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                        Manipulation level
                      </div>
                      <div className="mt-3 text-3xl font-semibold text-orange-400">High</div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 sm:p-5">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    AI reasoning
                  </div>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-zinc-300">
                    <li>Urgency language detected: &quot;Only 3 slots left&quot;.</li>
                    <li>Advance payment request linked to onboarding bait.</li>
                    <li>Outreach pattern matches prior Telegram-based scam clusters.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
