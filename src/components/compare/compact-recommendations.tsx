"use client";

import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { PersonalizationRecommendation } from "@/types/shopper";

interface CompactRecommendationsProps {
  recommendations: PersonalizationRecommendation[];
}

export function CompactRecommendations({ recommendations }: CompactRecommendationsProps) {
  const top = [...recommendations].sort((a, b) => a.priority - b.priority).slice(0, 3);

  if (top.length === 0) {
    return <p className="text-sm text-muted-foreground">No recommendations generated for this session.</p>;
  }

  return (
    <ul className="flex flex-col gap-3">
      {top.map((rec) => (
        <li key={rec.id} className="flex items-start justify-between gap-3 rounded-lg border border-border bg-surface-2 px-3 py-2.5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-foreground">{rec.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-confidence-high">
              <TrendingUp className="h-3 w-3" />
              {rec.expectedConversionLift}
            </p>
          </div>
          <Badge variant="secondary" className="shrink-0">
            {rec.confidence}%
          </Badge>
        </li>
      ))}
    </ul>
  );
}
