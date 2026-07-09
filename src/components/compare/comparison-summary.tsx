"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { ComparisonDiffRow, type DiffDirection } from "@/components/compare/comparison-diff-row";
import type { RiskLevel, SessionAnalysis, Urgency } from "@/types/shopper";

interface ComparisonSummaryProps {
  a: SessionAnalysis;
  b: SessionAnalysis;
  labelA: string;
  labelB: string;
}

const URGENCY_RANK: Record<Urgency, number> = { low: 0, medium: 1, high: 2, critical: 3 };
const RISK_RANK: Record<RiskLevel, number> = { low: 0, medium: 1, high: 2 };

function numericDelta(valueA: number, valueB: number, format: (n: number) => string): { text: string; direction: DiffDirection } {
  const diff = valueB - valueA;
  if (diff === 0) return { text: "No change", direction: "unchanged" };
  return {
    text: `${diff > 0 ? "+" : ""}${format(diff)}`,
    direction: diff > 0 ? "increased" : "decreased",
  };
}

function rankDelta<T extends string>(a: T, b: T, rank: Record<T, number>): { text: string; direction: DiffDirection } {
  const diff = rank[b] - rank[a];
  if (diff === 0) return { text: "Unchanged", direction: "unchanged" };
  return { text: diff > 0 ? "Increased" : "Decreased", direction: diff > 0 ? "increased" : "decreased" };
}

export function ComparisonSummary({ a, b, labelA, labelB }: ComparisonSummaryProps) {
  return (
    <Card className="glass">
      <CardHeader>
        <CardTitle>Headline differences</CardTitle>
        <CardDescription>
          {labelA} vs {labelB}
        </CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/60">
        <ComparisonDiffRow
          label="Shopper state"
          valueA={a.shopperState}
          valueB={b.shopperState}
          delta={
            a.shopperState === b.shopperState
              ? { text: "Same state", direction: "unchanged" }
              : undefined
          }
        />
        <ComparisonDiffRow
          label="Confidence"
          valueA={`${a.confidence}%`}
          valueB={`${b.confidence}%`}
          delta={numericDelta(a.confidence, b.confidence, (n) => `${n}%`)}
        />
        <ComparisonDiffRow
          label="Evidence strength"
          valueA={`${a.evidenceStrength}%`}
          valueB={`${b.evidenceStrength}%`}
          delta={numericDelta(a.evidenceStrength, b.evidenceStrength, (n) => `${n}%`)}
        />
        <ComparisonDiffRow
          label="Urgency"
          valueA={<span className="capitalize">{a.urgency}</span>}
          valueB={<span className="capitalize">{b.urgency}</span>}
          delta={rankDelta(a.urgency, b.urgency, URGENCY_RANK)}
        />
        <ComparisonDiffRow
          label="Risk level"
          valueA={<span className="capitalize">{a.riskLevel}</span>}
          valueB={<span className="capitalize">{b.riskLevel}</span>}
          delta={rankDelta(a.riskLevel, b.riskLevel, RISK_RANK)}
        />
        <ComparisonDiffRow
          label="Revenue impact"
          valueA={formatCurrency(a.estimatedRevenueImpact)}
          valueB={formatCurrency(b.estimatedRevenueImpact)}
          delta={numericDelta(a.estimatedRevenueImpact, b.estimatedRevenueImpact, (n) => formatCurrency(Math.abs(n)))}
        />
      </CardContent>
    </Card>
  );
}
