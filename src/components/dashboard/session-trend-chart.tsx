"use client";

import { useMemo } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import { useChartTheme } from "@/lib/chart-theme";
import { generateSessionTrend } from "@/components/dashboard/dashboard-stats";

export function SessionTrendChart() {
  const data = useMemo(() => generateSessionTrend(14), []);
  const { colors } = useChartTheme();

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Session Volume</CardTitle>
        <CardDescription>Last 14 days &middot; total sessions analyzed per day</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[220px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 8, right: 16, left: -12, bottom: 0 }}>
              <defs>
                <linearGradient id="sessionFill" x1="0" y1="0" x2="0" y2="1">
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
                interval={2}
              />
              <YAxis
                stroke={colors.border}
                tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={36}
              />
              <Tooltip
                content={<ChartTooltip formatter={(v) => `${v} sessions`} labelFormatter={(l) => `${l}`} />}
                cursor={{ stroke: colors.border, strokeWidth: 1 }}
              />
              <Area
                type="monotone"
                dataKey="sessions"
                name="Sessions"
                stroke={colors.purple}
                strokeWidth={2}
                fill="url(#sessionFill)"
                dot={false}
                activeDot={{ r: 4, fill: colors.purple, stroke: colors.surface, strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
