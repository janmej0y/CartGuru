"use client";

import { motion } from "framer-motion";
import { SHOPPER_STATES } from "@/types/shopper";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { cn } from "@/lib/utils";

const ROW_1 = SHOPPER_STATES.slice(0, 8);
const ROW_2 = SHOPPER_STATES.slice(7).concat(SHOPPER_STATES.slice(0, 7));

const STATE_ACCENT: Record<string, string> = {
  "Cart Abandoner": "border-confidence-low/30 text-confidence-low bg-confidence-low/5",
  "VIP Customer": "border-accent-purple/30 text-accent-purple bg-accent-purple/5",
  "Loyal Customer": "border-accent-purple/30 text-accent-purple bg-accent-purple/5",
  "High Intent Buyer": "border-accent-emerald/30 text-accent-emerald bg-accent-emerald/5",
  "Discount Seeker": "border-confidence-mid/30 text-confidence-mid bg-confidence-mid/5",
  "Impulse Buyer": "border-accent-blue/30 text-accent-blue bg-accent-blue/5",
};

const DEFAULT_ACCENT = "border-border text-muted-foreground bg-surface-2";

function MarqueeRow({ states, reverse = false, speed = 38 }: { states: string[]; reverse?: boolean; speed?: number }) {
  const loop = [...states, ...states];
  return (
    <div className="relative flex overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
      <motion.div
        className="flex flex-none items-center gap-3 pr-3"
        animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
        transition={{ duration: speed, repeat: Infinity, ease: "linear" }}
      >
        {loop.map((state, i) => (
          <span
            key={`${state}-${i}`}
            className={cn(
              "flex-none rounded-full border px-4 py-2 text-sm font-medium whitespace-nowrap",
              STATE_ACCENT[state] ?? DEFAULT_ACCENT
            )}
          >
            {state}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function ShopperStatesMarquee() {
  return (
    <section className="relative py-28">
      <div className="container">
        <ScrollReveal className="mx-auto mb-14 max-w-2xl text-center">
          <h2 className="font-display text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            15 shopper states, classified with evidence
          </h2>
          <p className="mt-4 text-muted-foreground">
            Not a generic funnel stage — a precise behavioral read, from Window Shopper to VIP Customer.
          </p>
        </ScrollReveal>
      </div>

      <div className="flex flex-col gap-4">
        <MarqueeRow states={ROW_1} speed={42} />
        <MarqueeRow states={ROW_2} reverse speed={48} />
      </div>
    </section>
  );
}
