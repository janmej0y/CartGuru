"use client";

import { useEffect, useState } from "react";
import { ListChecks } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { relativeTime } from "@/lib/utils";
import { AnalysisStateHeader } from "@/components/analyzer/analysis-state-header";
import { SessionTimeline } from "@/components/analyzer/session-timeline";
import { CompactRecommendations } from "@/components/compare/compact-recommendations";
import type { SavedAnalysis } from "@/types/shopper";

interface CompareColumnProps {
  entry: SavedAnalysis;
}

export function CompareColumn({ entry }: CompareColumnProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const { analysis, savedLabel, savedAt } = entry;

  return (
    <div className="flex flex-col gap-4">
      <div>
        <p className="truncate text-sm font-semibold text-foreground">{savedLabel ?? analysis.sessionId}</p>
        <p className="text-xs text-muted-foreground">Saved {mounted ? relativeTime(savedAt) : " "}</p>
      </div>

      <AnalysisStateHeader analysis={analysis} compact />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Session timeline</CardTitle>
          <CardDescription>The event stream that produced this analysis.</CardDescription>
        </CardHeader>
        <CardContent>
          <SessionTimeline events={analysis.sourceEvents} timelineEvidence={analysis.timelineEvidence} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ListChecks className="h-4 w-4 text-accent-purple" />
            Top recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <CompactRecommendations recommendations={analysis.recommendations} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Key evidence</CardTitle>
        </CardHeader>
        <CardContent>
          {analysis.evidence.length === 0 ? (
            <p className="text-sm text-muted-foreground">No evidence points recorded.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {analysis.evidence.map((point, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-purple" />
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
