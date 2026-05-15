"use client";

import { useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { AlertTriangle, Home, RefreshCw, ShieldAlert, TerminalSquare } from "lucide-react";

export default function Error({
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
    <div className="min-h-screen bg-black text-white flex items-center justify-center overflow-hidden p-6">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(99,102,241,0.14),transparent_35%)]" />

      <div className="relative z-10 w-full max-w-3xl overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/80 shadow-2xl">
        <div className="border-b border-white/10 bg-white/[0.03] px-6 py-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-red-300">
            Incident Captured
          </div>
        </div>

        <div className="grid gap-10 p-8 md:grid-cols-[0.95fr_1.05fr] md:p-10">
          <div className="space-y-6">
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="inline-flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10"
            >
              <ShieldAlert className="h-10 w-10 text-red-400" />
            </motion.div>

            <div className="space-y-4">
              <h1 className="text-4xl font-bold tracking-tight">Mission Interrupted</h1>
              <p className="text-base leading-7 text-zinc-400">
                Something failed while rendering this part of the dashboard. Your session is still intact, and we
                can safely retry without losing your navigation state.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-start gap-3">
                <AlertTriangle className="mt-0.5 h-5 w-5 text-amber-400" />
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-white">Suggested recovery</div>
                  <p className="text-sm leading-6 text-zinc-400">
                    Retry this route first. If the same error returns, go back to the dashboard and reopen the feature.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
              <div className="mb-3 flex items-center gap-2 text-[10px] font-mono uppercase tracking-[0.24em] text-zinc-500">
                <TerminalSquare className="h-3.5 w-3.5" />
                Recovery Panel
              </div>
              <div className="space-y-3 text-sm text-zinc-300">
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  Route error boundaries are active and ready to retry this segment.
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  {error.digest ? `Trace ID: ${error.digest}` : "Trace ID is unavailable for this incident."}
                </div>
                <div className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-3">
                  {error.message ? `Latest message: ${error.message}` : "No error message was exposed to the client."}
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                onClick={() => reset()}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-black transition hover:bg-zinc-200"
              >
                <RefreshCw className="h-4 w-4" />
                Retry Route
              </button>
              <Link
                href="/dashboard"
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-6 py-4 text-sm font-bold text-white transition hover:bg-white/10"
              >
                <Home className="h-4 w-4" />
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
