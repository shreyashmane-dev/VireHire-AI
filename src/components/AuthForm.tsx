"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { AlertCircle, ArrowRight, LoaderCircle, Shield, Sparkles } from "lucide-react";
import { auth, getClientAnalytics } from "@/firebase/config";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

const authCopy = {
  login: {
    eyebrow: "Secure access",
    title: "Welcome back to VeriHire AI",
    description:
      "Sign in to review flagged jobs, resume scans, and live scam alerts across your dashboard.",
    submitLabel: "Sign in",
    alternateLabel: "Need an account?",
    alternateHref: "/signup",
    alternateCta: "Create one",
  },
  signup: {
    eyebrow: "Protect your career",
    title: "Create your VeriHire AI account",
    description:
      "Start monitoring job scams, verify recruiters faster, and receive instant fraud alerts tailored to you.",
    submitLabel: "Create account",
    alternateLabel: "Already registered?",
    alternateHref: "/login",
    alternateCta: "Sign in",
  },
} satisfies Record<AuthMode, {
  eyebrow: string;
  title: string;
  description: string;
  submitLabel: string;
  alternateLabel: string;
  alternateHref: string;
  alternateCta: string;
}>;

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const copy = authCopy[mode];
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
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

      startTransition(() => {
        router.push("/dashboard");
      });
    } catch (caughtError) {
      const message =
        caughtError instanceof Error ? caughtError.message : "Authentication failed.";
      setError(message.replace("Firebase: ", ""));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-zinc-950/85 shadow-2xl shadow-indigo-950/20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-indigo-400/80 to-transparent" />
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative p-6 sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(99,102,241,0.16),transparent_45%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,0.12),transparent_40%)]" />
          <div className="relative">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              {copy.eyebrow}
            </div>
            <h1 className="max-w-xl text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              {copy.title}
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
              {copy.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {[
                "Live recruiter screening",
                "Resume privacy checks",
                "Signal-based scam alerts",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/8 bg-white/[0.03] p-4 text-sm text-zinc-300"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/55 p-6 sm:p-8 lg:border-l lg:border-t-0">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-2xl border border-indigo-400/20 bg-indigo-500/10 p-3 text-indigo-300">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <div className="text-sm font-medium text-white">Account access</div>
              <div className="text-xs text-zinc-500">Protected by Firebase Authentication</div>
            </div>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <label className="block">
                <span className="mb-2 block text-sm text-zinc-300">Full name</span>
                <input
                  autoComplete="name"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  onChange={(event) => setFullName(event.target.value)}
                  placeholder="Aarav Sharma"
                  value={fullName}
                />
              </label>
            ) : null}

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-300">Email address</span>
              <input
                autoComplete="email"
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-zinc-300">Password</span>
              <input
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
                className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                minLength={6}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Minimum 6 characters"
                required
                type="password"
                value={password}
              />
            </label>

            {mode === "signup" ? (
              <label className="block">
                <span className="mb-2 block text-sm text-zinc-300">Confirm password</span>
                <input
                  autoComplete="new-password"
                  className="w-full rounded-2xl border border-white/10 bg-zinc-950 px-4 py-3 text-white outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/20"
                  minLength={6}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </label>
            ) : null}

            {error ? (
              <div className="flex items-start gap-3 rounded-2xl border border-red-500/25 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            ) : null}

            <button
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {copy.submitLabel}
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <p className="mt-5 text-sm text-zinc-500">
            {copy.alternateLabel}{" "}
            <Link className="text-indigo-300 transition hover:text-white" href={copy.alternateHref}>
              {copy.alternateCta}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
