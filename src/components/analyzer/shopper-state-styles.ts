import type { ShopperState } from "@/types/shopper";
import {
  Eye,
  Compass,
  GitCompare,
  Tag,
  Zap,
  ShoppingCart,
  RotateCcw,
  Crown,
  Flame,
  Wind,
  Repeat,
  Gem,
  Gift,
  Microscope,
  HelpCircle,
  type LucideIcon,
} from "lucide-react";

export type StateTone = "high" | "mid" | "low" | "purple" | "blue" | "neutral";

interface StateStyle {
  tone: StateTone;
  icon: LucideIcon;
  className: string; // badge background/border/text
  dot: string; // solid color dot / accents
  description: string;
}

/**
 * Deliberate color mapping across the 15 shopper states, built from the
 * existing accent + confidence tokens only:
 *  - confidence.high (emerald-ish green): loyal / high-value / converting states
 *  - confidence.mid (amber): urgency-tinged, price-sensitive, or "at risk but not lost" states
 *  - confidence.low (red): states actively signaling lost revenue / risk
 *  - accent.blue: neutral, exploratory, research-driven states
 *  - accent.purple: comparison / decision-in-progress states
 *  - neutral (muted): low-signal / ambiguous states
 */
export const SHOPPER_STATE_STYLES: Record<ShopperState, StateStyle> = {
  "Loyal Customer": {
    tone: "high",
    icon: Crown,
    className: "border-confidence-high/30 bg-confidence-high/10 text-confidence-high",
    dot: "bg-confidence-high",
    description: "Consistent repeat purchaser with strong brand affinity.",
  },
  "VIP Customer": {
    tone: "high",
    icon: Gem,
    className: "border-confidence-high/30 bg-confidence-high/10 text-confidence-high",
    dot: "bg-confidence-high",
    description: "High lifetime value shopper exhibiting premium purchase behavior.",
  },
  "Repeat Buyer": {
    tone: "high",
    icon: Repeat,
    className: "border-confidence-high/30 bg-confidence-high/10 text-confidence-high",
    dot: "bg-confidence-high",
    description: "Restocking or re-purchasing a known product line.",
  },
  "High Intent Buyer": {
    tone: "high",
    icon: Zap,
    className: "border-confidence-high/30 bg-confidence-high/10 text-confidence-high",
    dot: "bg-confidence-high",
    description: "Deep in the funnel with strong purchase signals.",
  },
  "Impulse Buyer": {
    tone: "purple",
    icon: Flame,
    className: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple",
    dot: "bg-accent-purple",
    description: "Fast, low-deliberation path from view to purchase.",
  },
  "Cart Abandoner": {
    tone: "low",
    icon: ShoppingCart,
    className: "border-confidence-low/30 bg-confidence-low/10 text-confidence-low",
    dot: "bg-confidence-low",
    description: "Added to cart or began checkout, then left without buying.",
  },
  "Uncertain Buyer": {
    tone: "low",
    icon: HelpCircle,
    className: "border-confidence-low/30 bg-confidence-low/10 text-confidence-low",
    dot: "bg-confidence-low",
    description: "Mixed or weak signals, at risk of leaving without converting.",
  },
  "Discount Seeker": {
    tone: "mid",
    icon: Tag,
    className: "border-confidence-mid/30 bg-confidence-mid/10 text-confidence-mid",
    dot: "bg-confidence-mid",
    description: "Actively hunting for coupons, promos, or the lowest price.",
  },
  "Window Shopper": {
    tone: "mid",
    icon: Wind,
    className: "border-confidence-mid/30 bg-confidence-mid/10 text-confidence-mid",
    dot: "bg-confidence-mid",
    description: "Browsing with little to no purchase intent right now.",
  },
  "Comparer": {
    tone: "purple",
    icon: GitCompare,
    className: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple",
    dot: "bg-accent-purple",
    description: "Actively weighing multiple products against each other.",
  },
  "Researcher": {
    tone: "blue",
    icon: Microscope,
    className: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
    dot: "bg-accent-blue",
    description: "Gathering detailed information before a considered purchase.",
  },
  "Explorer": {
    tone: "blue",
    icon: Compass,
    className: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
    dot: "bg-accent-blue",
    description: "Discovering categories and products with open-ended curiosity.",
  },
  "Browser": {
    tone: "neutral",
    icon: Eye,
    className: "border-border bg-surface-2 text-muted-foreground",
    dot: "bg-muted-foreground",
    description: "Casual, low-commitment viewing with no strong direction.",
  },
  "Returning Visitor": {
    tone: "blue",
    icon: RotateCcw,
    className: "border-accent-blue/30 bg-accent-blue/10 text-accent-blue",
    dot: "bg-accent-blue",
    description: "Has come back to reconsider a product from a prior visit.",
  },
  "Gift Shopper": {
    tone: "purple",
    icon: Gift,
    className: "border-accent-purple/30 bg-accent-purple/10 text-accent-purple",
    dot: "bg-accent-purple",
    description: "Shopping on behalf of someone else, often occasion-driven.",
  },
};

export function getStateStyle(state: ShopperState): StateStyle {
  return SHOPPER_STATE_STYLES[state] ?? {
    tone: "neutral",
    icon: HelpCircle,
    className: "border-border bg-surface-2 text-muted-foreground",
    dot: "bg-muted-foreground",
    description: "",
  };
}
