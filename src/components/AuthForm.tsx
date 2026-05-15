"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import { AlertCircle, ArrowRight, LoaderCircle, Shield, Eye, EyeOff, Lock, Mail, User, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { auth, getClientAnalytics } from "@/firebase/config";

type AuthMode = "login" | "signup";
type AuthFormProps = { mode: AuthMode };

const STATS = [
  { value: "248K+", label: "Scams Detected" },
  { value: "99.2%", label: "Accuracy Score" },
  { value: "1.4M+", label: "Users Protected" },
];

const FEATURES = [
  "Real-time neural threat scanning",
  "Live recruiter identity verification",
  "Global scam pattern database",
  "Instant fraud alert system",
];

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  async function handleGoogleLogin() {
    setIsGoogleLoading(true);
    setError("");
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      startTransition(() => router.push("/dashboard"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Google sign-in failed.";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setIsGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    if (mode === "signup" && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === "signup") {
        const credentials = await createUserWithEmailAndPassword(auth, email, password);
        if (fullName.trim()) {
          await updateProfile(credentials.user, { displayName: fullName.trim() });
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
      void getClientAnalytics();
      startTransition(() => router.push("/dashboard"));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Authentication failed.";
      setError(message.replace("Firebase: ", "").replace("auth/", "").replaceAll("-", " "));
    } finally {
      setIsSubmitting(false);
    }
  }

  const inputClass = "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 pl-11 text-white text-sm outline-none transition-all placeholder:text-zinc-600 focus:border-indigo-500/60 focus:bg-white/[0.07] focus:ring-2 focus:ring-indigo-500/20";

  return (
    <div className="min-h-screen w-full flex bg-black overflow-hidden">
      
      {/* ─── LEFT PANEL ─── */}
      <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden">
        
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.25),transparent_55%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(168,85,247,0.2),transparent_55%)]" />
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px"
          }} />

          {/* Floating Orbs */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${[80,120,60,100,70,90][i]}px`,
                height: `${[80,120,60,100,70,90][i]}px`,
                top: `${[10,35,65,20,75,50][i]}%`,
                left: `${[15,60,25,80,45,70][i]}%`,
                background: i % 2 === 0 
                  ? "radial-gradient(circle, rgba(99,102,241,0.3), transparent)" 
                  : "radial-gradient(circle, rgba(168,85,247,0.2), transparent)",
                filter: "blur(20px)",
              }}
              animate={{ y: [0, -20, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 4 + i, repeat: Infinity, ease: "easeInOut", delay: i * 0.7 }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">VeriHire AI</span>
          </div>
        </div>

        <div className="relative z-10 space-y-8">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[11px] font-mono uppercase tracking-[0.2em] text-indigo-300 mb-6"
            >
              <Zap className="h-3 w-3 fill-indigo-400" />
              Neural Threat Intelligence
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl xl:text-5xl font-bold text-white leading-tight"
            >
              Protect Your Career
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent">
                From Recruitment Scams
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 text-zinc-400 text-lg leading-relaxed"
            >
              AI-powered fraud detection that analyzes job offers, verifies recruiters, and alerts you before it&apos;s too late.
            </motion.p>
          </div>

          {/* Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {FEATURES.map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-5 w-5 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
                  <div className="h-2 w-2 rounded-full bg-indigo-400" />
                </div>
                <span className="text-sm text-zinc-300">{f}</span>
              </div>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid grid-cols-3 gap-4"
          >
            {STATS.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-sm">
                <div className="text-2xl font-bold text-white">{s.value}</div>
                <div className="text-[11px] font-mono text-zinc-500 uppercase tracking-widest mt-1">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Bottom quote */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="relative z-10 border-t border-white/10 pt-8"
        >
          <p className="text-sm text-zinc-500 italic">
            &quot;VeriHire AI caught a scam before I even noticed the red flags.&quot;
          </p>
          <p className="text-xs text-zinc-600 mt-2">— Software Engineer, Verified User</p>
        </motion.div>
      </div>

      {/* ─── RIGHT PANEL (Form) ─── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-10 relative">
        
        {/* Mobile BG */}
        <div className="absolute inset-0 lg:hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(99,102,241,0.15),transparent_60%)]" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md relative z-10"
        >
          {/* Mobile Logo */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-600 flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-white">VeriHire AI</span>
          </div>

          {/* Header */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-300 mb-4">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {mode === "login" ? "Secure Access" : "Protect Your Career"}
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="mt-2 text-zinc-400 text-sm">
              {mode === "login"
                ? "Sign in to your threat intelligence dashboard."
                : "Join 1.4M+ professionals protected by VeriHire AI."}
            </p>
          </div>

          {/* Google Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isGoogleLoading || isSubmitting}
            className="w-full flex items-center justify-center gap-3 py-3.5 rounded-2xl border border-white/15 bg-white/[0.05] text-white text-sm font-semibold hover:bg-white/[0.10] hover:border-white/25 transition-all mb-6 disabled:opacity-50"
          >
            {isGoogleLoading ? (
              <LoaderCircle className="h-4 w-4 animate-spin" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
            )}
            Continue with Google
          </button>

          {/* Divider */}
          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[11px] font-mono text-zinc-600 uppercase tracking-widest">or with email</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  autoComplete="name"
                  className={inputClass}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Full name"
                  value={fullName}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
              <input
                autoComplete="email"
                className={inputClass}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email address"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
              <input
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className={`${inputClass} pr-12`}
                minLength={6}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password (min. 6 characters)"
                required
                type={showPassword ? "text" : "password"}
                value={password}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 transition-colors"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>

            {mode === "signup" && (
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-600 pointer-events-none" />
                <input
                  autoComplete="new-password"
                  className={inputClass}
                  minLength={6}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </div>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-300"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="capitalize">{error}</span>
              </motion.div>
            )}

            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white font-bold text-sm hover:from-indigo-500 hover:to-indigo-400 transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed mt-2"
              disabled={isSubmitting || isGoogleLoading}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Verifying identity...
                </>
              ) : (
                <>
                  {mode === "login" ? "Access Dashboard" : "Create Secure Account"}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </motion.button>
          </form>

          {/* Footer Link */}
          <p className="mt-6 text-center text-sm text-zinc-500">
            {mode === "login" ? "New to VeriHire AI?" : "Already have an account?"}{" "}
            <Link
              href={mode === "login" ? "/signup" : "/login"}
              className="text-indigo-400 font-semibold hover:text-white transition-colors"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </Link>
          </p>

          <p className="mt-4 text-center text-[11px] font-mono text-zinc-700 uppercase tracking-widest">
            Protected by Firebase Authentication · End-to-end encrypted
          </p>
        </motion.div>
      </div>
    </div>
  );
}
