"use client";

import { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import { useChartTheme } from "@/lib/chart-theme";
import { getOpportunityByState } from "@/components/analytics/analytics-stats";

export function OpportunityBarChart() {
  const data = useMemo(() => getOpportunityByState(), []);
  const { colors, stateColors } = useChartTheme();

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Conversion Opportunity by State</CardTitle>
        <CardDescription>Estimated conversion lift if personalization is applied, per shopper state</CardDescription>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 4, right: 24, left: 8, bottom: 4 }} barCategoryGap={6}>
              <CartesianGrid horizontal={false} stroke={colors.border} strokeOpacity={0.5} />
              <XAxis
                type="number"
                stroke={colors.border}
                tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                unit="%"
                label={{ value: "Est. conversion lift (%)", position: "insideBottom", offset: -2, fill: colors.mutedForeground, fontSize: 11 }}
              />
              <YAxis
                type="category"
                dataKey="state"
                stroke={colors.border}
                tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={118}
              />
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(v, item) => {
                      const revenue = item.payload?.revenueOpportunity as number | undefined;
                      return `+${v}% lift${revenue ? ` · $${revenue.toLocaleString()} opportunity` : ""}`;
                    }}
                  />
                }
                cursor={{ fill: colors.surface2 }}
              />
              <Bar dataKey="lift" name="Conversion Lift" radius={[0, 4, 4, 0]} maxBarSize={16}>
                {data.map((entry) => (
                  <Cell key={entry.state} fill={stateColors[entry.state]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
