"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import { useChartTheme } from "@/lib/chart-theme";
import { getFullStateDistribution } from "@/components/analytics/analytics-stats";

export function StateDistributionChart() {
  const allData = useMemo(() => getFullStateDistribution(), []);
  const data = useMemo(() => allData.filter((d) => d.count > 0), [allData]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { stateColors, colors } = useChartTheme();

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Classification Distribution</CardTitle>
        <CardDescription>All 15 shopper states, ranked by frequency across analyzed sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="state"
                innerRadius={64}
                outerRadius={100}
                paddingAngle={2}
                cornerRadius={4}
                stroke="none"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.state}
                    fill={stateColors[entry.state]}
                    opacity={activeIndex === null || activeIndex === i ? 1 : 0.35}
                  />
                ))}
              </Pie>
              <Tooltip
                content={
                  <ChartTooltip
                    formatter={(v, item) => {
                      const pct = item.payload?.pct as number | undefined;
                      return `${v} sessions (${pct?.toFixed(0)}%)`;
                    }}
                  />
                }
              />
              <Legend
                verticalAlign="bottom"
                height={56}
                iconType="circle"
                iconSize={8}
                wrapperStyle={{ fontSize: 11, color: colors.mutedForeground, paddingTop: 12 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
