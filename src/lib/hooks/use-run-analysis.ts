"use client";

import { useCallback } from "react";
import { toast } from "sonner";
import { useSessionStore } from "@/lib/store/session-store";
import type { SessionEvent } from "@/types/events";

/**
 * Shared fetch-to-/api/analyze flow. Used by the Analyzer page (direct run)
 * and the History page (duplicate action) so both stay in lockstep with the
 * store instead of drifting into two separate fetch implementations.
 */
export function useRunAnalysis() {
  const setAnalyzing = useSessionStore((s) => s.setAnalyzing);
  const setAnalysis = useSessionStore((s) => s.setAnalysis);
  const setError = useSessionStore((s) => s.setError);

  const runAnalysis = useCallback(
    async (events: SessionEvent[]) => {
      setAnalyzing(true);
      setError(null);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: crypto.randomUUID(), events }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.error ?? "Failed to analyze session");
        }
        setAnalysis(data.analysis);
        return data.analysis;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to analyze session";
        setError(message);
        toast.error(message);
        return null;
      } finally {
        setAnalyzing(false);
      }
    },
    [setAnalyzing, setAnalysis, setError]
  );

  return { runAnalysis };
}
