"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, User, ArrowRight, Loader2, CheckCircle, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 2000);
  };

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    setTimeout(() => {
      setIsGoogleLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Animated Floating Particles Background */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[10%] -right-[10%] w-[600px] h-[600px] bg-[radial-gradient(ellipse_at_center,rgba(168,85,247,0.15)_0%,rgba(0,0,0,0)_60%)]"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[10%] -left-[10%] w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.15)_0%,rgba(0,0,0,0)_60%)]"
        />
        {/* Subtle grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="w-full max-w-[500px]"
        >
          <div className="flex flex-col items-center mb-6">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.3)] mb-4 backdrop-blur-xl"
            >
              <Fingerprint className="w-10 h-10 text-purple-500" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-purple-200 to-zinc-400">VeriHire AI</h1>
            <p className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">Network Registration</p>
          </div>

          <div className="glass p-8 sm:p-10 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Top glowing border */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-50" />
            
            <motion.button 
              onClick={handleGoogleSignup}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3.5 mb-6 rounded-2xl bg-white text-black font-semibold flex items-center justify-center gap-3 shadow-[0_0_15px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Continue with Google
                </>
              )}
            </motion.button>

            <div className="mb-6 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Or create manual clearance</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Agent Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                    <input 
                      type="text" 
                      required
                      className="w-full bg-zinc-950/50 border border-white/5 focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 outline-none transition-all text-white placeholder:text-zinc-700 shadow-inner text-sm"
                      placeholder="Jane Doe"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 relative">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Email Protocol</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                    <input 
                      type="email" 
                      required
                      className="w-full bg-zinc-950/50 border border-white/5 focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 outline-none transition-all text-white placeholder:text-zinc-700 shadow-inner text-sm"
                      placeholder="agent@domain.com"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Security Key</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-purple-400 transition-colors" />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-zinc-950/50 border border-white/5 focus:border-purple-500/50 rounded-2xl py-3 pl-11 pr-4 outline-none transition-all text-white placeholder:text-zinc-700 shadow-inner text-sm"
                    placeholder="Create a strong password"
                  />
                </div>
              </div>

              {/* Security Checklist animation */}
              <div className="py-2 space-y-2">
                {[
                  "Real-time Scam Detection",
                  "Global Threat Feed Access"
                ].map((perk, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-wide text-zinc-400"
                  >
                    <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                    {perk}
                  </motion.div>
                ))}
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || isGoogleLoading}
                type="submit"
                className="w-full py-4 mt-2 rounded-2xl bg-purple-600 hover:bg-purple-500 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all disabled:opacity-50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Neural Signature...
                  </>
                ) : (
                  <>
                    Establish Clearance
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-8 text-center border-t border-white/10 pt-6">
              <span className="text-zinc-500 text-sm">Already have clearance? </span>
              <Link href="/login" className="text-purple-400 hover:text-purple-300 font-medium hover:underline underline-offset-4 transition-all">
                Initialize Connection
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
