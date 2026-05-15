import { Activity, Bell, ShieldAlert, UserRoundCheck } from "lucide-react";

const cards = [
  { title: "Active alerts", value: "12", icon: Bell, tone: "text-indigo-300" },
  { title: "Threats blocked", value: "248", icon: ShieldAlert, tone: "text-red-300" },
  { title: "Profiles verified", value: "1.4K", icon: UserRoundCheck, tone: "text-emerald-300" },
  { title: "Scans today", value: "63", icon: Activity, tone: "text-sky-300" },
];

import ThreatScanner from "@/components/ThreatScanner";

export default function DashboardPage() {
  return (
    <div className="space-y-12">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6 sm:p-8">
        <div className="max-w-2xl">
          <div className="mb-3 inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-indigo-300">
            Mission control
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Your recruitment threat dashboard
          </h1>
          <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
            Review suspicious jobs, monitor trending scam campaigns, and keep your career
            pipeline protected from impersonation and payment fraud.
          </p>
        </div>
      </section>

      <ThreatScanner />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-5"
          >
            <div className="flex items-center justify-between">
              <div className="text-sm text-zinc-500">{card.title}</div>
              <card.icon className={`h-5 w-5 ${card.tone}`} />
            </div>
            <div className="mt-6 text-3xl font-semibold text-white">{card.value}</div>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        <article className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
          <h2 className="text-xl font-semibold text-white">Recent intelligence</h2>
          <div className="mt-6 space-y-4">
            {[
              "Payment-request scam detected in a new remote design job listing.",
              "Three recruiter profiles were linked to recycled Telegram outreach scripts.",
              "A suspicious company domain was registered less than 48 hours ago.",
            ].map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4 text-sm text-zinc-300"
              >
                {item}
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-3xl border border-white/10 bg-zinc-950/70 p-6">
          <h2 className="text-xl font-semibold text-white">Next steps</h2>
          <ul className="mt-6 space-y-3 text-sm text-zinc-400">
            <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              Upload a job description to analyze recruiter intent.
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              Configure instant alerts for your preferred job keywords.
            </li>
            <li className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
              Review your profile privacy score before sending applications.
            </li>
          </ul>
        </article>
      </section>
    </div>
  );
}
