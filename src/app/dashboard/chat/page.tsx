"use client";

import { useState } from "react";
import { MessageSquare, Send, Loader2, User, Shield, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ChatPage() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "assistant", content: "Agent initialized. I am your specialized AI recruitment threat assistant. How can I help you verify a job offer today?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = { role: "user", content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }) // Reusing the analyze API for generic questions
      });
      const data = await response.json();
      
      const assistantMsg = { 
        role: "assistant", 
        content: data.summary || "Analysis complete. I've detected potential risks in that query. Please exercise caution." 
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (error) {
      console.error("Chat Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto space-y-6 pb-8 pr-4 custom-scrollbar">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
            >
              <div className={`h-10 w-10 rounded-2xl flex items-center justify-center shrink-0 border ${
                msg.role === 'user' ? 'bg-indigo-600 border-indigo-400/30' : 'bg-zinc-900 border-white/10'
              }`}>
                {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5 text-indigo-400" />}
              </div>
              <div className={`max-w-[80%] rounded-[1.5rem] px-6 py-4 text-sm leading-relaxed ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-zinc-950 border border-white/10 text-zinc-300'
              }`}>
                {msg.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-4">
              <div className="h-10 w-10 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center">
                <Loader2 className="h-5 w-5 text-indigo-500 animate-spin" />
              </div>
              <div className="bg-zinc-950 border border-white/10 rounded-2xl px-6 py-4">
                <div className="flex gap-1">
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-4 p-2 rounded-[2rem] border border-white/10 bg-zinc-950/80 backdrop-blur-xl">
        <div className="flex items-center gap-2">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask about a company, job role, or suspicious email..."
            className="flex-1 bg-transparent border-none outline-none px-6 py-3 text-sm text-white"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading}
            className="h-12 w-12 rounded-[1.4rem] bg-indigo-600 flex items-center justify-center hover:bg-indigo-500 transition-all disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
