"use client";

import type { ReactNode } from "react";
import { ArrowDown, ArrowUp, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export type DiffDirection = "increased" | "decreased" | "unchanged";

interface ComparisonDiffRowProps {
  label: string;
  valueA: ReactNode;
  valueB: ReactNode;
  /** Optional delta badge shown between the two values (e.g. "+12%" or "-$430"). */
  delta?: {
    text: string;
    direction: DiffDirection;
  };
}

const DIRECTION_STYLES: Record<DiffDirection, { variant: "success" | "danger" | "secondary"; icon: typeof ArrowUp }> = {
  increased: { variant: "success", icon: ArrowUp },
  decreased: { variant: "danger", icon: ArrowDown },
  unchanged: { variant: "secondary", icon: Minus },
};

export function ComparisonDiffRow({ label, valueA, valueB, delta }: ComparisonDiffRowProps) {
  const directionStyle = delta ? DIRECTION_STYLES[delta.direction] : null;
  const DirectionIcon = directionStyle?.icon;

  return (
    <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2.5 sm:grid-cols-[minmax(120px,160px)_1fr_auto_1fr]">
      <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</span>
      <div className="text-sm font-semibold text-foreground sm:text-right">{valueA}</div>
      <div className="flex justify-center">
        {delta && directionStyle && DirectionIcon ? (
          <Badge variant={directionStyle.variant} className="gap-1 whitespace-nowrap">
            <DirectionIcon className="h-3 w-3" />
            {delta.text}
          </Badge>
        ) : (
          <span className={cn("h-px w-4 bg-border")} />
        )}
      </div>
      <div className="text-sm font-semibold text-foreground">{valueB}</div>
    </div>
  );
}
