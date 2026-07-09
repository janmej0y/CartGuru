"use client";

import { motion } from "framer-motion";
import { Database, Cpu, FileJson2, GitBranch, ArrowRight } from "lucide-react";
import { ScrollReveal, staggerContainer, staggerItem } from "@/components/landing/scroll-reveal";
import { Badge } from "@/components/ui/badge";

const PIPELINE = [
  {
    icon: Database,
    title: "Event Stream Ingestion",
    description:
      "Raw session events — page views, cart mutations, coupon attempts, checkout steps — are normalized into a typed, ordered timeline before anything touches a model.",
  },
  {
    icon: Cpu,
    title: "Dual-Path Reasoning Layer",
    description:
      "If GEMINI_API_KEY is set, the timeline is sent to Gemini with a grounded prompt. If it isn't, a deterministic rule-based engine runs the same contract locally — same output shape, same UI, zero downtime demoing.",
  },
  {
    icon: FileJson2,
    title: "Structured Classification Contract",
    description:
      "Either path returns the identical typed JSON: shopper state, confidence, evidence strings, timeline weighting, and rejected alternatives — never freeform text the UI has to parse or guess at.",
  },
  {
    icon: GitBranch,
    title: "Personalization Recommendations",
    description:
      "Confidence and evidence flow straight into ranked, effort-scored actions with expected lift — recommendations are a function of the reasoning output, not a separate hardcoded lookup.",
  },
] as const;

export function ArchitectureSection() {
  return (
    <section className="relative py-28">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-[0.4]" aria-hidden />
      <div className="container relative">
        <ScrollReveal className="mx-auto mb-6 max-w-2xl text-center">
          <Badge variant="secondary" className="mx-auto mb-4 w-fit font-mono">
            <span className="text-accent-emerald">$</span> system design
          </Badge>
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            A reasoning pipeline built to never go dark
          </h2>
          <p className="mt-4 text-muted-foreground">
            Confidence, evidence, and rejected alternatives are first-class fields in the output contract —
            not something bolted on after the fact for a demo.
          </p>
        </ScrollReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="relative mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-4 md:gap-4"
        >
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[38px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          {PIPELINE.map((stage, i) => (
            <motion.div key={stage.title} variants={staggerItem} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-border bg-surface shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-emerald/20 to-accent-blue/20 text-accent-emerald">
                  <stage.icon className="h-5 w-5" />
                </div>
              </div>
              <span className="mb-2 font-mono text-xs text-muted-foreground">0{i + 1}</span>
              <h3 className="font-display text-base font-semibold text-foreground">{stage.title}</h3>
              <p className="mt-2 max-w-[240px] text-sm leading-relaxed text-muted-foreground">{stage.description}</p>

              {i < PIPELINE.length - 1 && (
                <div className="mt-4 md:hidden">
                  <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground/50" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        <ScrollReveal delay={0.15} className="mx-auto mt-16 max-w-3xl">
          <div className="gradient-border rounded-2xl border border-border bg-surface-2/50 p-6 font-mono text-xs leading-relaxed text-muted-foreground sm:p-8 sm:text-sm">
            <div className="mb-3 flex items-center gap-2 text-muted-foreground">
              <span className="h-2.5 w-2.5 rounded-full bg-confidence-low/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-confidence-mid/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-confidence-high/70" />
              <span className="ml-2 text-[11px] uppercase tracking-wide text-muted-foreground/70">
                lib/ai/analyze.ts
              </span>
            </div>
            <pre className="overflow-x-auto whitespace-pre">
{`if (isGeminiConfigured()) {
  try {
    return await generateJSON(prompt);       // Gemini, grounded on the event timeline
  } catch {
    return runMockAnalysis(events);          // automatic fallback, same output shape
  }
}
return runMockAnalysis(events);              // fully demoable with zero API key`}
            </pre>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
