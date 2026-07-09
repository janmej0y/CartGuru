"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { PersonalizationRecommendation } from "@/types/shopper";
import { getRecommendationIcon, RECOMMENDATION_TYPE_LABELS } from "@/components/analyzer/recommendation-icons";

interface RecommendationCardProps {
  recommendation: PersonalizationRecommendation;
  index: number;
}

const EFFORT_VARIANT: Record<PersonalizationRecommendation["effort"], "success" | "warning" | "danger"> = {
  low: "success",
  medium: "warning",
  high: "danger",
};

export function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const Icon = getRecommendationIcon(recommendation.type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Card className="h-full border-border transition-colors hover:border-accent-purple/40">
        <CardContent className="flex h-full flex-col gap-3 p-5">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
                <Icon className="h-4 w-4" />
              </div>
              <div>
                <p className="font-display text-sm font-semibold leading-tight text-foreground">{recommendation.title}</p>
                <p className="text-[11px] text-muted-foreground">{RECOMMENDATION_TYPE_LABELS[recommendation.type]}</p>
              </div>
            </div>
            <span className="shrink-0 rounded-full bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
              #{recommendation.priority}
            </span>
          </div>

          <p className="flex-1 text-xs leading-relaxed text-muted-foreground">{recommendation.why}</p>

          <div className="flex flex-wrap items-center gap-2 pt-1">
            <Badge variant="emerald" className="gap-1">
              <TrendingUp className="h-3 w-3" />
              {recommendation.expectedConversionLift}
            </Badge>
            <Badge variant={EFFORT_VARIANT[recommendation.effort]}>{recommendation.effort} effort</Badge>
            <span className="ml-auto text-[11px] text-muted-foreground">
              {recommendation.confidence}% conf.
            </span>
          </div>

          <Progress
            value={recommendation.confidence}
            className="h-1.5"
            indicatorClassName={
              recommendation.confidence >= 75
                ? "bg-confidence-high"
                : recommendation.confidence >= 50
                ? "bg-confidence-mid"
                : "bg-confidence-low"
            }
          />
        </CardContent>
      </Card>
    </motion.div>
  );
}
