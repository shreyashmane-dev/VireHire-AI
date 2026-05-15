"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Shield, Lock, Mail, ArrowRight, Loader2, Fingerprint } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const router = useRouter();
  const { loginWithGoogle, user } = useAuth();

  // Redirect if already logged in
  if (user) {
    router.push("/dashboard");
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Standard login can be implemented here as well
    setTimeout(() => {
      setIsLoading(false);
      router.push("/dashboard");
    }, 1500);
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      await loginWithGoogle();
      router.push("/dashboard");
    } catch (error) {
      console.error(error);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex relative overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" 
        />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      </div>

      <div className="flex-1 flex flex-col justify-center items-center z-10 p-4">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-[420px]"
        >
          <div className="flex flex-col items-center mb-8">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 shadow-[0_0_30px_rgba(99,102,241,0.3)] mb-6 backdrop-blur-xl"
            >
              <Shield className="w-10 h-10 text-indigo-500" />
            </motion.div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-indigo-200 to-zinc-400">VeriHire AI</h1>
            <p className="text-zinc-500 text-sm mt-2 font-mono uppercase tracking-widest">Secure Terminal Login</p>
          </div>

          <div className="glass p-8 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-2xl">
            {/* Top glowing border */}
            <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
            
            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest pl-1">Agent ID / Email</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="email" 
                    required
                    className="w-full bg-zinc-950/50 border border-white/5 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder:text-zinc-700 shadow-inner"
                    placeholder="agent@domain.com"
                  />
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <div className="flex justify-between items-center pl-1">
                  <label className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Security Key</label>
                  <Link href="#" className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300">Reset?</Link>
                </div>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
                  <input 
                    type="password" 
                    required
                    className="w-full bg-zinc-950/50 border border-white/5 focus:border-indigo-500/50 rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all text-white placeholder:text-zinc-700 shadow-inner"
                    placeholder="••••••••••••"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading || isGoogleLoading}
                type="submit"
                className="w-full py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(99,102,241,0.3)] transition-all disabled:opacity-50 relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    Initialize Connection
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">or bypass</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <motion.button 
              onClick={handleGoogleLogin}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading || isGoogleLoading}
              className="w-full py-3.5 rounded-2xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 hover:border-white/20 text-white font-medium flex items-center justify-center gap-3 transition-all disabled:opacity-50 group"
            >
              {isGoogleLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {/* Google SVG Icon */}
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
            
            <div className="mt-8 text-center">
              <span className="text-zinc-500 text-sm">New to the network? </span>
              <Link href="/signup" className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline underline-offset-4">
                Request Clearance
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
