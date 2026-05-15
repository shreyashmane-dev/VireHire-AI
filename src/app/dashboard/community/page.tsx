"use client";

import { useEffect, useState } from "react";
import { Users, AlertTriangle, ShieldAlert, Clock, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

interface ScamReport {
  id: string;
  title: string;
  description: string;
  scamType: string;
  riskLevel: string;
  timestamp: { seconds?: number } | string | null;
  platform: string;
}

import ReportScamModal from "@/components/ReportScamModal";

function formatReportDate(timestamp: ScamReport["timestamp"]) {
  if (timestamp && typeof timestamp === "object" && typeof timestamp.seconds === "number") {
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  }

  if (typeof timestamp === "string" || timestamp instanceof Date) {
    return new Date(timestamp).toLocaleDateString();
  }

  return "Unknown";
}

export default function CommunityPage() {
  const [reports, setReports] = useState<ScamReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchReports() {
      try {
        const response = await fetch("/api/community");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Unable to load community intelligence.");
        }

        if (result.success) {
          setReports(result.data);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError(error instanceof Error ? error.message : "Unable to load community intelligence.");
      } finally {
        setLoading(false);
      }
    }

    fetchReports();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-emerald-300">
            Collective Intelligence
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl flex items-center gap-4">
            <Users className="h-10 w-10 text-indigo-500" />
            Community Scam Watch
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
            Real-time feed of scams reported by VeriHire agents worldwide. Help protect the network by flagging suspicious activity.
          </p>
        </div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all flex items-center gap-2"
        >
          <ShieldAlert className="h-5 w-5" />
          Report a Scam
        </button>
      </section>

      <ReportScamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <div className="grid gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <Clock className="h-10 w-10 text-zinc-700 animate-spin" />
            <span className="text-zinc-500 font-mono text-xs uppercase tracking-widest">Syncing with Global Database...</span>
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-500/20 bg-red-500/5 p-8">
            <div className="inline-flex rounded-full border border-red-500/20 bg-red-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.24em] text-red-300">
              Feed Offline
            </div>
            <h2 className="mt-4 text-2xl font-semibold text-white">Community thread is temporarily unavailable</h2>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
            >
              Retry Feed
            </button>
          </div>
        ) : reports.length === 0 ? (
          <div className="text-center py-20 border border-white/5 rounded-3xl bg-white/[0.02]">
            <ShieldAlert className="h-12 w-12 text-zinc-800 mx-auto" />
            <p className="mt-4 text-zinc-500">No active threat reports in your sector. All clear.</p>
          </div>
        ) : (
          reports.map((report, i) => (
            <motion.article 
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950/50 p-6 hover:bg-zinc-900/50 transition-all"
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      report.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                    }`}>
                      {report.riskLevel}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{report.platform}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-white group-hover:text-indigo-400 transition-colors">{report.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed max-w-3xl">{report.description}</p>
                  <div className="flex items-center gap-4 pt-2">
                    <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                      <Clock className="h-3.5 w-3.5" />
                      {formatReportDate(report.timestamp)}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      {report.scamType}
                    </div>
                  </div>
                </div>
                
                <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all self-start">
                  View Intel
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>
            </motion.article>
          ))
        )}
      </div>
    </div>
  );
}
