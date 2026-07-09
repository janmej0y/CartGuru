"use client";

import { Sparkles, Gauge, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import type { SessionAnalysis } from "@/types/shopper";
import { getStateStyle } from "@/components/analyzer/shopper-state-styles";
import { ConfidenceMeter } from "@/components/analyzer/confidence-meter";
import { AlternativesRow } from "@/components/analyzer/alternatives-row";

const URGENCY_VARIANT: Record<SessionAnalysis["urgency"], "danger" | "warning" | "blue" | "secondary"> = {
  critical: "danger",
  high: "warning",
  medium: "blue",
  low: "secondary",
};

const RISK_VARIANT: Record<SessionAnalysis["riskLevel"], "danger" | "warning" | "success"> = {
  high: "danger",
  medium: "warning",
  low: "success",
};

interface AnalysisStateHeaderProps {
  analysis: SessionAnalysis;
  /** Compact mode drops the gradient border + secondary bars for tighter side-by-side layouts (e.g. Compare). */
  compact?: boolean;
}

export function AnalysisStateHeader({ analysis, compact = false }: AnalysisStateHeaderProps) {
  const stateStyle = getStateStyle(analysis.shopperState);
  const StateIcon = stateStyle.icon;

  return (
    <Card className={cn("glass overflow-hidden border-border", !compact && "gradient-border")}>
      <CardContent className="flex flex-col gap-6 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border",
                stateStyle.className
              )}
            >
              <StateIcon className="h-7 w-7" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-foreground">{analysis.shopperState}</h2>
                <Badge variant={analysis.source === "gemini" ? "purple" : "secondary"} className="gap-1">
                  <Sparkles className="h-3 w-3" />
                  {analysis.source === "gemini" ? "Gemini" : "Mock Engine"}
                </Badge>
              </div>
              <p className="mt-1 max-w-md text-sm text-muted-foreground">{stateStyle.description}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant={URGENCY_VARIANT[analysis.urgency]} className="gap-1">
              <Gauge className="h-3 w-3" />
              {analysis.urgency} urgency
            </Badge>
            <Badge variant={RISK_VARIANT[analysis.riskLevel]} className="gap-1">
              <ShieldAlert className="h-3 w-3" />
              {analysis.riskLevel} risk
            </Badge>
          </div>
        </div>

        <Separator />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-[auto_1fr] sm:items-center">
          <ConfidenceMeter value={analysis.confidence} label="Overall confidence" />
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Evidence strength</span>
                <span className="font-medium text-foreground">{analysis.evidenceStrength}%</span>
              </div>
              <Progress value={analysis.evidenceStrength} className="h-1.5" indicatorClassName="bg-accent-blue" />
            </div>
            <div>
              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Model confidence</span>
                <span className="font-medium text-foreground">{analysis.modelConfidence}%</span>
              </div>
              <Progress value={analysis.modelConfidence} className="h-1.5" indicatorClassName="bg-accent-purple" />
            </div>
            {!compact && <AlternativesRow alternatives={analysis.alternatives} />}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
