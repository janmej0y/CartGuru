"use client";

import { Sparkles, Shuffle, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface EmptyStateProps {
  onTrySample: () => void;
  onRandomSession: () => void;
}

export function EmptyState({ onTrySample, onRandomSession }: EmptyStateProps) {
  return (
    <Card className="glass dot-grid relative overflow-hidden border-border">
      <CardContent className="flex flex-col items-center gap-6 px-6 py-16 text-center">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent-purple/10 animate-pulse-glow" />
          <div className="absolute inset-2 rounded-full border border-accent-purple/30 animate-float" />
          <Sparkles className="relative h-8 w-8 text-accent-purple" />
        </div>

        <div className="space-y-2">
          <h3 className="font-display text-xl font-semibold text-foreground">No session analyzed yet</h3>
          <p className="mx-auto max-w-sm text-sm text-muted-foreground">
            Paste a raw event stream on the left, or load a sample session to see the AI classify shopper intent,
            explain its reasoning, and recommend a personalization action in seconds.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button variant="gradient" onClick={onTrySample}>
            <Wand2 />
            Try a sample session
          </Button>
          <Button variant="outline" onClick={onRandomSession}>
            <Shuffle />
            Generate random session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
