"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { UserCircle, Shield, Mail, Key, ShieldCheck, Settings, LogIn } from "lucide-react";
import Image from "next/image";

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-zinc-700 animate-pulse" />
          <h2 className="mt-4 text-xl font-semibold text-white">Establishing connection...</h2>
          <p className="mt-2 text-zinc-500">Loading your secure profile data.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="max-w-lg rounded-[2rem] border border-white/10 bg-zinc-950/70 p-8 text-center">
          <Shield className="mx-auto h-12 w-12 text-zinc-700" />
          <h2 className="mt-4 text-2xl font-semibold text-white">Profile access locked</h2>
          <p className="mt-2 text-zinc-500">Please log in to view your secure profile and reporting history.</p>
          <Link
            href="/login"
            className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
          >
            <LogIn className="h-4 w-4" />
            Go to Login
          </Link>
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
              <Image src={user.photoURL} alt="Profile" width={96} height={96} className="h-full w-full rounded-[1.4rem] object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center rounded-[1.4rem] bg-zinc-900">
                <UserCircle className="h-12 w-12 text-zinc-600" />
              </div>
            )}
          </div>
          
          <div>
            <div className="inline-flex rounded-full bg-indigo-500/10 px-3 py-1 text-[10px] font-mono uppercase tracking-widest text-indigo-400 border border-indigo-500/20 mb-2">
              {user.emailVerified ? "Verified Agent" : "Verification Pending"}
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
            <div className={`flex items-center gap-2 text-xs rounded-xl px-3 py-2 border ${
              user.emailVerified
                ? "text-emerald-400 bg-emerald-500/5 border-emerald-500/10"
                : "text-amber-300 bg-amber-500/5 border-amber-500/10"
            }`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {user.emailVerified ? "Security email verification active" : "Email verification not completed yet"}
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

      <div className="rounded-3xl border border-white/10 bg-zinc-950/50 p-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Profile controls</h2>
          <p className="mt-1 text-sm text-zinc-500">Update your name, photo, and dashboard preferences from settings.</p>
        </div>
        <Link
          href="/dashboard/settings"
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-black transition hover:bg-zinc-200"
        >
          <Settings className="h-4 w-4" />
          Open Settings
        </Link>
      </div>
    </div>
  );
}
