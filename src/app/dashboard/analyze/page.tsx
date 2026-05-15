"use client";

import ThreatScanner from "@/components/ThreatScanner";
import { Search, ShieldCheck, Zap } from "lucide-react";

export default function AnalyzePage() {
  return (
    <div className="space-y-12 pb-20">
      <section className="rounded-[2.5rem] border border-white/10 bg-zinc-950/70 p-8 sm:p-12 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Search className="h-48 w-48 text-indigo-500" />
        </div>
        
        <div className="max-w-2xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-300">
            Deep Scan Module
          </div>
          <h1 className="text-4xl font-bold text-white sm:text-6xl tracking-tight leading-tight">Advanced Threat Analysis</h1>
          <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
            Upload job descriptions, contracts, or chat logs for high-precision neural analysis. Our engine maps text against known scam DNA and recruiter behavioral markers.
          </p>
        </div>
      </section>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ThreatScanner />
        </div>
        
        <aside className="space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-400" />
              Analysis Engine v4.2
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Currently utilizing Llama-3-70B for semantic reasoning and custom heuristics for metadata validation.
            </p>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-mono text-zinc-500">
                <span>Accuracy Score</span>
                <span className="text-emerald-400">99.2%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[99.2%] bg-emerald-500" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 p-6 space-y-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Zap className="h-5 w-5 text-indigo-400" />
              Pro Intelligence
            </h3>
            <p className="text-sm text-zinc-400 leading-relaxed">
              Unlock domain impersonation checks and dark-web credential leak monitoring for recruiting firms.
            </p>
            <button className="w-full py-3 rounded-2xl bg-white text-black text-xs font-bold hover:bg-zinc-200 transition-all">
              Upgrade to Pro
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
