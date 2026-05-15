"use client";

import { useCallback, useEffect, useState } from "react";
import { Zap, Globe, RefreshCcw, ArrowUpRight, ExternalLink, ShieldAlert, Timer } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface ThreatIntel {
  title: string;
  risk: string;
  summary: string;
  target: string;
  confidence: number;
  url: string;
  image?: string;
}

export default function ThreatFeedPage() {
  const [intel, setIntel] = useState<ThreatIntel[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [nextRefresh, setNextRefresh] = useState(300);

  const fetchIntel = useCallback(async (isAuto = false) => {
    if (!isAuto) setIsRefreshing(true);
    setError(null);
    try {
      const response = await fetch("/api/news");
      if (!response.ok) throw new Error("Sync failed.");
      const result = await response.json();
      if (result.success && Array.isArray(result.data)) {
        setIntel(result.data);
        setNextRefresh(300);
      }
    } catch (err: any) {
      console.error("Fetch Error:", err);
      setError("Intelligence link severed. Attempting reconnect...");
    } finally {
      setIsRefreshing(false);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setNextRefresh((prev) => {
        if (prev <= 1) {
          void fetchIntel(true);
          return 300;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [fetchIntel]);

  useEffect(() => {
    void fetchIntel();
  }, [fetchIntel]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOpenLink = (url: string) => {
    if (!url) return;
    // Open in new tab with security best practices
    const win = window.open(url, '_blank', 'noopener,noreferrer');
    if (win) win.focus();
  };

  return (
    <div className="space-y-8 pb-20">
      
      {/* HEADER */}
      <section className="rounded-[2.5rem] border border-white/10 bg-zinc-950/70 p-8 sm:p-12 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
          <Globe className="h-64 w-64 text-indigo-500 animate-[spin_100s_linear_infinite]" />
        </div>
        
        <div className="max-w-3xl relative z-10">
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-300">
              <Globe className="h-3 w-3 text-indigo-400" />
              Verified Global Intelligence
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/5 px-3 py-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-500">
              <Timer className="h-3 w-3" />
              Auto-Sync: {formatTime(nextRefresh)}
            </div>
          </div>

          <h1 className="text-4xl font-bold text-white sm:text-6xl tracking-tight leading-tight">
            Global <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">Threat Feed</span>
          </h1>
          <p className="mt-6 text-zinc-400 text-lg leading-relaxed">
            Real-time monitoring of recruitment fraud, identity theft campaigns, and malicious job listings.
          </p>
          
          <div className="mt-8">
            <button 
              onClick={() => void fetchIntel()}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white text-black text-sm font-bold hover:bg-zinc-200 transition-all disabled:opacity-50"
            >
              <RefreshCcw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              Sync Now
            </button>
          </div>
        </div>
      </section>

      {/* GRID */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <div key={i} className="h-[420px] rounded-[2.5rem] bg-white/[0.02] border border-white/5 animate-pulse" />
          ))
        ) : error ? (
          <div className="md:col-span-2 lg:col-span-3 rounded-3xl border border-red-500/20 bg-red-500/5 p-12 text-center">
            <ShieldAlert className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <p className="text-zinc-500 mb-6">{error}</p>
            <button onClick={() => void fetchIntel()} className="px-6 py-2 bg-red-500/10 text-red-400 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition-all">
              Retry Sync
            </button>
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {intel.map((item, i) => (
              <motion.article
                key={`threat-${i}-${item.title.substring(0, 5)}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleOpenLink(item.url)}
                className="group relative flex flex-col overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/50 hover:border-indigo-500/40 transition-all hover:bg-zinc-900/40 cursor-pointer shadow-2xl"
              >
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden bg-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent z-10" />
                  {item.image ? (
                    <img 
                      src={item.image} 
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale-[0.5] group-hover:grayscale-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=800";
                      }}
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <Zap className="h-12 w-12 text-zinc-800" />
                    </div>
                  )}
                  <div className="absolute top-4 left-4 z-20">
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border backdrop-blur-md ${
                      item.risk === 'Critical' ? 'bg-red-500/20 text-red-400 border-red-500/30' : 
                      item.risk === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                      'bg-indigo-500/20 text-indigo-400 border-indigo-500/30'
                    }`}>
                      {item.risk} Risk
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{item.target}</span>
                      <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{item.confidence}% Confidence</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-2">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-400 leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  <div className="mt-8 flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400 uppercase font-bold group-hover:text-white transition-colors">
                      <ExternalLink className="h-3 w-3" />
                      Open Full News
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 transition-all group-hover:shadow-lg group-hover:shadow-indigo-500/20">
                      <ArrowUpRight className="h-5 w-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
