import { useEffect, useState } from "react";
import type { ShopperState } from "@/types/shopper";
import { getStoredTheme, type Theme } from "@/lib/theme";

/**
 * Shared chart theming for Dashboard + Analytics.
 * Raw hex/hsl strings only — Recharts fill/stroke props need literal color
 * values, not Tailwind classNames, since they render into SVG attributes.
 * Because these are literal values (not CSS vars Recharts can react to),
 * every consumer must call `useChartTheme()` and re-render on theme change
 * rather than importing a static palette object.
 */

interface ChartColors {
  background: string;
  surface: string;
  surface2: string;
  surface3: string;
  border: string;
  borderFaint: string;
  mutedForeground: string;
  foreground: string;
  purple: string;
  blue: string;
  emerald: string;
  amber: string;
  red: string;
  confidenceHigh: string;
  confidenceMid: string;
  confidenceLow: string;
}

const DARK_CHART_COLORS: ChartColors = {
  background: "#09090b",
  surface: "#111113",
  surface2: "#17171a",
  surface3: "#1e1e21",
  border: "#28282d",
  borderFaint: "rgba(255,255,255,0.06)",
  mutedForeground: "#a3a3ad",
  foreground: "#fafafa",
  purple: "#8b5cf6",
  blue: "#3b82f6",
  emerald: "#10b981",
  amber: "#f59e0b",
  red: "#e23434",
  confidenceHigh: "#22c55e",
  confidenceMid: "#f59e0b",
  confidenceLow: "#e23434",
};

const LIGHT_CHART_COLORS: ChartColors = {
  background: "#fbfbfd",
  surface: "#ffffff",
  surface2: "#f5f5f8",
  surface3: "#eaeaef",
  border: "#e0e0e6",
  borderFaint: "rgba(10,10,12,0.06)",
  mutedForeground: "#6b6b76",
  foreground: "#141417",
  purple: "#7c3aed",
  blue: "#2563eb",
  emerald: "#059669",
  amber: "#d97706",
  red: "#dc2626",
  confidenceHigh: "#16a34a",
  confidenceMid: "#d97706",
  confidenceLow: "#dc2626",
};

/** Deliberate, semantically-grouped color mapping for all 15 ShopperStates, per theme. */
const DARK_SHOPPER_STATE_COLORS: Record<ShopperState, string> = {
  "Cart Abandoner": "#e23434",
  "Discount Seeker": "#f59e0b",
  "Uncertain Buyer": "#fb923c",

  "Loyal Customer": "#10b981",
  "VIP Customer": "#34d399",
  "Repeat Buyer": "#059669",

  Comparer: "#3b82f6",
  Researcher: "#60a5fa",
  Explorer: "#2563eb",

  "High Intent Buyer": "#8b5cf6",
  "Impulse Buyer": "#a78bfa",

  Browser: "#8b8b96",
  "Window Shopper": "#6b6b76",

  "Gift Shopper": "#ec4899",
  "Returning Visitor": "#06b6d4",
};

const LIGHT_SHOPPER_STATE_COLORS: Record<ShopperState, string> = {
  "Cart Abandoner": "#dc2626",
  "Discount Seeker": "#d97706",
  "Uncertain Buyer": "#ea580c",

  "Loyal Customer": "#059669",
  "VIP Customer": "#0d9488",
  "Repeat Buyer": "#047857",

  Comparer: "#2563eb",
  Researcher: "#3b82f6",
  Explorer: "#1d4ed8",

  "High Intent Buyer": "#7c3aed",
  "Impulse Buyer": "#8b5cf6",

  Browser: "#71717a",
  "Window Shopper": "#52525b",

  "Gift Shopper": "#db2777",
  "Returning Visitor": "#0891b2",
};

/** Fixed-order categorical ramp for generic "series N" charts (not shopper states). */
const DARK_CATEGORICAL_PALETTE = [
  DARK_CHART_COLORS.blue,
  DARK_CHART_COLORS.emerald,
  DARK_CHART_COLORS.amber,
  DARK_CHART_COLORS.purple,
  DARK_CHART_COLORS.red,
  "#ec4899",
  "#06b6d4",
  "#f97316",
] as const;

const LIGHT_CATEGORICAL_PALETTE = [
  LIGHT_CHART_COLORS.blue,
  LIGHT_CHART_COLORS.emerald,
  LIGHT_CHART_COLORS.amber,
  LIGHT_CHART_COLORS.purple,
  LIGHT_CHART_COLORS.red,
  "#db2777",
  "#0891b2",
  "#ea580c",
] as const;

function confidenceColorFor(colors: ChartColors, confidence: number): string {
  if (confidence >= 80) return colors.confidenceHigh;
  if (confidence >= 55) return colors.confidenceMid;
  return colors.confidenceLow;
}

export interface ChartTheme {
  theme: Theme;
  colors: ChartColors;
  stateColors: Record<ShopperState, string>;
  categorical: readonly string[];
  confidenceColor: (confidence: number) => string;
  grid: { stroke: string; strokeOpacity: number };
  axis: { stroke: string; tick: { fill: string; fontSize: number } };
}

function buildChartTheme(theme: Theme): ChartTheme {
  const colors = theme === "light" ? LIGHT_CHART_COLORS : DARK_CHART_COLORS;
  return {
    theme,
    colors,
    stateColors: theme === "light" ? LIGHT_SHOPPER_STATE_COLORS : DARK_SHOPPER_STATE_COLORS,
    categorical: theme === "light" ? LIGHT_CATEGORICAL_PALETTE : DARK_CATEGORICAL_PALETTE,
    confidenceColor: (confidence: number) => confidenceColorFor(colors, confidence),
    grid: { stroke: colors.border, strokeOpacity: 0.5 },
    axis: { stroke: colors.border, tick: { fill: colors.mutedForeground, fontSize: 11 } },
  };
}

/**
 * Live chart theme hook. Every chart/color-consuming component must call this
 * (instead of importing static constants) since Recharts fill/stroke props
 * need literal strings that can't react to CSS var changes on their own.
 */
export function useChartTheme(): ChartTheme {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    setTheme(getStoredTheme() ?? "dark");
    const observer = new MutationObserver(() => {
      setTheme((document.documentElement.dataset.theme as Theme) ?? "dark");
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  return buildChartTheme(theme);
}
