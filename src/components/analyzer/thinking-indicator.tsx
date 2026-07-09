"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const PHASES = [
  "Reading events",
  "Finding behavioral patterns",
  "Understanding shopper intent",
  "Calculating confidence",
  "Generating recommendations",
];

export function ThinkingIndicator() {
  const [phaseIndex, setPhaseIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPhaseIndex((i) => (i + 1) % PHASES.length);
    }, 1150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <Card className="glass border-accent-purple/20">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent-purple/10">
            <Sparkles className="h-5 w-5 text-accent-purple animate-pulse-glow" />
          </div>
          <div className="flex flex-col gap-1">
            <span className="shimmer-text font-display text-base font-semibold">Analyzing shopper behavior&hellip;</span>
            <AnimatePresence mode="wait">
              <motion.span
                key={phaseIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="text-sm text-muted-foreground"
              >
                {PHASES[phaseIndex]}&hellip;
              </motion.span>
            </AnimatePresence>
          </div>
          <div className="ml-auto flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="h-2 w-2 rounded-full bg-accent-purple animate-pulse-glow"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skeleton placeholders for what's coming */}
      <Card className="border-border">
        <CardContent className="space-y-4 p-6">
          <div className="flex items-center gap-4">
            <div className="skeleton h-16 w-16 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="skeleton h-5 w-40 rounded-md" />
              <div className="skeleton h-4 w-24 rounded-md" />
            </div>
          </div>
          <div className="skeleton h-24 w-full rounded-xl" />
          <div className="space-y-2">
            <div className="skeleton h-3 w-full rounded-md" />
            <div className="skeleton h-3 w-5/6 rounded-md" />
            <div className="skeleton h-3 w-2/3 rounded-md" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="skeleton h-28 rounded-2xl" />
        <div className="skeleton h-28 rounded-2xl" />
      </div>
    </div>
  );
}
