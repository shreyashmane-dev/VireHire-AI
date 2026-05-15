"use client";

import { useCallback, useEffect, useState } from "react";
import { Zap, Globe, RefreshCcw, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ThreatIntel {
  title: string;
  risk: string;
  summary: string;
  target: string;
  confidence: number;
}

export default function ThreatFeedPage() {
  const [intel, setIntel] = useState<ThreatIntel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchIntel = useCallback(async () => {
    setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Server error: ${response.status}`);
      }

      const result = await response.json();
      if (result.success) {
        setIntel(result.data);
      }
    } catch (error: unknown) {
      console.error("Error fetching threat intel:", error);
      setError(error instanceof Error ? error.message : "Unable to load threat intelligence.");
    } finally {
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    let isActive = true;

    async function loadInitialIntel() {
      try {
        const response = await fetch("/api/news");

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.message || `Server error: ${response.status}`);
        }

        const result = await response.json();
        if (isActive && result.success) {
          setIntel(result.data);
        }
      } catch (error: unknown) {
        console.error("Error fetching threat intel:", error);
        if (isActive) {
          setError(error instanceof Error ? error.message : "Unable to load threat intelligence.");
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    }

    void loadInitialIntel();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-[2.5rem] border border-white/10 bg-zinc-950/70 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Globe className="h-48 w-48 text-indigo-500 animate-[spin_60s_linear_infinite]" />
        </div>
        
        <div className="max-w-2xl relative z-10">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-300">
            <Globe className="h-3 w-3 text-indigo-400" />
            Verified Global Intelligence
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-5xl tracking-tight">Global Threat Feed</h1>
          <p className="mt-4 text-zinc-400 text-lg leading-relaxed">
            Real-time monitoring of global recruitment fraud, powered by NewsAPI and categorized by our neural network for your protection.
          </p>
          
          <button 
            onClick={() => void fetchIntel()}
            disabled={isRefreshing}
            className="mt-6 flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/5 border border-white/10 text-sm font-semibold hover:bg-white/10 transition-all disabled:opacity-50"
          >
            <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh Intelligence
          </button>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="h-64 rounded-3xl bg-white/[0.02] border border-white/5 animate-pulse" />
          ))
        ) : error ? (
          <div className="md:col-span-2 rounded-3xl border border-red-500/20 bg-red-500/5 p-6 text-sm text-red-200">
            {error}
          </div>
        ) : (
          <AnimatePresence>
            {intel.map((item, i) => (
              <motion.article
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-[2rem] border border-white/10 bg-zinc-950/50 p-6 sm:p-8 hover:border-indigo-500/30 transition-all hover:bg-zinc-900/40"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border ${
                      item.risk === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' : 
                      item.risk === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                    }`}>
                      {item.risk} Risk
                    </div>
                    <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Confidence: {item.confidence}%</div>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">{item.title}</h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">{item.summary}</p>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-white/5 pt-6">
                  <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">
                    Sector: <span className="text-zinc-300">{item.target}</span>
                  </div>
                  <button className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 group-hover:bg-indigo-500 group-hover:text-white transition-all">
                    <ArrowUpRight className="h-5 w-5" />
                  </button>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
