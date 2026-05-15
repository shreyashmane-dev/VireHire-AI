"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, RefreshCw, ShieldOff, TerminalSquare } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-black text-white">
        <div className="min-h-screen overflow-hidden p-6 flex items-center justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(239,68,68,0.14),transparent_28%),radial-gradient(circle_at_bottom,rgba(168,85,247,0.12),transparent_34%)]" />

          <div className="relative z-10 w-full max-w-4xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/85">
            <div className="grid gap-0 lg:grid-cols-[1fr_1.1fr]">
              <section className="border-b border-white/10 p-8 lg:border-b-0 lg:border-r lg:p-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mb-6 inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10"
                >
                  <ShieldOff className="h-10 w-10 text-red-400" />
                </motion.div>

                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-red-300">
                  Global Exception
                </div>
                <h1 className="text-4xl font-bold tracking-tight">Core System Halted</h1>
                <p className="mt-5 text-base leading-7 text-zinc-400">
                  The root application shell hit a fatal error. We can attempt a clean re-render, or move you back to
                  the main entry point.
                </p>
              </section>

              <section className="p-8 lg:p-10">
                <div className="mb-4 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                  <TerminalSquare className="h-3.5 w-3.5" />
                  Fault Summary
                </div>
                <div className="space-y-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                    {error.digest ? `Trace ID: ${error.digest}` : "Trace ID unavailable."}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-300">
                    {error.message ? `Latest message: ${error.message}` : "The client did not expose an error message."}
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-zinc-400">
                    Recovery suggestion: retry first, then return to the home route if the fault repeats.
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <button
                    onClick={() => reset()}
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry App Shell
                  </button>
                  <Link
                    href="/"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
                  >
                    <Home className="h-4 w-4" />
                    Return Home
                  </Link>
                </div>
              </section>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
