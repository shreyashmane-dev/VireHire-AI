"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ArrowLeft, Home, Terminal, SearchX } from "lucide-react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 h-[500px] w-[500px] rounded-full bg-indigo-500/10 blur-[120px]" />
      <div className="absolute bottom-0 left-0 h-[500px] w-[500px] rounded-full bg-fuchsia-500/10 blur-[120px]" />

      <div className="max-w-3xl w-full relative z-10 rounded-[2rem] border border-white/10 bg-zinc-950/80 p-8 sm:p-10">
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mb-8 inline-flex items-center justify-center h-24 w-24 rounded-3xl bg-red-500/10 border border-red-500/20"
        >
          <ShieldAlert className="h-12 w-12 text-red-500" />
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
            Error Code: 404_NOT_FOUND
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-6xl tracking-tight mb-6">
            Node Not Reachable
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed mb-10">
            The encrypted intelligence node you are trying to access has been relocated or does not exist in our global registry.
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
          className="mb-10 grid gap-4 sm:grid-cols-2"
        >
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 text-left">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <SearchX className="h-4 w-4 text-indigo-400" />
              What happened
            </div>
            <p className="text-sm leading-6 text-zinc-400">
              This route may have been renamed, removed, or linked incorrectly from another part of the dashboard.
            </p>
          </div>
          <div className="rounded-3xl border border-white/8 bg-white/[0.03] p-5 text-left">
            <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
              <Terminal className="h-4 w-4 text-fuchsia-400" />
              Best next step
            </div>
            <p className="text-sm leading-6 text-zinc-400">
              Head back to the dashboard and reopen the tool from the main navigation so we can re-establish route state cleanly.
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/dashboard"
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-black font-bold hover:bg-zinc-200 transition-all w-full sm:w-auto"
          >
            <Home className="h-4 w-4" />
            Back to Command Center
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 text-white font-bold hover:bg-white/10 transition-all w-full sm:w-auto"
          >
            <ArrowLeft className="h-4 w-4" />
            Return to Safety
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex items-center justify-center gap-2 text-zinc-600 font-mono text-[10px] uppercase tracking-widest"
        >
          <Terminal className="h-3 w-3" />
          VeriHire Secure Gateway v2.4
        </motion.div>
      </div>
    </div>
  );
}
