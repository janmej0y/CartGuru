"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, TrendingUp, Sparkles, Percent, Truck, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const CONFIDENCE = 87;

const TIMELINE = [
  { label: "view_product", weight: "supporting" as const },
  { label: "compare_products", weight: "supporting" as const },
  { label: "add_to_cart", weight: "signal" as const },
  { label: "begin_checkout", weight: "signal" as const },
  { label: "abandon_checkout", weight: "signal" as const },
];

const RECOMMENDATIONS = [
  { icon: Truck, label: "Free shipping nudge", lift: "+18%" },
  { icon: Clock, label: "Urgency timer (cart hold)", lift: "+12%" },
  { icon: Percent, label: "Personal 10% coupon", lift: "+24%" },
];

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function HeroDashboardPreview() {
  const [ringProgress, setRingProgress] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(prefersReducedMotion());
    const timeout = setTimeout(() => setRingProgress(CONFIDENCE), 500);
    return () => clearTimeout(timeout);
  }, []);

  const circumference = 2 * Math.PI * 42;
  const offset = circumference - (ringProgress / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.9, delay: 0.35, ease: [0.21, 0.47, 0.32, 0.98] }}
      className="relative mx-auto w-full max-w-3xl"
    >
      <motion.div
        animate={reduced ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
        className="gradient-border glass relative overflow-hidden rounded-2xl p-6 shadow-glow sm:p-8"
      >
        {/* header row */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 text-muted-foreground">
              <ShoppingCart className="h-4 w-4" />
            </span>
            <div>
              <p className="font-mono text-[11px] text-muted-foreground">session_4f21a8</p>
              <p className="text-sm font-medium text-foreground">Nike Air Max 270 shopper</p>
            </div>
          </div>
          <Badge variant="purple">Cart Abandoner</Badge>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr]">
          {/* confidence ring */}
          <div className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-surface-2/50 p-5">
            <div className="relative h-28 w-28">
              <svg viewBox="0 0 96 96" className="h-28 w-28 -rotate-90">
                <circle cx="48" cy="48" r="42" fill="none" stroke="hsl(var(--border))" strokeWidth="7" />
                <motion.circle
                  cx="48"
                  cy="48"
                  r="42"
                  fill="none"
                  stroke="hsl(var(--accent-emerald))"
                  strokeWidth="7"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.4, delay: 0.6, ease: "easeOut" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-2xl font-semibold text-foreground">{CONFIDENCE}%</span>
                <span className="text-[10px] uppercase tracking-wide text-muted-foreground">confidence</span>
              </div>
            </div>
            <p className="text-center text-xs text-muted-foreground">
              Evidence strength: <span className="text-foreground">high</span>
            </p>
          </div>

          <div className="flex flex-col gap-4">
            {/* mini timeline */}
            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <TrendingUp className="h-3.5 w-3.5" /> Session timeline
              </p>
              <div className="flex items-center gap-1.5">
                {TIMELINE.map((point, i) => (
                  <motion.div
                    key={point.label}
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8 + i * 0.12, duration: 0.4 }}
                    className="group relative flex flex-1 flex-col items-center gap-1.5"
                  >
                    <div
                      className={
                        "h-2.5 w-2.5 rounded-full " +
                        (point.weight === "signal"
                          ? "bg-accent-purple shadow-glow-purple"
                          : "bg-muted-foreground/50")
                      }
                    />
                    {i < TIMELINE.length - 1 && (
                      <div className="absolute left-1/2 top-1.25 -z-10 h-px w-full bg-border" />
                    )}
                    <span className="hidden font-mono text-[9px] text-muted-foreground sm:block">
                      {point.label}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* recommendation chips */}
            <div>
              <p className="mb-2.5 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5" /> Recommended actions
              </p>
              <div className="flex flex-wrap gap-2">
                {RECOMMENDATIONS.map((rec, i) => (
                  <motion.div
                    key={rec.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 + i * 0.1, duration: 0.4 }}
                    className="flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-3 py-1.5 text-xs text-foreground"
                  >
                    <rec.icon className="h-3 w-3 text-accent-blue" />
                    {rec.label}
                    <span className="text-accent-emerald">{rec.lift}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* floating accent blobs behind the card */}
      <div
        aria-hidden
        className="absolute -right-10 -top-10 -z-10 h-40 w-40 rounded-full bg-accent-purple/20 blur-3xl animate-float-slow"
      />
      <div
        aria-hidden
        className="absolute -bottom-10 -left-10 -z-10 h-40 w-40 rounded-full bg-accent-blue/20 blur-3xl animate-float"
      />
    </motion.div>
  );
}
