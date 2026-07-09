"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BrainCircuit } from "lucide-react";
import { useSessionStore } from "@/lib/store/session-store";
import { useRunAnalysis } from "@/lib/hooks/use-run-analysis";
import { SessionInputPanel } from "@/components/analyzer/session-input-panel";
import { ThinkingIndicator } from "@/components/analyzer/thinking-indicator";
import { EmptyState } from "@/components/analyzer/empty-state";
import { ErrorState } from "@/components/analyzer/error-state";
import { AiOutputCard } from "@/components/analyzer/ai-output-card";

export default function AnalyzerPage() {
  const events = useSessionStore((s) => s.events);
  const analysis = useSessionStore((s) => s.analysis);
  const isAnalyzing = useSessionStore((s) => s.isAnalyzing);
  const error = useSessionStore((s) => s.error);
  const loadRandomSession = useSessionStore((s) => s.loadRandomSession);
  const { runAnalysis } = useRunAnalysis();

  const handleTrySample = () => {
    loadRandomSession();
  };

  const handleRetry = () => {
    if (events.length > 0) {
      runAnalysis(events);
    }
  };

  let rightPanelKey: string;
  if (isAnalyzing) rightPanelKey = "loading";
  else if (error) rightPanelKey = "error";
  else if (analysis) rightPanelKey = "result";
  else rightPanelKey = "empty";

  return (
    <div className="dot-grid relative min-h-[calc(100vh-4rem)] px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-aurora-1 opacity-60" aria-hidden />
      <div className="absolute inset-0 bg-aurora-2 opacity-40" aria-hidden />

      <div className="relative mx-auto max-w-[1400px]">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-accent-purple/30 bg-accent-purple/10">
            <BrainCircuit className="h-5 w-5 text-accent-purple" />
          </div>
          <div>
            <h1 className="font-display text-2xl font-bold text-foreground">Session Analyzer</h1>
            <p className="text-sm text-muted-foreground">
              Feed in a shopper&apos;s event stream and get an AI-backed classification, reasoning trail, and
              personalization plan in seconds.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[420px_1fr] lg:items-start">
          <div className="lg:sticky lg:top-6">
            <SessionInputPanel onAnalyze={runAnalysis} isAnalyzing={isAnalyzing} />
          </div>

          <div className="min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={rightPanelKey}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
              >
                {isAnalyzing && <ThinkingIndicator />}
                {!isAnalyzing && error && <ErrorState message={error} onRetry={handleRetry} />}
                {!isAnalyzing && !error && analysis && <AiOutputCard analysis={analysis} events={events} />}
                {!isAnalyzing && !error && !analysis && (
                  <EmptyState onTrySample={handleTrySample} onRandomSession={loadRandomSession} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
