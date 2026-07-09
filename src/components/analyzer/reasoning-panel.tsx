"use client";

import { Terminal, Eye, Crosshair, EyeOff, BrainCircuit, Flag, Target, GitBranch } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { AIReasoning } from "@/types/shopper";

interface ReasoningPanelProps {
  reasoning: AIReasoning;
}

function BulletList({ items }: { items: string[] }) {
  if (items.length === 0) {
    return <p className="text-xs italic text-muted-foreground/60">None recorded.</p>;
  }
  return (
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-accent-purple/70" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ProseBlock({ text }: { text: string }) {
  return <p className="text-[13px] leading-relaxed text-muted-foreground">{text}</p>;
}

export function ReasoningPanel({ reasoning }: ReasoningPanelProps) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-surface-2/60">
      <div className="noise-bg absolute inset-0 opacity-40" />
      <div className="relative border-b border-border bg-surface-3/40 px-5 py-3">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-accent-purple" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            AI Reasoning Trace
          </span>
          <div className="ml-auto flex gap-1.5">
            <span className="h-2 w-2 rounded-full bg-confidence-low/60" />
            <span className="h-2 w-2 rounded-full bg-confidence-mid/60" />
            <span className="h-2 w-2 rounded-full bg-confidence-high/60" />
          </div>
        </div>
      </div>

      <div className="relative border-l-2 border-accent-purple/30 p-5">
        <Tabs defaultValue="observed" className="w-full">
          <TabsList className="mb-4 flex h-auto flex-wrap gap-1 bg-transparent p-0">
            <TabsTrigger value="observed" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <Eye className="h-3.5 w-3.5" /> Observed
            </TabsTrigger>
            <TabsTrigger value="important" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <Crosshair className="h-3.5 w-3.5" /> Important signals
            </TabsTrigger>
            <TabsTrigger value="ignored" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <EyeOff className="h-3.5 w-3.5" /> Ignored signals
            </TabsTrigger>
            <TabsTrigger value="reasoning" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <BrainCircuit className="h-3.5 w-3.5" /> Reasoning
            </TabsTrigger>
            <TabsTrigger value="decision" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <Flag className="h-3.5 w-3.5" /> Final decision
            </TabsTrigger>
            <TabsTrigger value="strategy" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <Target className="h-3.5 w-3.5" /> Business strategy
            </TabsTrigger>
            <TabsTrigger value="whynot" className="gap-1.5 border border-border bg-surface-2 data-[state=active]:border-accent-purple/40">
              <GitBranch className="h-3.5 w-3.5" /> Why not others
            </TabsTrigger>
          </TabsList>

          <TabsContent value="observed" className="mt-0 font-mono">
            <BulletList items={reasoning.observedBehaviors} />
          </TabsContent>
          <TabsContent value="important" className="mt-0 font-mono">
            <BulletList items={reasoning.importantSignals} />
          </TabsContent>
          <TabsContent value="ignored" className="mt-0 font-mono">
            <BulletList items={reasoning.ignoredSignals} />
          </TabsContent>
          <TabsContent value="reasoning" className="mt-0">
            <ProseBlock text={reasoning.reasoning} />
          </TabsContent>
          <TabsContent value="decision" className="mt-0">
            <ProseBlock text={reasoning.finalDecision} />
          </TabsContent>
          <TabsContent value="strategy" className="mt-0">
            <ProseBlock text={reasoning.businessStrategy} />
          </TabsContent>
          <TabsContent value="whynot" className="mt-0">
            <ProseBlock text={reasoning.whyNotOthers} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
