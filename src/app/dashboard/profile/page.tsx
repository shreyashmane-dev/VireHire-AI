"use client";

import { useAuth } from "@/context/AuthContext";
import { UserCircle, Shield, Mail, Key, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-zinc-700 animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold text-white">Establishing connection...</h2>
          <p className="mt-2 text-zinc-500">Please log in to view your secure profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <section className="rounded-[2.5rem] border border-white/10 bg-zinc-950/70 p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <ShieldCheck className="h-40 w-40 text-indigo-500" />
        </div>
        
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center relative z-10">
          <div className="h-24 w-24 rounded-3xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 p-1">
            {user.photoURL ? (
              <img src={user.photoURL} alt="Profile" className="h-full w-full rounded-[1.4rem] object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-zinc-900">
                <UserCircle className="h-12 w-12 text-zinc-600" />
              </div>
            )}
          </div>
          
          <div>
            <div className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-400 border border-indigo-500/20 mb-2">
              Verified Agent
            </div>
            <h1 className="text-3xl font-bold text-white">{user.displayName || "Anonymous Agent"}</h1>
            <p className="text-zinc-500 font-mono text-sm mt-1">UUID: {user.uid.slice(0, 12)}...</p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 md:grid-cols-2">
        <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Mail className="h-5 w-5 text-indigo-400" />
            Contact Protocol
          </h2>
          <div className="space-y-4">
            <div>
              <label className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Primary Email</label>
              <div className="mt-1 text-zinc-300 bg-white/5 border border-white/5 rounded-2xl px-4 py-3">
                {user.email}
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl px-3 py-2">
              <ShieldCheck className="h-3.5 w-3.5" />
              Security email verification active
            </div>
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 space-y-6">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Key className="h-5 w-5 text-fuchsia-400" />
            Access Metrics
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Trust Score</div>
              <div className="mt-2 text-2xl font-bold text-indigo-400">98%</div>
            </div>
            <div className="bg-white/5 border border-white/5 rounded-2xl p-4">
              <div className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Identity Level</div>
              <div className="mt-2 text-2xl font-bold text-fuchsia-400">L3</div>
            </div>
          </div>
          <p className="text-xs text-zinc-500 leading-relaxed">
            Your trust score is calculated based on recruitment reporting accuracy and profile verification status.
          </p>
        </article>
      </div>
    </div>
  );
}
