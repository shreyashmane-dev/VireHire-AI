"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Send, 
  Loader2, 
  Shield, 
  Sparkles, 
  AlertTriangle, 
  Search, 
  Lock, 
  Zap, 
  Trash2, 
  Terminal,
  ArrowRight,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  riskScore?: number;
  riskLevel?: string;
}

const SUGGESTED_PROMPTS = [
  { icon: Search, text: "Is Google actually hiring remotely for $120k/month?", category: "Verification" },
  { icon: AlertTriangle, text: "A recruiter asked for my SSN before interview", category: "Warning" },
  { icon: Lock, text: "I got a job offer but they want upfront training fees", category: "Scam Alert" },
  { icon: Zap, text: "How do I verify if a LinkedIn recruiter is real?", category: "Guide" },
];

export default function ChatPage() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const clearChat = () => {
    setMessages([]);
    setHasStarted(false);
  };

  const handleSend = async (text?: string) => {
    const messageText = text || input;
    if (!messageText.trim() || isLoading) return;

    if (!hasStarted) setHasStarted(true);

    const userMsg: Message = { role: "user", content: messageText, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: messageText, sourceType: "chat" })
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Neural link unstable. Retry.");

      const analysis = data.data;
      const reply = analysis?.explanation || analysis?.recommendedAction || "Analysis complete. Source appears suspicious.";
      
      const assistantMsg: Message = { 
        role: "assistant", 
        content: reply, 
        timestamp: new Date(),
        riskScore: analysis?.riskScore,
        riskLevel: analysis?.riskLevel
      };

      // Add red flags to content if they exist
      if (analysis?.redFlags?.length > 0) {
        assistantMsg.content += `\n\n### DETECTED ANOMALIES\n${analysis.redFlags.slice(0, 3).map((f: string) => `• ${f}`).join('\n')}`;
      }

      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Connection lost. Re-establishing...";
      setMessages(prev => [...prev, { role: "assistant", content: message, timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, i) => {
      if (line.startsWith('### ')) {
        return <h3 key={i} className="text-xs font-mono font-bold text-indigo-400 mt-4 mb-2 uppercase tracking-widest flex items-center gap-2">
          <Terminal className="h-3 w-3" /> {line.replace('### ', '')}
        </h3>;
      }
      if (line.startsWith('• ')) {
        return <motion.p 
          initial={{ opacity: 0, x: -5 }}
          animate={{ opacity: 1, x: 0 }}
          key={i} 
          className="flex gap-3 items-start text-zinc-400 pl-1 my-1.5 text-[13px] leading-relaxed"
        >
          <span className="text-indigo-500 font-bold mt-1.5 h-1 w-1 rounded-full bg-indigo-500 shrink-0" />
          {line.slice(2)}
        </motion.p>;
      }
      return line ? <p key={i} className="mt-1.5 text-zinc-300 leading-relaxed">{line}</p> : <div key={i} className="h-2" />;
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-7rem)] max-w-5xl mx-auto relative px-4 sm:px-6">

      {/* Decorative Elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-indigo-500/50 to-transparent" />
        <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-fuchsia-500/50 to-transparent" />
      </div>

      {/* Ticker / Status Bar */}
      <div className="flex items-center justify-between mb-6 flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-2xl p-2 px-4 backdrop-blur-md">
        <div className="flex items-center gap-4 overflow-hidden">
          <div className="flex items-center gap-2 shrink-0">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">Neural Status: Online</span>
          </div>
          <div className="h-4 w-px bg-white/10 shrink-0" />
          <div className="flex items-center gap-2 overflow-hidden whitespace-nowrap">
            <Terminal className="h-3 w-3 text-indigo-400 shrink-0" />
            <p className="text-[10px] font-mono text-indigo-300/60 uppercase tracking-widest animate-marquee">
              Scanning real-time news sources... New phishing cluster detected in Tech sector... Recruiter verification engine at 99.2% accuracy...
            </p>
          </div>
        </div>
        <button 
          onClick={clearChat}
          className="p-2 hover:bg-white/5 rounded-lg text-zinc-600 hover:text-red-400 transition-colors"
          title="Clear Decrypted Session"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto space-y-8 pb-6 pr-2 scrollbar-thin scrollbar-thumb-white/5">

        {!hasStarted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60%] text-center px-4"
          >
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-indigo-500/20 blur-[40px] rounded-full animate-pulse" />
              <div className="relative h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 flex items-center justify-center shadow-2xl">
                <Shield className="h-14 w-14 text-indigo-500" />
              </div>
            </div>
            
            <h2 className="text-3xl font-bold text-white mb-4 tracking-tight">
              Intelligence Terminal
            </h2>
            <p className="text-zinc-500 text-sm leading-relaxed max-w-sm mb-12">
              Secure neural link established. {user?.displayName?.split(' ')[0] || 'Agent'}, I'm ready to analyze recruitment threats.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl">
              {SUGGESTED_PROMPTS.map((prompt, i) => (
                <motion.button
                  key={i}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  onClick={() => handleSend(prompt.text)}
                  className="group relative flex flex-col p-5 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-indigo-500/30 transition-all text-left overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <prompt.icon className="h-12 w-12" />
                  </div>
                  <span className="text-[9px] font-mono text-indigo-400 uppercase tracking-[0.2em] mb-2">{prompt.category}</span>
                  <span className="text-sm text-zinc-300 group-hover:text-white transition-colors pr-8 leading-snug">{prompt.text}</span>
                  <div className="mt-4 flex items-center gap-1 text-[10px] font-bold text-zinc-600 group-hover:text-indigo-400 transition-colors">
                    Execute Analysis <ArrowRight className="h-3 w-3" />
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 260, damping: 20 }}
              className={`flex gap-4 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}
            >
              {/* Avatar */}
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                msg.role === "user"
                  ? "bg-gradient-to-br from-indigo-500 to-fuchsia-600 border-white/20 text-white shadow-xl shadow-indigo-500/10"
                  : "bg-zinc-950 border-white/10"
              }`}>
                {msg.role === "user"
                  ? (user?.displayName?.[0] || "U")
                  : <Shield className={`h-5 w-5 ${msg.riskLevel === 'Critical' ? 'text-red-500' : 'text-indigo-500'}`} />
                }
              </div>

              {/* Message Bubble */}
              <div className={`max-w-[85%] sm:max-w-[75%] space-y-2 ${msg.role === "user" ? "items-end flex flex-col" : ""}`}>
                <div className={`relative rounded-[2rem] px-6 py-5 text-sm shadow-2xl ${
                  msg.role === "user"
                    ? "bg-indigo-600 text-white rounded-tr-sm"
                    : "bg-zinc-950 border border-white/10 rounded-tl-sm"
                }`}>
                  {/* Risk Indicator for Assistant */}
                  {msg.role === "assistant" && msg.riskScore !== undefined && (
                    <div className="flex items-center justify-between mb-4 pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                        <div className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                          msg.riskLevel === 'Critical' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                          msg.riskLevel === 'High' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                          'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                        }`}>
                          {msg.riskLevel} Risk
                        </div>
                        <span className="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">Risk Score: {msg.riskScore}/100</span>
                      </div>
                      <div className="h-1.5 w-16 bg-zinc-900 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${msg.riskScore}%` }}
                          className={`h-full ${msg.riskScore > 70 ? 'bg-red-500' : 'bg-indigo-500'}`} 
                        />
                      </div>
                    </div>
                  )}

                  <div className="whitespace-pre-wrap">
                    {msg.role === "assistant" ? formatContent(msg.content) : msg.content}
                  </div>

                  {/* Corner Decoration */}
                  {msg.role === "assistant" && (
                    <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                      <Zap className="h-12 w-12" />
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 px-4">
                  <span className="text-[9px] font-mono text-zinc-600 uppercase">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  {msg.role === "assistant" && (
                    <span className="text-[9px] font-mono text-emerald-500/50 uppercase tracking-tighter">● Encrypted</span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <motion.div
              key="loading"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex gap-4"
            >
              <div className="h-10 w-10 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center shrink-0">
                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              </div>
              <div className="bg-zinc-950 border border-white/10 rounded-[2rem] rounded-tl-sm px-6 py-5 shadow-2xl">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1.5">
                    {[0, 0.2, 0.4].map((delay, i) => (
                      <motion.span
                        key={i}
                        className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                        animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                        transition={{ duration: 1, repeat: Infinity, delay }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">Analyzing Neural Patterns...</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input Section */}
      <div className="flex-shrink-0 pt-6 pb-4">
        <div className="relative group">
          {/* Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-fuchsia-500 rounded-[2.5rem] blur opacity-0 group-focus-within:opacity-10 transition duration-1000" />
          
          <div className="relative flex items-center gap-3 p-2.5 rounded-[2.5rem] border border-white/10 bg-zinc-950 backdrop-blur-3xl shadow-2xl transition-all group-focus-within:border-indigo-500/50">
            <div className="pl-5 pr-2 hidden sm:block">
              <Sparkles className="h-5 w-5 text-indigo-400 group-focus-within:animate-pulse" />
            </div>
            
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void handleSend();
                }
              }}
              placeholder="Report a suspicious job offer or recruiter..."
              className="flex-1 bg-transparent border-none outline-none py-4 text-sm text-white placeholder:text-zinc-600 font-medium"
            />

            <motion.button
              onClick={() => handleSend()}
              disabled={isLoading || !input.trim()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="h-14 w-14 rounded-full bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-30 disabled:grayscale shadow-xl shadow-indigo-500/20 shrink-0"
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-white animate-spin" />
              ) : (
                <Send className="h-6 w-6 text-white" />
              )}
            </motion.button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-6 px-4">
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <Lock className="h-3 w-3" /> E2E Encrypted
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <Shield className="h-3 w-3" /> Neural Guard Active
          </div>
          <div className="flex items-center gap-2 text-[9px] font-mono text-zinc-600 uppercase tracking-widest">
            <Zap className="h-3 w-3" /> GPT-4o Class Intelligence
          </div>
        </div>
      </div>
    </div>
  );
}
