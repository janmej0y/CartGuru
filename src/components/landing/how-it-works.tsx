"use client";

import { motion } from "framer-motion";
import { Activity, BrainCog, Target, Rocket, ArrowRight } from "lucide-react";
import { ScrollReveal, staggerContainer, staggerItem } from "@/components/landing/scroll-reveal";

const STEPS = [
  {
    icon: Activity,
    title: "Event Stream",
    description: "Raw session events — views, cart actions, coupon attempts, checkout steps — flow in as they happen.",
  },
  {
    icon: BrainCog,
    title: "AI Reasoning",
    description: "An LLM reasons over the full timeline, weighing signals against noise the way an analyst would.",
  },
  {
    icon: Target,
    title: "Shopper State + Confidence",
    description: "A classification is produced with a calibrated confidence score and the evidence behind it.",
  },
  {
    icon: Rocket,
    title: "Personalization Action",
    description: "A ranked, effort-scored recommendation is pushed to your storefront — free shipping, urgency, coupon.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="relative py-28">
      <div className="container">
        <ScrollReveal className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            From raw events to revenue, in four steps
          </h2>
          <p className="mt-4 text-muted-foreground">
            The same reasoning pipeline runs on every session, every time — transparent at each stage.
          </p>
        </ScrollReveal>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={staggerContainer}
          className="relative grid grid-cols-1 gap-6 md:grid-cols-4 md:gap-4"
        >
          {/* connecting line for desktop */}
          <div
            aria-hidden
            className="absolute left-0 right-0 top-[38px] hidden h-px bg-gradient-to-r from-transparent via-border to-transparent md:block"
          />

          {STEPS.map((step, i) => (
            <motion.div key={step.title} variants={staggerItem} className="relative flex flex-col items-center text-center">
              <div className="relative z-10 mb-5 flex h-[76px] w-[76px] items-center justify-center rounded-2xl border border-border bg-surface shadow-card">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-accent-purple/20 to-accent-blue/20 text-accent-purple">
                  <step.icon className="h-5 w-5" />
                </div>
              </div>
              <span className="mb-2 font-mono text-xs text-muted-foreground">Step {i + 1}</span>
              <h3 className="font-display text-base font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 max-w-[220px] text-sm leading-relaxed text-muted-foreground">{step.description}</p>

              {i < STEPS.length - 1 && (
                <div className="mt-4 md:hidden">
                  <ArrowRight className="h-4 w-4 rotate-90 text-muted-foreground/50" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
