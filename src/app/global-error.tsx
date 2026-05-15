"use client";

import { AlertOctagon, RefreshCw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  void error;

  return (
    <html lang="en">
      <body className="bg-black text-white antialiased">
        <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-red-600/10 rounded-full blur-[128px] pointer-events-none" />
          
          <div className="relative z-10 bg-zinc-950/80 backdrop-blur-md max-w-xl w-full p-8 rounded-2xl border border-red-500/20 text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <AlertOctagon className="w-10 h-10 text-red-500" />
              </div>
            </div>
            
            <div>
              <h1 className="text-2xl font-bold mb-2">Critical Core Failure</h1>
              <p className="text-zinc-400">
                A catastrophic error occurred at the root level of the intelligence terminal.
              </p>
            </div>
            
            <div className="flex justify-center pt-4">
              <button
                onClick={() => reset()}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(220,38,38,0.3)]"
              >
                <RefreshCw className="w-5 h-5" />
                Hard Reset Application
              </button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
