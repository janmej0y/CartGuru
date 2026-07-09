"use client";

import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import type { AlternativeClassification } from "@/types/shopper";
import { getStateStyle } from "@/components/analyzer/shopper-state-styles";

interface AlternativesRowProps {
  alternatives: AlternativeClassification[];
}

export function AlternativesRow({ alternatives }: AlternativesRowProps) {
  if (alternatives.length === 0) return null;

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-muted-foreground">Also considered:</span>
        {alternatives.map((alt) => {
          const style = getStateStyle(alt.state);
          return (
            <Tooltip key={alt.state}>
              <TooltipTrigger asChild>
                <button type="button">
                  <Badge variant="outline" className="cursor-help gap-1.5 border-border bg-surface-2 text-muted-foreground hover:border-border">
                    <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
                    {alt.state}
                    <span className="text-muted-foreground/60">{alt.confidence}%</span>
                  </Badge>
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-[240px]">
                <p className="font-medium text-foreground">Ruled out: {alt.state}</p>
                <p className="mt-1 text-muted-foreground">{alt.reasonRejected}</p>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
