"use client";

import { useRef, useState } from "react";
import { updateProfile } from "firebase/auth";
import { auth } from "@/firebase/config";
import { useAuth } from "@/context/AuthContext";
import {
  Settings,
  Bell,
  Lock,
  User,
  Palette,
  Globe,
  Save,
  CheckCircle2,
} from "lucide-react";
import { motion } from "framer-motion";

type Preferences = {
  notifications: boolean;
  communitySharing: boolean;
  darkInterface: boolean;
  sessionAlerts: boolean;
};

const defaultPreferences: Preferences = {
  notifications: true,
  communitySharing: true,
  darkInterface: true,
  sessionAlerts: true,
};

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();
  const formRef = useRef<HTMLFormElement>(null);
  const [preferences, setPreferences] = useState<Preferences>(() => {
    if (typeof window === "undefined") {
      return defaultPreferences;
    }

    const saved = window.localStorage.getItem("verihire-settings");
    if (!saved) {
      return defaultPreferences;
    }

    try {
      const parsed = JSON.parse(saved) as Partial<Preferences>;
      return { ...defaultPreferences, ...parsed };
    } catch {
      window.localStorage.removeItem("verihire-settings");
      return defaultPreferences;
    }
  });
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const sections = [
    {
      key: "notifications",
      icon: Bell,
      title: "Threat Notifications",
      desc: "Set alerts for regional recruitment scam clusters.",
    },
    {
      key: "sessionAlerts",
      icon: Lock,
      title: "Security Protocols",
      desc: "Warn me when new sessions or suspicious sign-ins appear.",
    },
    {
      key: "communitySharing",
      icon: Globe,
      title: "Network Privacy",
      desc: "Control how your reports are shared with the community.",
    },
    {
      key: "darkInterface",
      icon: Palette,
      title: "Interface",
      desc: "Keep the current dark command-center experience enabled.",
    },
  ] as const;

  const handleToggle = (key: keyof Preferences) => {
    setPreferences((current) => ({ ...current, [key]: !current[key] }));
  };

  const handleSave = async (formData: FormData) => {
    setIsSaving(true);
    setStatus(null);

    try {
      const submittedName = String(formData.get("displayName") ?? "").trim();
      const submittedPhotoUrl = String(formData.get("photoURL") ?? "").trim();

      if (!auth.currentUser) {
        throw new Error("Please log in to update account settings.");
      }

      await updateProfile(auth.currentUser, {
        displayName: submittedName || auth.currentUser.displayName,
        photoURL: submittedPhotoUrl || null,
      });

      await refreshUser();

      window.localStorage.setItem("verihire-settings", JSON.stringify(preferences));
      setStatus("Settings saved successfully.");
    } catch (error) {
      console.error("Settings save error:", error);
      setStatus("Unable to save settings right now.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      <section className="rounded-3xl border border-white/10 bg-zinc-950/70 p-8">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Settings className="h-8 w-8 text-indigo-500" />
          System Configuration
        </h1>
        <p className="mt-2 text-zinc-400">Configure your security parameters and dashboard preferences.</p>
      </section>

      <form
        ref={formRef}
        key={user?.uid ?? "guest-settings"}
        action={(formData) => {
          void handleSave(formData);
        }}
        className="rounded-2xl border border-white/10 bg-zinc-950/50 p-6 space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-xl bg-white/5 flex items-center justify-center">
            <User className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Account Identity</h2>
            <p className="text-sm text-zinc-500">Manage your public profile details.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Display Name</span>
            <input
              name="displayName"
              defaultValue={user?.displayName ?? ""}
              placeholder="Anonymous Agent"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500/50"
              disabled={loading || !user}
            />
          </label>
          <label className="space-y-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">Profile Photo URL</span>
            <input
              name="photoURL"
              defaultValue={user?.photoURL ?? ""}
              placeholder="https://example.com/avatar.jpg"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none transition focus:border-indigo-500/50"
              disabled={loading || !user}
            />
          </label>
        </div>
      </form>

      <div className="grid gap-4">
        {sections.map((section, i) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="group rounded-2xl border border-white/10 bg-zinc-950/50 p-6 hover:bg-zinc-900/50 transition-all flex items-center justify-between gap-6"
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
            <button
              type="button"
              aria-pressed={preferences[section.key]}
              onClick={() => handleToggle(section.key)}
              className={`h-8 w-14 rounded-full border p-1 transition ${
                preferences[section.key]
                  ? "border-indigo-500/40 bg-indigo-500/20"
                  : "border-white/10 bg-zinc-900"
              }`}
            >
              <div
                className={`h-6 w-6 rounded-full transition ${
                  preferences[section.key] ? "translate-x-6 bg-indigo-400" : "translate-x-0 bg-zinc-700"
                }`}
              />
            </button>
          </motion.div>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <div className="text-sm text-zinc-400">
          {status ? (
            <span className={status.includes("successfully") ? "text-emerald-400" : "text-red-300"}>{status}</span>
          ) : (
            "Profile changes sync to Firebase Auth. Dashboard preferences are stored on this device."
          )}
        </div>
        <button
          type="button"
          onClick={() => {
            formRef.current?.requestSubmit();
          }}
          disabled={isSaving || loading || !user}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-60"
        >
          {isSaving ? <Save className="h-4 w-4 animate-pulse" /> : <CheckCircle2 className="h-4 w-4" />}
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="font-semibold text-red-400">Danger Zone</h3>
          <p className="text-sm text-zinc-500 mt-1">Permanently delete your account and all reported intelligence data.</p>
        </div>
        <button 
          onClick={async () => {
            if (!user) return;
            const confirm = window.confirm("Are you sure? This will PERMANENTLY delete your account and all your reports. This action cannot be undone.");
            if (!confirm) return;
            
            try {
              setIsSaving(true);
              const res = await fetch("/api/user/delete", {
                method: "POST",
                body: JSON.stringify({ userId: user.uid }),
              });
              if (res.ok) {
                window.location.href = "/";
              } else {
                alert("Failed to delete account. Please try again.");
              }
            } catch (err) {
              console.error(err);
              alert("An error occurred during account deletion.");
            } finally {
              setIsSaving(false);
            }
          }}
          disabled={isSaving || !user}
          className="px-6 py-2.5 rounded-xl bg-red-600/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-600 hover:text-white transition-all disabled:opacity-50"
        >
          {isSaving ? "Purging..." : "Delete Account"}
        </button>
      </div>
    </div>
  );
}
