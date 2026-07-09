"use client";

import { motion } from "framer-motion";
import {
  Fingerprint,
  Gauge,
  BrainCircuit,
  Sparkles,
  FlaskConical,
  LineChart,
} from "lucide-react";
import { ScrollReveal, staggerContainer, staggerItem } from "@/components/landing/scroll-reveal";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Fingerprint,
    title: "Shopper State Classification",
    description:
      "Every session is classified into one of 15 shopper states — from Cart Abandoner to VIP Customer — based on real behavioral evidence.",
    accent: "purple",
  },
  {
    icon: Gauge,
    title: "Confidence & Evidence Scoring",
    description:
      "Each classification ships with a calibrated confidence score and the exact evidence that produced it, so you know when to trust the call.",
    accent: "emerald",
  },
  {
    icon: BrainCircuit,
    title: "AI Reasoning Panel",
    description:
      "Full explainability: observed behaviors, signals the model weighted, signals it ignored, and why competing classifications were rejected.",
    accent: "blue",
  },
  {
    icon: Sparkles,
    title: "Personalization Recommendations",
    description:
      "Ranked, effort-scored actions — discount timing, urgency messaging, bundle offers — each with an expected conversion lift.",
    accent: "purple",
  },
  {
    icon: FlaskConical,
    title: "Rules Simulator",
    description:
      "Stress-test personalization rules against historical sessions before you ship them, and see exactly which shoppers they'd trigger for.",
    accent: "blue",
  },
  {
    icon: LineChart,
    title: "Real-time Analytics",
    description:
      "Track shopper state distribution, confidence trends, and recommendation performance across your entire funnel as it happens.",
    accent: "emerald",
  },
] as const;

const accentClasses = {
  purple: {
    icon: "text-accent-purple bg-accent-purple/10",
    glow: "hover:shadow-glow-purple",
  },
  blue: {
    icon: "text-accent-blue bg-accent-blue/10",
    glow: "hover:shadow-[0_0_40px_-8px_hsl(var(--accent-blue)/0.35)]",
  },
  emerald: {
    icon: "text-accent-emerald bg-accent-emerald/10",
    glow: "hover:shadow-glow-emerald",
  },
} as const;

export function FeatureGrid() {
  return (
    <section id="product" className="relative py-28">
      <div className="container">
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            Everything you need to personalize with confidence
          </h2>
          <p className="mt-4 text-muted-foreground">
            CartGuru doesn&apos;t just guess at intent — it reasons about it, shows its work, and tells you exactly
            what to do next.
          </p>
        </ScrollReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {FEATURES.map((feature) => {
            const accent = accentClasses[feature.accent];
            return (
              <motion.div
                key={feature.title}
                variants={staggerItem}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25 }}
                className={cn(
                  "gradient-border group relative rounded-2xl border border-border bg-surface p-6 shadow-card transition-shadow duration-300",
                  accent.glow
                )}
              >
                <span
                  className={cn(
                    "mb-5 flex h-11 w-11 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110",
                    accent.icon
                  )}
                >
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="font-display text-base font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
