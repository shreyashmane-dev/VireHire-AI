"use client";

import { useAuth } from "@/context/AuthContext";
import { Settings, Shield, Bell, Lock, User, Palette, Globe } from "lucide-react";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user } = useAuth();

  const sections = [
    { icon: User, title: "Account Identity", desc: "Manage your profile details and neural signature." },
    { icon: Lock, title: "Security Protocols", desc: "Configure 2FA and session management." },
    { icon: Bell, title: "Threat Notifications", desc: "Set alerts for regional recruitment scam clusters." },
    { icon: Globe, title: "Network Privacy", desc: "Control how your reports are shared with the community." },
    { icon: Palette, title: "Interface", desc: "Customize the neural dashboard aesthetic." },
  ];

  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-indigo-500" />
          System Configuration
        </h1>
        <p className="mt-2 text-zinc-400">Configure your security parameters and dashboard preferences.</p>
      </section>

      <div className="grid gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-950/50 p-6 hover:bg-zinc-900/50 transition-all flex items-center justify-between"
          >
            <div className="flex items-center gap-6">
              <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-500/20 transition-all">
                <section.icon className="h-6 w-6 text-zinc-400 group-hover:text-indigo-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white">{section.title}</h3>
                <p className="text-sm text-zinc-500 mt-1">{section.desc}</p>
              </div>
            </div>
            <div className="h-8 w-14 rounded-full bg-zinc-900 border border-white/10 p-1 flex items-center">
              <div className="h-6 w-6 rounded-full bg-zinc-700" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
          <p className="text-sm text-zinc-500 mt-1">Permanently delete your account and all reported intelligence data.</p>
        </div>
        <button className="px-6 py-2.5 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-600 hover:text-white transition-all">
          Delete Account
        </button>
      </div>
    </div>
  );
}
