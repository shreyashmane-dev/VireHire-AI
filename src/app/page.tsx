import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import { Activity, Brain, Fingerprint, Map, Shield, Users, Zap } from "lucide-react";

const analysisFeatures = [
  {
    icon: Brain,
    title: "Neural scam detection",
    desc: "NLP-driven analysis of recruitment language, urgency tactics, and confidence bait.",
  },
  {
    icon: Fingerprint,
    title: "Scam DNA engine",
    desc: "Fingerprinting repeated fraud campaigns across outreach channels and job boards.",
  },
  {
    icon: Activity,
    title: "Recruiter reputation",
    desc: "Real-time scoring of recruiter authenticity using behavioral and domain signals.",
  },
];

const statItems = [
  { label: "Scams detected", value: "1.2M+" },
  { label: "Users protected", value: "850K+" },
  { label: "Fraud campaigns", value: "45K" },
  { label: "AI confidence", value: "99.9%" },
];

const enterpriseFeatures = [
  {
    icon: Map,
    title: "Threat heatmap",
    desc: "Visualize global and regional scam density in real time.",
  },
  {
    icon: Users,
    title: "Community intel",
    desc: "Crowdsourced scam reporting updated by thousands of job seekers.",
  },
  {
    icon: Activity,
    title: "Emotional radar",
    desc: "Detects pressure language, scarcity cues, and trust manipulation signals.",
  },
  {
    icon: Shield,
    title: "Company radar",
    desc: "Validates company domain age, legitimacy signals, and social footprint.",
  },
  {
    icon: Brain,
    title: "Resume scanner",
    desc: "Checks your CV for privacy leaks and sensitive data exposure risk.",
  },
  {
    icon: Zap,
    title: "Instant alerts",
    desc: "Get notified immediately when a trending scam matches your job profile.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

      <section className="relative overflow-hidden py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-14 lg:px-8">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              AI threat intelligence
              <br />
              <span className="text-indigo-400">in real time.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">
              Our neural engine analyzes job descriptions for urgency tactics,
              emotional manipulation, impersonation signals, and payment request
              patterns within milliseconds.
            </p>

            <div className="mt-8 space-y-5">
              {analysisFeatures.map((feature) => (
                <div key={feature.title} className="flex gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-zinc-900">
                    <feature.icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-white">{feature.title}</h3>
                    <p className="mt-1 text-sm leading-7 text-zinc-500 sm:text-base">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-3 rounded-[28px] bg-indigo-500/10 blur-3xl" />
            <div className="relative rounded-[28px] border border-white/10 bg-zinc-950/85 p-5 shadow-2xl shadow-indigo-950/20 sm:p-6">
              <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500 animate-ping" />
                  <span className="text-[11px] uppercase tracking-[0.24em] text-zinc-500 sm:text-xs">
                    Live analysis // ID: 8829-X
                  </span>
                </div>
                <span className="text-[11px] uppercase tracking-[0.24em] text-indigo-400 sm:text-xs">
                  Confidence: 98.4%
                </span>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl border border-red-500/20 bg-red-500/8 p-4">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-red-300">
                    Critical risk detected
                  </div>
                  <div className="mt-2 text-sm font-mono text-zinc-200">
                    &quot;Please deposit Rs 5000 as refundable security for the company
                    laptop before onboarding.&quot;
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      Risk score
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-red-400">92/100</div>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                    <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                      Manipulation
                    </div>
                    <div className="mt-3 text-3xl font-semibold text-orange-400">High</div>
                  </div>
                </div>

                <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-4">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-zinc-500">
                    AI reasoning
                  </div>
                  <p className="mt-2 text-sm leading-7 text-zinc-400">
                    Pattern match: Telegram-based recruitment scam. Identified urgency
                    language (&quot;Only 3 slots left&quot;) and unauthorized payment gateway
                    links.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-white/10 bg-zinc-950/50 py-16 sm:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 text-center sm:grid-cols-4 sm:px-6 lg:px-8">
          {statItems.map((stat) => (
            <div key={stat.label}>
              <div className="text-2xl font-semibold text-white sm:text-4xl">{stat.value}</div>
              <div className="mt-2 text-xs uppercase tracking-[0.22em] text-zinc-500 sm:text-sm">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <h2 className="text-3xl font-semibold tracking-tight sm:text-5xl">
              Enterprise threat intelligence
            </h2>
            <p className="mt-4 text-base leading-7 text-zinc-400 sm:text-lg">
              Advanced tools designed to identify and neutralize sophisticated
              recruitment fraud campaigns.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {enterpriseFeatures.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[28px] border border-white/6 bg-white/[0.03] p-6 transition hover:border-indigo-500/30 hover:bg-white/[0.04] sm:p-8"
              >
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-zinc-800 text-zinc-200">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-medium text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-500 sm:text-base">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 py-10 sm:py-12">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-indigo-500" />
            <span className="text-lg font-semibold">VeriHire AI</span>
          </div>
          <div className="flex flex-wrap gap-5 text-sm text-zinc-500">
            <a className="transition-colors hover:text-white" href="#">
              Privacy
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Terms
            </a>
            <a className="transition-colors hover:text-white" href="#">
              API
            </a>
            <a className="transition-colors hover:text-white" href="#">
              Contact
            </a>
          </div>
          <div className="text-xs uppercase tracking-[0.2em] text-zinc-600">
            Copyright 2026 VeriHire Intelligence Systems.
          </div>
        </div>
      </footer>
    </main>
  );
}
