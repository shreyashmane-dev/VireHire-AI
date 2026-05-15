"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Flag, FileText, AlertCircle, CheckCircle2, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ReportsPage() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUserReports() {
      if (!user) return;
      try {
        const response = await fetch(`/api/community?userId=${user.uid}`);
        const result = await response.json();
        if (result.success) {
          setReports(result.data);
        }
      } catch (error) {
        console.error("Error fetching user reports:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchUserReports();
  }, [user]);

  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8 sm:p-12">
        <div className="max-w-2xl">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-300">
            Internal Archive
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-5xl">Your Security Reports</h1>
          <p className="mt-4 text-zinc-400 text-lg">
            A history of recruitment threats you have flagged and published to the network.
          </p>
        </div>
      </section>

      <div className="space-y-4">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))
        ) : reports.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-3xl">
            <FileText className="h-12 w-12 text-zinc-800 mx-auto" />
            <p className="mt-4 text-zinc-500 font-medium">You haven't published any reports yet.</p>
          </div>
        ) : (
          reports.map((report, i) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group flex items-center justify-between p-6 rounded-2xl border border-white/10 bg-zinc-950/50 hover:bg-zinc-900/50 transition-all"
            >
              <div className="flex items-center gap-6">
                <div className="h-12 w-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
                  <Flag className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">{report.title}</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{report.scamType}</span>
                    <span className="w-1 h-1 rounded-full bg-zinc-700" />
                    <span className="text-[10px] font-mono text-zinc-500 uppercase">{new Date(report.timestamp?.seconds * 1000).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="hidden sm:flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                  <CheckCircle2 className="h-3 w-3" />
                  Published
                </span>
                <ChevronRight className="h-5 w-5 text-zinc-600 group-hover:text-white transition-colors" />
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
