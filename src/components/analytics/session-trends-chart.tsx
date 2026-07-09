"use client";

import { useMemo, useState } from "react";
import { AreaChart, Area, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import { useChartTheme } from "@/lib/chart-theme";
import { getTrendForRange, type TimeRange } from "@/components/analytics/analytics-stats";

const RANGE_OPTIONS: { value: TimeRange; label: string }[] = [
  { value: "7d", label: "7d" },
  { value: "30d", label: "30d" },
  { value: "90d", label: "90d" },
];

export function SessionTrendsChart() {
  const [range, setRange] = useState<TimeRange>("30d");
  const data = useMemo(() => getTrendForRange(range), [range]);
  const tickInterval = range === "7d" ? 0 : range === "30d" ? 3 : 9;
  const { colors } = useChartTheme();

  return (
    <Card className="glass h-full">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div>
          <CardTitle>Session Trends</CardTitle>
          <CardDescription>Total sessions vs. high-confidence classifications over time</CardDescription>
        </div>
        <Tabs value={range} onValueChange={(v) => setRange(v as TimeRange)}>
          <TabsList>
            {RANGE_OPTIONS.map((opt) => (
              <TabsTrigger key={opt.value} value={opt.value}>
                {opt.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 20, left: -8, bottom: 0 }}>
              <defs>
                <linearGradient id="totalSessionsFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={colors.purple} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={colors.purple} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid vertical={false} stroke={colors.border} strokeOpacity={0.5} />
              <XAxis
                dataKey="label"
                stroke={colors.border}
                tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={tickInterval}
                label={{ value: "Date", position: "insideBottom", offset: -2, fill: colors.mutedForeground, fontSize: 11 }}
              />
              <YAxis
                stroke={colors.border}
                tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={40}
                label={{ value: "Sessions", angle: -90, position: "insideLeft", fill: colors.mutedForeground, fontSize: 11 }}
              />
              <Tooltip content={<ChartTooltip formatter={(v) => `${v}`} />} cursor={{ stroke: colors.border, strokeWidth: 1 }} />
              <Legend
                verticalAlign="top"
                height={32}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: colors.mutedForeground }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Total Sessions"
                stroke={colors.purple}
                strokeWidth={2}
                fill="url(#totalSessionsFill)"
                dot={false}
                activeDot={{ r: 4, fill: colors.purple, stroke: colors.surface, strokeWidth: 2 }}
              />
              <Line
                type="monotone"
                dataKey="highConfidence"
                name="High-Confidence Classifications"
                stroke={colors.emerald}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 4, fill: colors.emerald, stroke: colors.surface, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
