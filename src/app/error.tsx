"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertOctagon, RefreshCw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application Error:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] pointer-events-none" />
      
      <div className="relative z-10 glass max-w-xl w-full p-8 rounded-2xl border border-red-500/20 text-center space-y-6">
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
            <AlertOctagon className="w-10 h-10 text-red-500" />
          </div>
        </div>
        
        <div>
          <h1 className="text-2xl font-bold mb-2">System Fault Detected</h1>
          <p className="text-zinc-400">
            The terminal encountered an unexpected error while processing your request. 
            Our neural nets have logged the anomaly.
          </p>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-left overflow-auto max-h-32 text-xs font-mono text-red-400">
            {error.message}
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 transition-all w-full sm:w-auto shadow-[0_0_15px_rgba(220,38,38,0.3)]"
          >
            <RefreshCw className="w-5 h-5" />
            Reboot Subsystem
          </button>
          <Link 
            href="/"
            className="px-6 py-3 rounded-xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-white font-medium flex items-center justify-center gap-2 transition-all w-full sm:w-auto"
          >
            <Home className="w-5 h-5" />
            Return Home
          </Link>
        </div>
      </div>
      
      <div className="absolute bottom-8 left-0 w-full text-center">
        <span className="text-xs font-mono text-zinc-600 uppercase tracking-widest">
          ERROR_CODE: 500_SYSTEM_FAULT // VERIHIRE_OS
        </span>
      </div>
    </div>
  );
}
