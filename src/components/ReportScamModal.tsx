"use client";

import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Loader2, CheckCircle, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ReportScamModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    scamType: "Fake Job Offer",
    riskLevel: "High",
    platform: "LinkedIn"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/community", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          userId: user.uid,
          userName: user.displayName || "Anonymous Agent",
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          onClose();
          window.location.reload(); 
        }, 2000);
      }
    } catch (error) {
      console.error("Error reporting scam:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-white/10 bg-zinc-950 p-8 shadow-2xl"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 text-zinc-500 hover:text-white">
              <X className="h-5 w-5" />
            </button>

            {isSuccess ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-6 rounded-full bg-emerald-500/10 p-4 border border-emerald-500/20">
                  <CheckCircle className="h-12 w-12 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-bold text-white">Intel Published</h2>
                <p className="mt-2 text-zinc-500">Thank you for protecting the network, Agent.</p>
              </div>
            ) : (
              <>
                <div className="mb-8 flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20">
                    <ShieldAlert className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Report Scam Intel</h2>
                    <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest mt-1">Publish to Global Feed</p>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Threat Title</label>
                    <input 
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 px-4 outline-none transition-all text-white text-sm"
                      placeholder="e.g. Fake Google Recruiter on Telegram"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Scam Type</label>
                      <select 
                        value={formData.scamType}
                        onChange={(e) => setFormData({...formData, scamType: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 px-4 outline-none transition-all text-white text-sm appearance-none"
                      >
                        <option>Fake Job Offer</option>
                        <option>Advance Fee</option>
                        <option>Identity Theft</option>
                        <option>Phishing</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Platform</label>
                      <input 
                        required
                        value={formData.platform}
                        onChange={(e) => setFormData({...formData, platform: e.target.value})}
                        className="w-full bg-white/5 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 px-4 outline-none transition-all text-white text-sm"
                        placeholder="LinkedIn / Telegram"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Description / Evidence</label>
                    <textarea 
                      required
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full h-32 bg-white/5 border border-white/5 focus:border-red-500/50 rounded-2xl py-3 px-4 outline-none transition-all text-white text-sm resize-none"
                      placeholder="Describe the tactics used..."
                    />
                  </div>

                  <button
                    disabled={isSubmitting}
                    type="submit"
                    className="w-full py-4 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
                  >
                    {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin" /> : "Publish Intelligence"}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
