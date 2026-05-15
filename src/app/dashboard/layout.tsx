"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  Activity,
  Flag,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  Shield,
  UserCircle,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Analyze", href: "/dashboard/analyze" },
  { icon: Activity, label: "Threat Feed", href: "/dashboard/threat-feed" },
  { icon: Users, label: "Community Thread", href: "/dashboard/community" },
  { icon: Flag, label: "Reports", href: "/dashboard/reports" },
  { icon: MessageSquare, label: "AI Assistant", href: "/dashboard/chat" },
  { icon: UserCircle, label: "Profile", href: "/dashboard/profile" },
  { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

type SidebarContentProps = {
  onNavigate: () => void;
  pathname: string;
};

function SidebarContent({ onNavigate, pathname }: SidebarContentProps) {
  const { logout } = useAuth();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    if (isLoggingOut) {
      return;
    }

    setIsLoggingOut(true);
    const success = await logout();
    setIsLoggingOut(false);

    if (success) {
      onNavigate();
      router.replace("/login");
    }
  };

  return (
    <>
      <div className="flex items-center gap-2 px-6 py-6">
        <Shield className="h-6 w-6 text-indigo-500" />
        <span className="text-lg font-semibold">VeriHire AI</span>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-2">
        {sidebarItems.map((item) => (
          <Link
            key={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-colors",
              pathname === item.href
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:bg-zinc-900 hover:text-white"
            )}
            href={item.href}
            onClick={onNavigate}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={() => void handleLogout()}
          className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium text-zinc-400 transition-colors hover:bg-zinc-900 hover:text-white"
          type="button"
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          {isLoggingOut ? "Logging out..." : "Logout"}
        </button>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-black text-white">
      <aside className="hidden w-72 border-r border-white/10 bg-zinc-950 lg:flex lg:flex-col">
        <SidebarContent onNavigate={() => setIsOpen(false)} pathname={pathname} />
      </aside>

      {isOpen ? (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            aria-label="Close sidebar backdrop"
            className="absolute inset-0 bg-black/70"
            onClick={() => setIsOpen(false)}
            type="button"
          />
          <aside className="relative flex h-full w-[88vw] max-w-xs flex-col border-r border-white/10 bg-zinc-950">
            <div className="flex items-center justify-between px-6 py-6">
              <div className="flex items-center gap-2">
                <Shield className="h-6 w-6 text-indigo-500" />
                <span className="text-lg font-semibold">VeriHire AI</span>
              </div>
              <button
                aria-label="Close sidebar"
                className="rounded-xl border border-white/10 p-2 text-zinc-300"
                onClick={() => setIsOpen(false)}
                type="button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent onNavigate={() => setIsOpen(false)} pathname={pathname} />
          </aside>
        </div>
      ) : null}

      <main className="relative flex-1 overflow-y-auto bg-black">
        <div className="absolute right-0 top-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-[140px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-[140px] pointer-events-none" />

        <header className="sticky top-0 z-30 border-b border-white/10 bg-black/70 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6">
            <button
              aria-label="Open sidebar"
              className="rounded-xl border border-white/10 bg-white/[0.03] p-2 text-zinc-300"
              onClick={() => setIsOpen(true)}
              type="button"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="text-sm uppercase tracking-[0.24em] text-zinc-500">
              Dashboard
            </div>
            <div className="w-9" />
          </div>
        </header>

        <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
