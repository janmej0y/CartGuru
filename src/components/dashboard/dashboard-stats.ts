import { MOCK_SESSIONS } from "@/lib/data/mock-sessions";
import type { ShopperState } from "@/types/shopper";

/**
 * Deterministic mock-aggregate methodology for the Dashboard.
 *
 * Since a fresh visitor's live `history` is empty, the dashboard's primary
 * widgets are derived from MOCK_SESSIONS treating each session's `persona`
 * field as if it were already classified by the AI. A per-persona base
 * confidence table (below) stands in for "the model's typical confidence
 * when it lands on this state" — states with unambiguous behavioral
 * signatures (Impulse Buyer, VIP Customer, Cart Abandoner) get high base
 * confidence; ambiguous/early-funnel states (Uncertain Buyer, Browser) get
 * lower confidence. This table is reused by Analytics for consistency.
 */
export const PERSONA_BASE_CONFIDENCE: Record<string, number> = {
  "Impulse Buyer": 91,
  "VIP Customer": 95,
  "Cart Abandoner": 88,
  "Loyal Customer": 90,
  "Repeat Buyer": 89,
  "High Intent Buyer": 86,
  "Discount Seeker": 84,
  Researcher: 79,
  Comparer: 77,
  Explorer: 74,
  "Gift Shopper": 81,
  "Returning Visitor": 75,
  Browser: 63,
  "Window Shopper": 66,
  "Uncertain Buyer": 58,
};

export function personaConfidence(persona: string): number {
  return PERSONA_BASE_CONFIDENCE[persona] ?? 70;
}

/** Count of MOCK_SESSIONS grouped by persona, in a stable order. */
export function getPersonaDistribution() {
  const counts = new Map<string, number>();
  for (const s of MOCK_SESSIONS) {
    counts.set(s.persona, (counts.get(s.persona) ?? 0) + 1);
  }
  return Array.from(counts.entries())
    .map(([persona, count]) => ({
      persona: persona as ShopperState,
      count,
      pct: (count / MOCK_SESSIONS.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

/** Overall average confidence across all mock sessions (persona-weighted). */
export function getAverageConfidence() {
  const total = MOCK_SESSIONS.reduce((sum, s) => sum + personaConfidence(s.persona), 0);
  return total / MOCK_SESSIONS.length;
}

/**
 * Deterministic seeded pseudo-random generator (mulberry32) so synthesized
 * time series are stable across renders without flickering, and don't
 * require Math.random().
 */
function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface DayPoint {
  date: string;
  label: string;
  sessions: number;
  avgConfidence: number;
  highConfidence: number;
}

/**
 * Synthesizes a smooth, realistic-looking daily series ending "today"
 * (2026-07-09), seeded so numbers are stable across renders/mounts.
 */
export function generateSessionTrend(days: number, seed = 42): DayPoint[] {
  const rand = mulberry32(seed);
  const points: DayPoint[] = [];
  const baseSessions = 118;
  const baseConfidence = 79;
  const today = new Date("2026-07-09T12:00:00Z");

  let sessionTrend = 0;
  let confTrend = 0;

  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(d.getDate() - i);

    // gentle random walk + weekly seasonality (weekend dip) so the line
    // reads as organic rather than noisy or perfectly linear
    const dayOfWeek = d.getDay();
    const weekendDip = dayOfWeek === 0 || dayOfWeek === 6 ? -14 : 0;
    sessionTrend += (rand() - 0.48) * 10;
    sessionTrend = Math.max(-25, Math.min(35, sessionTrend));
    confTrend += (rand() - 0.5) * 2.2;
    confTrend = Math.max(-8, Math.min(8, confTrend));

    const growthRamp = ((days - 1 - i) / (days - 1)) * 18; // slight upward drift toward today

    const sessions = Math.round(Math.max(40, baseSessions + sessionTrend + weekendDip + growthRamp));
    const avgConfidence = Math.max(52, Math.min(97, Math.round((baseConfidence + confTrend) * 10) / 10));
    const highConfidence = Math.round(sessions * (0.55 + rand() * 0.15));

    points.push({
      date: d.toISOString().slice(0, 10),
      label: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      sessions,
      avgConfidence,
      highConfidence,
    });
  }

  return points;
}

/** Today's figure is the last point of a 1-day-resolution trend anchored to "today". */
export function getTodayStats() {
  const trend = generateSessionTrend(14);
  const todayPoint = trend[trend.length - 1]!;
  const yesterdayPoint = trend[trend.length - 2]!;

  const sessionsDeltaPct = ((todayPoint.sessions - yesterdayPoint.sessions) / yesterdayPoint.sessions) * 100;
  const confidenceDeltaPct = todayPoint.avgConfidence - yesterdayPoint.avgConfidence;

  return { todayPoint, yesterdayPoint, sessionsDeltaPct, confidenceDeltaPct };
}
