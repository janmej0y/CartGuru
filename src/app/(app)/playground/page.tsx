"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { FlaskConical, Send, Sparkles, Trash2, ArrowUpRight } from "lucide-react";
import { toast } from "sonner";
import { useSessionStore } from "@/lib/store/session-store";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatMessage } from "@/components/playground/chat-message";
import { TypingIndicator } from "@/components/playground/typing-indicator";
import { SuggestedPrompts } from "@/components/playground/suggested-prompts";

export default function PlaygroundPage() {
  const events = useSessionStore((s) => s.events);
  const analysis = useSessionStore((s) => s.analysis);
  const sessionLabel = useSessionStore((s) => s.sessionLabel);
  const chatMessages = useSessionStore((s) => s.chatMessages);
  const addChatMessage = useSessionStore((s) => s.addChatMessage);
  const clearChat = useSessionStore((s) => s.clearChat);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [failedIndex, setFailedIndex] = useState<number | null>(null);

  const scrollEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chatMessages, isSending]);

  async function sendMessage(question: string) {
    const trimmed = question.trim();
    if (!trimmed || isSending) return;

    setInput("");
    setFailedIndex(null);
    addChatMessage({ role: "user", content: trimmed, createdAt: new Date().toISOString() });
    setIsSending(true);

    try {
      const history = chatMessages.map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          events,
          analysis: analysis ?? undefined,
          history,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "Failed to get a response");
      }
      addChatMessage({ role: "assistant", content: data.answer, createdAt: new Date().toISOString() });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to get a response";
      toast.error(message);
      addChatMessage({
        role: "assistant",
        content: `I couldn't process that: ${message}. Try again in a moment.`,
        createdAt: new Date().toISOString(),
      });
      setFailedIndex(chatMessages.length + 1);
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    sendMessage(input);
  }

  const isEmpty = chatMessages.length === 0;

  return (
    <div className="flex h-screen max-h-screen flex-col">
      <div className="border-b border-border bg-surface/60 px-6 py-4 backdrop-blur-xl lg:px-10">
        <div className="mx-auto flex max-w-4xl flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
              <FlaskConical className="h-4.5 w-4.5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-lg font-semibold tracking-tight leading-tight">AI Playground</h1>
              <p className="text-xs text-muted-foreground">Ask anything about the current session</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 rounded-full border border-border bg-surface-2/60 px-3 py-1.5 text-xs">
              <span className="text-muted-foreground">Session:</span>
              <span className="font-medium text-foreground">{sessionLabel}</span>
              {analysis && (
                <Badge variant="purple" className="ml-1">
                  {analysis.shopperState}
                </Badge>
              )}
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/analyzer">
                Switch session
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
            {chatMessages.length > 0 && (
              <Button variant="ghost" size="sm" onClick={clearChat}>
                <Trash2 className="h-4 w-4" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div className="mx-auto max-w-4xl px-6 py-8 lg:px-10">
            {isEmpty ? (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col items-center gap-6 py-16 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div className="max-w-md space-y-2">
                  <h2 className="font-display text-xl font-semibold">
                    {analysis ? "Ask me anything about this shopper" : "No analysis yet — but you can still chat"}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {analysis
                      ? "I have full context on this session's events, classification, and recommendations. Ask about the reasoning, alternative strategies, or what-if scenarios."
                      : "Head to the Analyzer to classify a session first for grounded answers, or just start asking — I'll do my best with the raw event stream."}
                  </p>
                  {!analysis && (
                    <Button asChild variant="outline" size="sm" className="mt-2">
                      <Link href="/analyzer">
                        Go to Analyzer
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  )}
                </div>
                <div className="w-full max-w-lg">
                  <SuggestedPrompts
                    shopperState={analysis?.shopperState ?? null}
                    onSelect={(p) => sendMessage(p)}
                  />
                </div>
              </motion.div>
            ) : (
              <div className="space-y-5">
                <AnimatePresence initial={false}>
                  {chatMessages.map((msg, i) => (
                    <ChatMessage
                      key={`${msg.createdAt}-${i}`}
                      role={msg.role}
                      content={msg.content}
                      isError={i === failedIndex}
                    />
                  ))}
                </AnimatePresence>
                <AnimatePresence>{isSending && <TypingIndicator />}</AnimatePresence>
                <div ref={scrollEndRef} />
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      <div className="border-t border-border bg-surface/60 px-6 py-4 backdrop-blur-xl lg:px-10">
        <div className="mx-auto max-w-4xl">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this shopper's behavior, risks, or next best action…"
              disabled={isSending}
              className="h-11"
            />
            <Button type="submit" size="icon" className="h-11 w-11 shrink-0" disabled={isSending || !input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
