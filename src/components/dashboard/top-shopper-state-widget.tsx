"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Layers } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { getPersonaDistribution } from "@/components/dashboard/dashboard-stats";
import { useChartTheme } from "@/lib/chart-theme";
import type { ShopperState } from "@/types/shopper";

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/** One-line contextual insight tailored to the most common shopper states. */
function insightFor(state: ShopperState): string {
  switch (state) {
    case "Cart Abandoner":
      return "Cart recovery is your single highest-leverage lever right now — a targeted nudge here moves the most sessions.";
    case "Discount Seeker":
      return "Price-sensitivity dominates your traffic — a well-timed offer converts more than a generic banner.";
    case "Uncertain Buyer":
      return "A large share of shoppers haven't decided yet — clarity and social proof will do more than urgency.";
    case "Impulse Buyer":
      return "Momentum-driven shoppers lead your funnel — frictionless checkout matters more than persuasion here.";
    case "VIP Customer":
      return "Your highest-value segment is your largest — protect this experience before optimizing anywhere else.";
    case "Loyal Customer":
    case "Repeat Buyer":
      return "Retention is already working — lean into loyalty rewards to compound this advantage.";
    case "High Intent Buyer":
      return "Most sessions are close to converting — remove checkout friction to capture this demand.";
    case "Researcher":
    case "Comparer":
      return "Shoppers are evaluating, not deciding — detailed comparisons and reviews will move them forward.";
    case "Gift Shopper":
      return "Gifting intent leads your traffic — gift guides and wrapping options can lift conversion here.";
    case "Browser":
    case "Window Shopper":
    case "Explorer":
      return "Early-funnel exploration dominates — focus on engagement, not conversion, for this majority.";
    case "Returning Visitor":
      return "Most shoppers are coming back for another look — a personalized welcome-back nudge is worth testing.";
    default:
      return "This state makes up the largest share of your sessions — prioritize it in your next personalization push.";
  }
}

export function TopShopperStateWidget() {
  const { stateColors } = useChartTheme();

  const top = useMemo(() => getPersonaDistribution()[0], []);

  if (!top) return null;

  const swatch = stateColors[top.persona];
  const insight = insightFor(top.persona);

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="show">
      <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
        <div className="flex items-center justify-between">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
            <Layers className="h-4.5 w-4.5" />
          </div>
          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: swatch }} />
        </div>

        <p className="mt-4 font-display text-2xl font-semibold tabular-nums">{top.persona}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          Most Common Shopper State &middot; <AnimatedCounter value={top.count} /> sessions (
          <AnimatedCounter value={top.pct} decimals={1} suffix="%" />)
        </p>

        <p className="mt-4 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
          {insight}
        </p>
      </Card>
    </motion.div>
  );
}
