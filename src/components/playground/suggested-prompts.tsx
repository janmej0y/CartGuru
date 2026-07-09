"use client";

import { motion } from "framer-motion";
import { Lightbulb } from "lucide-react";
import type { ShopperState } from "@/types/shopper";

interface SuggestedPromptsProps {
  shopperState: ShopperState | null;
  onSelect: (prompt: string) => void;
}

export function SuggestedPrompts({ shopperState, onSelect }: SuggestedPromptsProps) {
  const prompts = [
    `Why did you classify this as ${shopperState ?? "this shopper state"}?`,
    "How can I increase conversion?",
    "What if this user visits again?",
    "What's the biggest risk here?",
  ];

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
      {prompts.map((prompt, i) => (
        <motion.button
          key={prompt}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3 }}
          onClick={() => onSelect(prompt)}
          className="group flex items-start gap-2 rounded-xl border border-border bg-surface-2/60 p-3 text-left text-xs text-muted-foreground transition-colors hover:border-accent-purple/40 hover:bg-surface-2 hover:text-foreground"
        >
          <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent-purple/70 group-hover:text-accent-purple" />
          <span className="leading-relaxed">{prompt}</span>
        </motion.button>
      ))}
    </div>
  );
}
