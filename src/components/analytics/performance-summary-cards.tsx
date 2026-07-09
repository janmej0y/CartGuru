"use client";

import { useMemo } from "react";
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer, LineChart, Line } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { useChartTheme } from "@/lib/chart-theme";
import { getPerformanceSummary } from "@/components/analytics/analytics-stats";
import { generateSessionTrend } from "@/components/dashboard/dashboard-stats";

export function PerformanceSummaryCards() {
  const summary = useMemo(() => getPerformanceSummary(), []);
  const sparkline = useMemo(() => generateSessionTrend(30, 7), []);
  const { colors, confidenceColor } = useChartTheme();
  const gaugeColor = confidenceColor(summary.avgConfidence);

  const gaugeData = [{ name: "confidence", value: summary.avgConfidence, fill: gaugeColor }];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="glass h-full">
        <CardHeader>
          <CardTitle>Average Confidence</CardTitle>
          <CardDescription>Mean classification confidence across all sessions</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-4">
          <div className="relative h-[140px] w-[140px] shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <RadialBarChart
                data={gaugeData}
                startAngle={90}
                endAngle={-270}
                innerRadius="72%"
                outerRadius="100%"
                barSize={10}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
                <RadialBar dataKey="value" background={{ fill: colors.surface3 }} cornerRadius={8} />
              </RadialBarChart>
            </ResponsiveContainer>
            <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
              <span className="font-display text-2xl font-semibold tabular-nums">
                <AnimatedCounter value={summary.avgConfidence} decimals={1} suffix="%" />
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-foreground">
              <span className="font-mono font-medium text-foreground">{summary.highConfidenceSharePct.toFixed(0)}%</span> of
              sessions classified at high confidence (&ge;80%)
            </p>
            <p className="text-xs text-muted-foreground">
              Based on <span className="font-mono font-medium text-foreground">{summary.totalSessions}</span> analyzed
              sessions
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="glass h-full">
        <CardHeader>
          <CardTitle>Recommendation Success Rate</CardTitle>
          <CardDescription>Share of AI recommendations that drove the intended shopper action</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end justify-between">
            <span className="font-display text-3xl font-semibold tabular-nums text-confidence-high">
              <AnimatedCounter value={summary.recommendationSuccessRate} suffix="%" />
            </span>
            <span className="mb-1 text-xs text-muted-foreground">last 30 days</span>
          </div>
          <div className="mt-3 h-[64px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sparkline} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                <Line
                  type="monotone"
                  dataKey="avgConfidence"
                  stroke={colors.emerald}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Trending with classification confidence &mdash; higher-confidence sessions see stronger recommendation
            follow-through.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
