"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, ShieldAlert, Loader2, AlertCircle, 
  CheckCircle, ArrowRight, Link as LinkIcon, 
  FileText, Type, Upload, ShieldCheck, Globe
} from "lucide-react";

interface AnalysisResult {
  riskScore: number;
  riskLevel: string;
  scamType: string;
  explanation: string;
  redFlags: string[];
  recommendedActions: string[];
  verification?: {
    verificationStatus: string;
    checkedUrl: string | null;
  };
}

type ScanMode = "text" | "url" | "file";

export default function ThreatScanner() {
  const [mode, setMode] = useState<ScanMode>("text");
  const [content, setContent] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        setError("File size exceeds 5MB limit.");
        return;
      }
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    let requestBody: BodyInit;
    let headers: HeadersInit | undefined;
    
    if (mode === "text") {
      if (!content.trim() || content.length < 20) {
        setError("Please provide at least 20 characters of text.");
        return;
      }
      requestBody = JSON.stringify({ content, sourceType: "text" });
      headers = { "Content-Type": "application/json" };
    } else if (mode === "url") {
      if (!url.trim() || !url.startsWith("http")) {
        setError("Please provide a valid URL (starting with http:// or https://).");
        return;
      }
      requestBody = JSON.stringify({ content: url, sourceType: "url", url });
      headers = { "Content-Type": "application/json" };
    } else if (mode === "file") {
      if (!file) {
        setError("Please select a document or image to analyze.");
        return;
      }
      const formData = new FormData();
      formData.append("file", file);
      requestBody = formData;
      headers = undefined;
    } else {
      setError("Unsupported scan mode.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers,
        body: requestBody,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <div className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950/50 backdrop-blur-3xl p-6 sm:p-10 shadow-2xl">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.1),transparent_40%)] pointer-events-none" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
                <ShieldAlert className="w-6 h-6 text-indigo-400" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-white">Neural Threat Scanner</h2>
                <p className="text-sm text-zinc-500 font-mono uppercase tracking-widest mt-1">Multi-Vector Analysis Engine</p>
              </div>
            </div>

            {/* Mode Switcher */}
            <div className="hidden md:flex bg-black/40 p-1 rounded-2xl border border-white/5">
              {(["text", "url", "file"] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => { setMode(m); setError(null); }}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                    mode === m ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {m === "text" && <Type className="w-3.5 h-3.5" />}
                  {m === "url" && <Globe className="w-3.5 h-3.5" />}
                  {m === "file" && <Upload className="w-3.5 h-3.5" />}
                  {m.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {/* Input Area */}
            <div className="relative group">
              {mode === "text" && (
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste job description, recruiter message, or email content here..."
                  className="w-full h-48 bg-zinc-900/50 border border-white/5 focus:border-indigo-500/50 rounded-3xl p-6 outline-none transition-all text-zinc-200 placeholder:text-zinc-700 resize-none text-base leading-relaxed"
                />
              )}

              {mode === "url" && (
                <div className="w-full h-48 flex flex-col items-center justify-center bg-zinc-900/50 border border-white/5 rounded-3xl p-8 space-y-4">
                  <div className="w-full max-w-md relative">
                    <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-600" />
                    <input
                      type="url"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      placeholder="https://linkedin.com/jobs/view/..."
                      className="w-full bg-black/40 border border-white/10 focus:border-indigo-500/50 rounded-2xl py-4 pl-12 pr-4 outline-none transition-all text-white"
                    />
                  </div>
                  <p className="text-xs text-zinc-500 text-center max-w-sm">
                    Enter any job board URL or company website. Our engine will fetch the live page content on the server and run a real-time domain verification scan.
                  </p>
                </div>
              )}

              {mode === "file" && (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full h-48 flex flex-col items-center justify-center bg-zinc-900/50 border border-dashed border-white/10 hover:border-indigo-500/40 rounded-3xl p-8 cursor-pointer transition-all group"
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept=".pdf,.txt,.png,.jpg,.jpeg,.webp"
                  />
                  <div className="h-16 w-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {file ? <FileText className="w-8 h-8 text-indigo-400" /> : <Upload className="w-8 h-8 text-zinc-600" />}
                  </div>
                  <p className="text-sm font-semibold text-white">
                    {file ? file.name : "Drop document or photo here"}
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">Image, PDF, or TXT (Max 5MB)</p>
                </div>
              )}

              <div className="absolute bottom-4 right-4 flex items-center gap-4">
                {mode === "text" && content.length > 0 && (
                  <span className={`text-[10px] font-mono ${content.length < 20 ? 'text-red-400' : 'text-zinc-500'}`}>
                    {content.length} chars
                  </span>
                )}
                <button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || (mode === "text" && content.length < 20) || (mode === "url" && !url) || (mode === "file" && !file)}
                  className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
                >
                  {isAnalyzing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                  {isAnalyzing ? "Scanning..." : "Run Analysis"}
                </button>
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 text-red-400 text-sm bg-red-400/5 border border-red-400/10 p-4 rounded-2xl"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            <AnimatePresence>
              {result && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-8 pt-8 border-t border-white/5 grid gap-8 md:grid-cols-2">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Analysis Result</div>
                        <div className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border ${
                          result.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                          result.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                          'bg-green-500/10 text-green-400 border-green-500/20'
                        }`}>
                          {result.riskLevel} Risk
                        </div>
                      </div>

                      <div className="flex items-baseline gap-4">
                        <div className={`text-6xl font-bold ${
                          result.riskScore > 70 ? 'text-red-500' : 
                          result.riskScore > 40 ? 'text-orange-400' : 
                          'text-green-400'
                        }`}>
                          {result.riskScore}
                        </div>
                        <div className="text-zinc-500 font-mono text-xs uppercase tracking-widest">/ 100 Risk Score</div>
                      </div>

                      <div className="space-y-3">
                        <div className="text-sm font-semibold text-white flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4 text-indigo-400" />
                          {result.scamType}
                        </div>
                        <p className="text-sm leading-relaxed text-zinc-400">{result.explanation}</p>
                      </div>

                      {result.verification && (
                         <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 space-y-2">
                           <div className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Verification Status</div>
                           <div className="flex items-center gap-2 text-sm text-zinc-300">
                             {result.verification.verificationStatus === 'verified' ? (
                               <CheckCircle className="w-4 h-4 text-emerald-400" />
                             ) : (
                               <AlertCircle className="w-4 h-4 text-orange-400" />
                             )}
                             {result.verification.verificationStatus.toUpperCase()}
                           </div>
                           {result.verification.checkedUrl && (
                             <div className="text-[10px] font-mono text-zinc-600 break-all">{result.verification.checkedUrl}</div>
                           )}
                         </div>
                      )}
                    </div>

                    <div className="space-y-6">
                      <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Red Flags Detected</div>
                      <div className="space-y-3">
                        {result.redFlags.slice(0, 5).map((flag, i) => (
                          <div key={i} className="flex gap-3 items-start p-3 rounded-xl bg-white/[0.03] border border-white/5">
                            <ShieldAlert className="w-4 h-4 text-red-400 mt-0.5" />
                            <span className="text-sm text-zinc-300">{flag}</span>
                          </div>
                        ))}
                      </div>

                      <div className="text-sm font-mono text-zinc-500 uppercase tracking-widest">Recommended Actions</div>
                      <div className="space-y-2">
                        {result.recommendedActions.slice(0, 4).map((action, i) => (
                          <div key={i} className="flex gap-3 items-center text-sm text-zinc-400">
                            <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                            {action}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
