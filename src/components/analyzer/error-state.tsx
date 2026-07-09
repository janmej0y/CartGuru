"use client";

import { AlertTriangle, RotateCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <Card className="border-confidence-low/30 bg-confidence-low/5">
      <CardContent className="flex flex-col items-center gap-4 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-confidence-low/10">
          <AlertTriangle className="h-6 w-6 text-confidence-low" />
        </div>
        <div className="space-y-1.5">
          <h3 className="font-display text-lg font-semibold text-foreground">Analysis failed</h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">{message}</p>
          <p className="mx-auto max-w-sm text-xs text-muted-foreground">
            Check that your JSON is a valid array of event objects, e.g.{" "}
            <code className="rounded bg-surface-3 px-1 py-0.5 font-mono text-[11px]">
              {`[{ "event": "view_product", "product": "..." }]`}
            </code>
          </p>
        </div>
        <Button variant="secondary" onClick={onRetry}>
          <RotateCw />
          Retry
        </Button>
      </CardContent>
    </Card>
  );
}
