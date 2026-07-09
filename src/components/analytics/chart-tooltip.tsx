"use client";

import { cn } from "@/lib/utils";

export interface ChartTooltipPayloadItem {
  name?: string;
  value?: number | string;
  color?: string;
  dataKey?: string | number;
  unit?: string;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  label?: string | number;
  payload?: ChartTooltipPayloadItem[];
  formatter?: (value: number | string, item: ChartTooltipPayloadItem) => string;
  labelFormatter?: (label: string | number) => string;
  className?: string;
}

/**
 * Dark-themed Recharts tooltip content, shared by Dashboard + Analytics charts.
 * Pass as `<Tooltip content={<ChartTooltip />} />`.
 */
export function ChartTooltip({ active, label, payload, formatter, labelFormatter, className }: ChartTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-lg border border-border bg-surface-2/95 px-3 py-2 shadow-glow backdrop-blur-md",
        className
      )}
    >
      {label !== undefined && (
        <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">
          {labelFormatter ? labelFormatter(label) : label}
        </p>
      )}
      <div className="flex flex-col gap-1">
        {payload.map((item, i) => (
          <div key={`${item.dataKey ?? item.name ?? i}`} className="flex items-center gap-2 text-xs">
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: item.color ?? "#8b5cf6" }}
            />
            <span className="text-muted-foreground">{item.name}</span>
            <span className="ml-auto font-mono font-medium text-foreground">
              {item.value !== undefined
                ? formatter
                  ? formatter(item.value, item)
                  : item.value
                : "—"}
              {item.unit ?? ""}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
