"use client";

import { useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChartTooltip } from "@/components/analytics/chart-tooltip";
import { useChartTheme } from "@/lib/chart-theme";
import { getPersonaDistribution } from "@/components/dashboard/dashboard-stats";

export function ClassificationDonut() {
  const data = useMemo(() => getPersonaDistribution(), []);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { stateColors } = useChartTheme();

  return (
    <Card className="glass h-full p-1">
      <CardHeader>
        <CardTitle>Classification Distribution</CardTitle>
        <CardDescription>Shopper states across all sessions analyzed to date</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="mx-auto h-[220px] w-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="count"
                nameKey="persona"
                innerRadius={62}
                outerRadius={90}
                paddingAngle={2}
                cornerRadius={4}
                stroke="none"
                onMouseEnter={(_, i) => setActiveIndex(i)}
                onMouseLeave={() => setActiveIndex(null)}
              >
                {data.map((entry, i) => (
                  <Cell
                    key={entry.persona}
                    fill={stateColors[entry.persona]}
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
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="grid flex-1 grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {data.map((entry) => (
            <div key={entry.persona} className="flex items-center gap-2 text-xs">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: stateColors[entry.persona] }}
              />
              <span className="flex-1 truncate text-muted-foreground">{entry.persona}</span>
              <span className="font-mono font-medium text-foreground">{entry.pct.toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
