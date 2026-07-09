"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Loader2, Sparkles, TrendingUp, AlertTriangle } from "lucide-react";
import type { SessionAnalysis } from "@/types/shopper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn, formatPercent } from "@/lib/utils";

interface SimulatorResultPanelProps {
  analysis: SessionAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  eventCount: number;
}

const URGENCY_VARIANT: Record<string, "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
  critical: "danger",
};

function confidenceColor(confidence: number) {
  if (confidence >= 75) return "text-confidence-high";
  if (confidence >= 45) return "text-confidence-mid";
  return "text-confidence-low";
}

export function SimulatorResultPanel({ analysis, isAnalyzing, error, eventCount }: SimulatorResultPanelProps) {
  return (
    <Card className="sticky top-6 overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between gap-2 pb-4">
        <CardTitle className="flex items-center gap-2 text-base">
          <Sparkles className="h-4 w-4 text-accent-purple" />
          Live result
        </CardTitle>
        <AnimatePresence>
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 text-xs text-muted-foreground"
            >
              <Loader2 className="h-3.5 w-3.5 animate-spin text-accent-purple" />
              <span className="shimmer-text">Re-analyzing…</span>
            </motion.div>
          )}
        </AnimatePresence>
      </CardHeader>

      <CardContent className="space-y-5">
        {eventCount === 0 && (
          <div className="rounded-xl border border-dashed border-border bg-surface-2/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">
              Add at least one event to run the AI classifier.
            </p>
          </div>
        )}

        {error && (
          <div className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {!error && eventCount > 0 && !analysis && !isAnalyzing && (
          <div className="rounded-xl border border-dashed border-border bg-surface-2/40 p-6 text-center">
            <p className="text-sm text-muted-foreground">Waiting for the first analysis run…</p>
          </div>
        )}

        <AnimatePresence mode="wait">
          {analysis && (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className={cn("space-y-5", isAnalyzing && "opacity-60")}
            >
              <div>
                <p className="mb-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">Shopper state</p>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="purple" className="font-display text-sm">
                    {analysis.shopperState}
                  </Badge>
                  <Badge variant={URGENCY_VARIANT[analysis.urgency] ?? "secondary"}>
                    {analysis.urgency} urgency
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Confidence</p>
                  <p className={cn("font-display text-2xl font-semibold", confidenceColor(analysis.confidence))}>
                    {formatPercent(analysis.confidence)}
                  </p>
                </div>
                <div>
                  <p className="mb-1 text-[11px] uppercase tracking-wide text-muted-foreground">Expected lift</p>
                  <p className="flex items-center gap-1 font-display text-2xl font-semibold text-accent-emerald">
                    <TrendingUp className="h-4 w-4" />
                    {analysis.expectedLift}
                  </p>
                </div>
              </div>

              <div>
                <p className="mb-1.5 text-[11px] uppercase tracking-wide text-muted-foreground">
                  Top recommendation
                </p>
                <p className="text-sm leading-relaxed text-foreground">
                  {analysis.recommendedAction}
                </p>
              </div>

              <Button asChild variant="secondary" className="w-full">
                <Link href="/analyzer">
                  View full analysis
                  <ArrowUpRight className="h-4 w-4" />
                </Link>
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
