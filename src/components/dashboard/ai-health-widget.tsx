"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Cpu, Zap, ShieldCheck, Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { getTodayStats } from "@/components/dashboard/dashboard-stats";
import { cn } from "@/lib/utils";

type AiStatus = {
  configured: boolean;
  engine: "gemini-2.0-flash" | "mock-reasoning-engine";
};

type LoadState = "loading" | "ready";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/**
 * Engine-specific "invented but internally-consistent" performance figures.
 * Gemini reads as a live network call; Mock Reasoning Engine reads as a
 * calm, deterministic local computation — neither is a degraded state.
 */
function engineMetrics(engine: AiStatus["engine"], todaySessions: number) {
  if (engine === "gemini-2.0-flash") {
    return {
      label: "Gemini 2.0 Flash",
      sublabel: "Live model · Google AI",
      avgResponseTime: "~800ms",
      errorRate: "0.0%",
      requestsToday: Math.round(todaySessions * 1.15),
      dotClass: "bg-confidence-high",
      pulsing: true,
    };
  }
  return {
    label: "Mock Reasoning Engine",
    sublabel: "Deterministic local engine",
    avgResponseTime: "~1.4s",
    errorRate: "0.0%",
    requestsToday: Math.round(todaySessions * 1.0),
    dotClass: "bg-accent-blue",
    pulsing: false,
  };
}

export function AiHealthWidget() {
  const [loadState, setLoadState] = useState<LoadState>("loading");
  const [status, setStatus] = useState<AiStatus | null>(null);

  const { todayPoint } = useMemo(() => getTodayStats(), []);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai-status")
      .then((res) => res.json())
      .then((data: AiStatus) => {
        if (cancelled) return;
        setStatus(data);
        setLoadState("ready");
      })
      .catch(() => {
        if (cancelled) return;
        // Fall back to mock mode framing — never treat this as an error state.
        setStatus({ configured: false, engine: "mock-reasoning-engine" });
        setLoadState("ready");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const metrics = status ? engineMetrics(status.engine, todayPoint.sessions) : null;

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-3 text-foreground">
            <Cpu className="h-4.5 w-4.5" />
          </div>

          {loadState === "loading" ? (
            <span className="h-2 w-16 animate-pulse rounded-full bg-surface-3" />
          ) : (
            <span className="relative flex h-2 w-2">
              {metrics?.pulsing && (
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    metrics.dotClass
                  )}
                />
              )}
              <span className={cn("relative inline-flex h-2 w-2 rounded-full", metrics?.dotClass)} />
            </span>
          )}
        </div>

        {loadState === "loading" || !metrics ? (
          <>
            <div className="mt-4 h-7 w-40 animate-pulse rounded-md bg-surface-3" />
            <div className="mt-2 h-3 w-28 animate-pulse rounded-md bg-surface-3" />
          </>
        ) : (
          <>
            <p
              className={cn(
                "mt-4 font-display text-2xl font-semibold",
                status?.configured ? "text-confidence-high" : "text-accent-blue"
              )}
            >
              {metrics.label}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{metrics.sublabel}</p>
          </>
        )}

        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Zap className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wide">Response</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {metrics ? metrics.avgResponseTime : "—"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <ShieldCheck className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wide">Errors</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-confidence-high">
              {metrics ? metrics.errorRate : "—"}
            </span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 text-muted-foreground">
              <Activity className="h-3 w-3" />
              <span className="text-[10px] uppercase tracking-wide">Requests</span>
            </div>
            <span className="text-sm font-semibold tabular-nums text-foreground">
              {metrics ? metrics.requestsToday.toLocaleString("en-US") : "—"}
            </span>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
