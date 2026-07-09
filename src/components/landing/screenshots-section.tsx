"use client";

import { motion } from "framer-motion";
import { BarChart3, History, BrainCircuit, Star, Search } from "lucide-react";
import { ScrollReveal, staggerContainer, staggerItem } from "@/components/landing/scroll-reveal";
import { Badge } from "@/components/ui/badge";

function BrowserChrome({ url }: { url: string }) {
  return (
    <div className="flex items-center gap-3 border-b border-border bg-surface-2/60 px-4 py-2.5">
      <div className="flex gap-1.5" aria-hidden>
        <span className="h-2.5 w-2.5 rounded-full bg-confidence-low/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-confidence-mid/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-confidence-high/70" />
      </div>
      <div className="flex flex-1 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 py-1">
        <Search className="h-3 w-3 text-muted-foreground" />
        <span className="truncate font-mono text-[11px] text-muted-foreground">{url}</span>
      </div>
    </div>
  );
}

function AnalyticsMockup() {
  const bars = [38, 62, 45, 80, 55, 70, 34];
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <BrowserChrome url="cartguru.app/analytics" />
      <div className="p-5">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
              <BarChart3 className="h-3.5 w-3.5" />
            </span>
            <p className="text-sm font-medium text-foreground">Shopper state distribution</p>
          </div>
          <Badge variant="emerald">Live</Badge>
        </div>
        <div className="flex h-28 items-end gap-2">
          {bars.map((h, i) => (
            <motion.div
              key={i}
              initial={{ height: 0 }}
              whileInView={{ height: `${h}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: "easeOut" }}
              className="flex-1 rounded-t-md bg-gradient-to-t from-accent-blue/70 to-accent-purple/60"
            />
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between font-mono text-[10px] text-muted-foreground">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>
    </div>
  );
}

const HISTORY_ROWS = [
  { id: "session_4f21a8", state: "Cart Abandoner", confidence: 87, variant: "purple" as const },
  { id: "session_9c73e2", state: "High Intent Buyer", confidence: 94, variant: "emerald" as const },
  { id: "session_1a55d0", state: "Discount Seeker", confidence: 71, variant: "blue" as const },
];

function HistoryMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <BrowserChrome url="cartguru.app/history" />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
            <History className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm font-medium text-foreground">Saved analyses</p>
        </div>
        <div className="flex flex-col gap-2">
          {HISTORY_ROWS.map((row, i) => (
            <motion.div
              key={row.id}
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center justify-between rounded-lg border border-border bg-surface-2/50 px-3 py-2.5"
            >
              <div className="flex items-center gap-2.5">
                <Star className="h-3.5 w-3.5 text-confidence-mid/80" fill="currentColor" fillOpacity={0.3} />
                <div>
                  <p className="font-mono text-[10px] text-muted-foreground">{row.id}</p>
                  <p className="text-xs font-medium text-foreground">{row.state}</p>
                </div>
              </div>
              <Badge variant={row.variant}>{row.confidence}%</Badge>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SIGNALS = [
  { label: "abandon_checkout", weight: "signal" as const },
  { label: "compare_products", weight: "supporting" as const },
  { label: "view_reviews", weight: "supporting" as const },
  { label: "scroll_footer", weight: "noise" as const },
];

function ReasoningMockup() {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <BrowserChrome url="cartguru.app/session/4f21a8" />
      <div className="p-5">
        <div className="mb-4 flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-accent-emerald/10 text-accent-emerald">
            <BrainCircuit className="h-3.5 w-3.5" />
          </span>
          <p className="text-sm font-medium text-foreground">AI reasoning panel</p>
        </div>
        <p className="mb-3 text-xs leading-relaxed text-muted-foreground">
          Weighted 4 signals against 2 noise events before settling on{" "}
          <span className="text-foreground">Cart Abandoner</span>.
        </p>
        <div className="flex flex-col gap-1.5">
          {SIGNALS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="flex items-center gap-2 rounded-md bg-surface-2/50 px-2.5 py-1.5 font-mono text-[11px]"
            >
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " +
                  (s.weight === "signal"
                    ? "bg-accent-purple"
                    : s.weight === "supporting"
                      ? "bg-accent-blue"
                      : "bg-muted-foreground/40")
                }
              />
              <span className="text-foreground">{s.label}</span>
              <span className="ml-auto text-muted-foreground">{s.weight}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ScreenshotsSection() {
  return (
    <section className="relative py-28">
      <div className="container">
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Every screen, built on the same evidence
          </h2>
          <p className="mt-4 text-muted-foreground">
            Analytics, history, and reasoning all read from the same structured classification output —
            no screen is guessing independently.
          </p>
        </ScrollReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="mx-auto grid max-w-5xl grid-cols-1 gap-6 lg:grid-cols-[1.15fr_0.85fr]"
        >
          <motion.div variants={staggerItem} className="lg:row-span-2">
            <AnalyticsMockup />
          </motion.div>
          <motion.div variants={staggerItem}>
            <HistoryMockup />
          </motion.div>
          <motion.div variants={staggerItem}>
            <ReasoningMockup />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
