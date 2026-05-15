import Link from "next/link";
import { ShieldAlert, Home, ChevronRight } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col bg-black text-white">
      <Navbar />
      
      <main className="flex-1 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-600/10 rounded-full blur-[128px] pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <div className="relative inline-block">
            <div className="text-[150px] font-bold leading-none bg-clip-text text-transparent bg-gradient-to-b from-white to-white/10 select-none">
              404
            </div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full flex justify-center">
              <ShieldAlert className="w-24 h-24 text-indigo-500 animate-pulse drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
            </div>
          </div>
          
          <div>
            <h1 className="text-3xl font-bold mb-4">Signal Lost: Sector Not Found</h1>
            <p className="text-zinc-400 text-lg max-w-lg mx-auto">
              The intelligence sector you&apos;re attempting to access does not exist or has been redacted from the terminal.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              href="/"
              className="px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-medium flex items-center justify-center gap-2 transition-all w-full sm:w-auto neon-glow"
            >
              <Home className="w-5 h-5" />
              Return to Terminal
            </Link>
            <Link 
              href="/dashboard"
              className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-medium flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
            >
              Access Dashboard
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-0 w-full text-center">
          <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
            ERROR_CODE: 404_NOT_FOUND // VERIHIRE_OS
          </span>
        </div>
      </main>
    </div>
  );
}
