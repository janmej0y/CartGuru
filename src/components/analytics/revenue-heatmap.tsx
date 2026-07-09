"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getHeatmapData, URGENCY_LEVELS } from "@/components/analytics/analytics-stats";
import { cn } from "@/lib/utils";

// Interpolates between surface-3 and accent-purple based on intensity 0-100.
function cellColor(value: number) {
  const t = Math.min(1, Math.max(0, value / 60)); // 60+ reaches full saturation
  // surface-3 hsl(240 5% 12%) -> accent-purple hsl(258 90% 66%)
  const h = 240 + (258 - 240) * t;
  const s = 5 + (90 - 5) * t;
  const l = 12 + (54) * t; // 12% -> 66%
  return `hsl(${h.toFixed(0)} ${s.toFixed(0)}% ${l.toFixed(0)}%)`;
}

export function RevenueHeatmap() {
  const rows = useMemo(() => getHeatmapData(), []);
  const [hovered, setHovered] = useState<{ state: string; level: string } | null>(null);

  return (
    <Card className="glass h-full">
      <CardHeader>
        <CardTitle>Urgency Distribution Heatmap</CardTitle>
        <CardDescription>Share of sessions per shopper state, broken down by intervention urgency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[560px]">
            <div className="grid grid-cols-[140px_repeat(4,1fr)] gap-1">
              <div />
              {URGENCY_LEVELS.map((level) => (
                <div key={level} className="pb-2 text-center text-[11px] font-medium text-muted-foreground">
                  {level}
                </div>
              ))}

              {rows.map((row) => (
                <RowFragment key={row.state} row={row} hovered={hovered} setHovered={setHovered} />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-3">
          <span className="text-[11px] text-muted-foreground">Low share</span>
          <div className="flex h-2.5 flex-1 max-w-[220px] overflow-hidden rounded-full">
            {Array.from({ length: 24 }).map((_, i) => (
              <span key={i} className="flex-1" style={{ backgroundColor: cellColor((i / 23) * 70) }} />
            ))}
          </div>
          <span className="text-[11px] text-muted-foreground">High share</span>
        </div>
      </CardContent>
    </Card>
  );
}

function RowFragment({
  row,
  hovered,
  setHovered,
}: {
  row: ReturnType<typeof getHeatmapData>[number];
  hovered: { state: string; level: string } | null;
  setHovered: (v: { state: string; level: string } | null) => void;
}) {
  return (
    <>
      <div className="flex items-center truncate pr-2 text-xs text-muted-foreground">{row.state}</div>
      {row.values.map((cell) => {
        const isHovered = hovered?.state === row.state && hovered?.level === cell.level;
        return (
          <div
            key={cell.level}
            onMouseEnter={() => setHovered({ state: row.state, level: cell.level })}
            onMouseLeave={() => setHovered(null)}
            className={cn(
              "relative flex h-9 items-center justify-center rounded-md text-[11px] font-mono font-medium transition-all",
              isHovered && "ring-1 ring-foreground/40"
            )}
            style={{ backgroundColor: cellColor(cell.value), color: cell.value > 35 ? "#0b0b0d" : "#a3a3ad" }}
            title={`${row.state} · ${cell.level} urgency · ${cell.value}%`}
          >
            {cell.value}%
          </div>
        );
      })}
    </>
  );
}
