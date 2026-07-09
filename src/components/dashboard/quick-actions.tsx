"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, FlaskConical, SlidersHorizontal, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ACTIONS = [
  {
    href: "/analyzer",
    icon: Sparkles,
    title: "Run a Session Analysis",
    description: "Paste raw events or load a sample session and watch the AI classify shopper intent live.",
    cta: "Open Analyzer",
    variant: "gradient" as const,
    accent: "text-accent-purple",
    bg: "bg-accent-purple/10",
  },
  {
    href: "/playground",
    icon: FlaskConical,
    title: "Explore the AI Playground",
    description: "Test prompts and reasoning strategies against real shopper behavior patterns.",
    cta: "Open Playground",
    variant: "outline" as const,
    accent: "text-accent-blue",
    bg: "bg-accent-blue/10",
  },
  {
    href: "/simulator",
    icon: SlidersHorizontal,
    title: "Tune the Rules Simulator",
    description: "Adjust personalization rules and preview the projected impact before shipping.",
    cta: "Open Simulator",
    variant: "outline" as const,
    accent: "text-accent-emerald",
    bg: "bg-accent-emerald/10",
  },
];

export function QuickActions() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25, duration: 0.5 }}
      className="grid grid-cols-1 gap-4 md:grid-cols-3"
    >
      {ACTIONS.map((action) => {
        const Icon = action.icon;
        return (
          <Card
            key={action.href}
            className="glass group relative flex flex-col justify-between overflow-hidden p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple"
          >
            <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-accent-purple/10 blur-3xl transition-opacity duration-300 group-hover:opacity-80" />
            <div className="relative">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${action.bg} ${action.accent}`}>
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{action.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{action.description}</p>
            </div>
            <Button asChild variant={action.variant} size="sm" className="relative mt-5 w-fit">
              <Link href={action.href}>
                {action.cta}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </Card>
        );
      })}
    </motion.div>
  );
}
