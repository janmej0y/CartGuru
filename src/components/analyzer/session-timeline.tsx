"use client";

import { motion } from "framer-motion";
import { Circle } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import type { SessionEvent } from "@/types/events";
import { EVENT_LABELS } from "@/types/events";
import type { TimelineEvidencePoint } from "@/types/shopper";
import { getEventIcon } from "@/components/analyzer/event-icons";

interface SessionTimelineProps {
  events: SessionEvent[];
  timelineEvidence: TimelineEvidencePoint[];
}

const WEIGHT_STYLES: Record<TimelineEvidencePoint["weight"], { ring: string; bg: string; text: string; line: string }> = {
  signal: {
    ring: "ring-2 ring-accent-purple/60",
    bg: "bg-accent-purple/15 text-accent-purple",
    text: "text-foreground",
    line: "bg-accent-purple/40",
  },
  supporting: {
    ring: "ring-1 ring-border",
    bg: "bg-surface-3 text-muted-foreground",
    text: "text-muted-foreground",
    line: "bg-border",
  },
  noise: {
    ring: "ring-1 ring-border/50 ring-dashed",
    bg: "bg-surface-2 text-muted-foreground/50",
    text: "text-muted-foreground/50",
    line: "bg-border/30",
  },
};

export function SessionTimeline({ events, timelineEvidence }: SessionTimelineProps) {
  const evidenceByIndex = new Map(timelineEvidence.map((e) => [e.eventIndex, e]));

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex gap-0 overflow-x-auto pb-2">
        {events.map((event, i) => {
          const Icon = getEventIcon(event.event);
          const evidence = evidenceByIndex.get(i);
          const weight = evidence?.weight ?? "noise";
          const style = WEIGHT_STYLES[weight];
          const isLast = i === events.length - 1;

          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
              className="flex shrink-0 flex-col items-center"
            >
              <div className="flex items-center">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className={cn(
                        "flex h-10 w-10 items-center justify-center rounded-full transition-transform hover:scale-110",
                        style.bg,
                        style.ring,
                        weight === "noise" && "border border-dashed border-border/50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[220px]">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">
                        {EVENT_LABELS[event.event] ?? event.event}
                      </p>
                      {event.product && <p className="text-muted-foreground">{event.product}</p>}
                      {event.category && <p className="text-muted-foreground">{event.category}</p>}
                      {typeof event.price === "number" && (
                        <p className="text-muted-foreground">{formatCurrency(event.price)}</p>
                      )}
                      {event.timestamp && (
                        <p className="text-muted-foreground/70">{new Date(event.timestamp).toLocaleString()}</p>
                      )}
                      {evidence?.note && (
                        <p className="mt-1 border-t border-border pt-1 text-[11px] text-accent-purple">
                          {evidence.note}
                        </p>
                      )}
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground/60">
                        {weight === "signal" ? "Key signal" : weight === "supporting" ? "Supporting" : "Noise"}
                      </p>
                    </div>
                  </TooltipContent>
                </Tooltip>
                {!isLast && <div className={cn("h-px w-6 shrink-0 sm:w-8", style.line)} />}
              </div>
              <span className={cn("mt-1.5 w-16 truncate text-center text-[10px]", style.text)} title={event.event}>
                {EVENT_LABELS[event.event]?.split(" ")[0] ?? event.event}
              </span>
            </motion.div>
          );
        })}
        {events.length === 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Circle className="h-4 w-4" /> No events
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
