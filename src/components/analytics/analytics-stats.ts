import { MOCK_SESSIONS } from "@/lib/data/mock-sessions";
import { SHOPPER_STATES, type ShopperState } from "@/types/shopper";
import { personaConfidence, generateSessionTrend } from "@/components/dashboard/dashboard-stats";

export type TimeRange = "7d" | "30d" | "90d";

export const TIME_RANGE_DAYS: Record<TimeRange, number> = {
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

/**
 * Reuses the same seeded generator as the dashboard so the two pages stay
 * internally coherent (same methodology, different window sizes). A second
 * derived series ("highConfidence") is already produced by the generator.
 */
export function getTrendForRange(range: TimeRange) {
  return generateSessionTrend(TIME_RANGE_DAYS[range]);
}

/**
 * Full 15-state distribution across MOCK_SESSIONS. States with zero mock
 * sessions still appear (count 0) so the legend/chart always shows all 15 —
 * true to the "deeper, chart-heavy" analytics page vs. the dashboard's
 * top-line donut (which only renders states with count > 0).
 */
export function getFullStateDistribution() {
  const counts = new Map<ShopperState, number>();
  for (const state of SHOPPER_STATES) counts.set(state, 0);
  for (const s of MOCK_SESSIONS) {
    const key = s.persona as ShopperState;
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  const total = MOCK_SESSIONS.length;
  return SHOPPER_STATES.map((state) => ({
    state,
    count: counts.get(state) ?? 0,
    pct: total ? ((counts.get(state) ?? 0) / total) * 100 : 0,
  })).sort((a, b) => b.count - a.count);
}

/**
 * Per-state conversion opportunity, derived narratively rather than
 * randomly: risk/urgency states (Cart Abandoner, Discount Seeker) carry
 * high *lift potential* because they represent recoverable revenue;
 * loyalty states (VIP/Loyal/Repeat) carry high *current value* but low
 * *incremental* lift since they already convert well; browsing/neutral
 * states sit in between depending on funnel depth.
 */
const OPPORTUNITY_LIFT: Record<ShopperState, number> = {
  "Cart Abandoner": 34,
  "Discount Seeker": 29,
  "Uncertain Buyer": 22,
  "High Intent Buyer": 19,
  "Window Shopper": 17,
  Comparer: 16,
  Researcher: 14,
  Browser: 13,
  Explorer: 12,
  "Gift Shopper": 11,
  "Impulse Buyer": 9,
  "Returning Visitor": 8,
  "Repeat Buyer": 6,
  "Loyal Customer": 5,
  "VIP Customer": 4,
};

const AVG_ORDER_VALUE: Record<ShopperState, number> = {
  "Cart Abandoner": 285,
  "Discount Seeker": 95,
  "Uncertain Buyer": 140,
  "High Intent Buyer": 260,
  "Window Shopper": 70,
  Comparer: 220,
  Researcher: 610,
  Browser: 60,
  Explorer: 130,
  "Gift Shopper": 95,
  "Impulse Buyer": 45,
  "Returning Visitor": 110,
  "Repeat Buyer": 55,
  "Loyal Customer": 65,
  "VIP Customer": 420,
};

export function getOpportunityByState() {
  const dist = getFullStateDistribution();
  return dist
    .map((d) => {
      const sessionsEquivalent = Math.max(d.count, 1) * 18; // scale mock counts to a plausible daily volume
      const revenueOpportunity = Math.round(sessionsEquivalent * AVG_ORDER_VALUE[d.state] * (OPPORTUNITY_LIFT[d.state] / 100));
      return {
        state: d.state,
        lift: OPPORTUNITY_LIFT[d.state],
        revenueOpportunity,
        count: d.count,
      };
    })
    .sort((a, b) => b.lift - a.lift);
}

/** state x urgency-level heatmap intensity grid (0-100 scale). */
export const URGENCY_LEVELS = ["Low", "Medium", "High", "Critical"] as const;

export function getHeatmapData() {
  const dist = getFullStateDistribution();
  // Urgency skew per state: risk states skew toward Critical/High, loyalty
  // states skew toward Low, research/browsing states cluster in Medium.
  const skew: Record<ShopperState, [number, number, number, number]> = {
    "Cart Abandoner": [5, 15, 35, 45],
    "Discount Seeker": [10, 25, 40, 25],
    "Uncertain Buyer": [35, 40, 20, 5],
    "High Intent Buyer": [5, 20, 45, 30],
    "Window Shopper": [55, 30, 12, 3],
    Comparer: [20, 45, 30, 5],
    Researcher: [15, 50, 30, 5],
    Browser: [65, 25, 8, 2],
    Explorer: [45, 40, 12, 3],
    "Gift Shopper": [20, 40, 30, 10],
    "Impulse Buyer": [10, 20, 40, 30],
    "Returning Visitor": [25, 45, 25, 5],
    "Repeat Buyer": [30, 45, 20, 5],
    "Loyal Customer": [40, 40, 15, 5],
    "VIP Customer": [30, 35, 25, 10],
  };
  return dist.map((d) => ({
    state: d.state,
    values: URGENCY_LEVELS.map((level, i) => ({ level, value: skew[d.state][i] ?? 0 })),
  }));
}

/** Overall AI performance summary metrics, consistent with dashboard's average confidence. */
export function getPerformanceSummary() {
  const dist = getFullStateDistribution().filter((d) => d.count > 0);
  const totalSessions = dist.reduce((s, d) => s + d.count, 0);
  const avgConfidence = dist.reduce((s, d) => s + personaConfidence(d.state) * d.count, 0) / totalSessions;

  const highConfidenceShare =
    dist.reduce((s, d) => s + (personaConfidence(d.state) >= 80 ? d.count : 0), 0) / totalSessions;

  // Recommendation success rate: modeled as correlated with confidence,
  // since the mock reasoning engine's recommendations are more often acted
  // on for confidently-classified sessions.
  const recommendationSuccessRate = Math.min(96, Math.round(avgConfidence * 0.92 + 8));

  return {
    avgConfidence,
    highConfidenceSharePct: highConfidenceShare * 100,
    recommendationSuccessRate,
    totalSessions,
  };
}
