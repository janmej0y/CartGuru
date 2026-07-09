"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownRight, Users, Target, Gauge, TrendingUp, DollarSign, Cpu } from "lucide-react";
import { Card } from "@/components/ui/card";
import { AnimatedCounter } from "@/components/dashboard/animated-counter";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export interface StatWidgetsData {
  todaySessions: number;
  sessionsDeltaPct: number;
  classifiedUsers: number;
  classifiedDeltaPct: number;
  avgConfidence: number;
  confidenceDeltaPct: number;
  conversionLift: number;
  conversionLiftDeltaPct: number;
  revenueOpportunity: number;
  revenueDeltaPct: number;
}

function Trend({ deltaPct, invert = false }: { deltaPct: number; invert?: boolean }) {
  const isPositive = invert ? deltaPct < 0 : deltaPct >= 0;
  const Icon = deltaPct >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-xs font-medium",
        isPositive ? "text-confidence-high" : "text-confidence-low"
      )}
    >
      <Icon className="h-3.5 w-3.5" />
      {Math.abs(deltaPct).toFixed(1)}%
    </span>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export function StatWidgets({ data }: { data: StatWidgetsData }) {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6"
    >
      <motion.div variants={cardVariants}>
        <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-purple/10 text-accent-purple">
              <Users className="h-4.5 w-4.5" />
            </div>
            <Trend deltaPct={data.sessionsDeltaPct} />
          </div>
          <p className="mt-4 font-display text-2xl font-semibold tabular-nums">
            <AnimatedCounter value={data.todaySessions} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Today&apos;s Sessions</p>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-blue/10 text-accent-blue">
              <Target className="h-4.5 w-4.5" />
            </div>
            <Trend deltaPct={data.classifiedDeltaPct} />
          </div>
          <p className="mt-4 font-display text-2xl font-semibold tabular-nums">
            <AnimatedCounter value={data.classifiedUsers} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Classified Users</p>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-confidence-high/10 text-confidence-high">
              <Gauge className="h-4.5 w-4.5" />
            </div>
            <Trend deltaPct={data.confidenceDeltaPct} />
          </div>
          <p className="mt-4 font-display text-2xl font-semibold tabular-nums">
            <AnimatedCounter value={data.avgConfidence} decimals={1} suffix="%" />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Average Confidence</p>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-emerald/10 text-accent-emerald">
              <TrendingUp className="h-4.5 w-4.5" />
            </div>
            <Trend deltaPct={data.conversionLiftDeltaPct} />
          </div>
          <p className="mt-4 font-display text-2xl font-semibold tabular-nums">
            <AnimatedCounter value={data.conversionLift} decimals={1} suffix="%" />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Conversion Lift</p>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-confidence-mid/10 text-confidence-mid">
              <DollarSign className="h-4.5 w-4.5" />
            </div>
            <Trend deltaPct={data.revenueDeltaPct} />
          </div>
          <p className="mt-4 font-display text-2xl font-semibold tabular-nums">
            <AnimatedCounter value={data.revenueOpportunity} format={(n) => formatCurrency(n)} />
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Revenue Opportunity</p>
        </Card>
      </motion.div>

      <motion.div variants={cardVariants}>
        <Card className="glass group h-full p-5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-glow-purple">
          <div className="flex items-center justify-between">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface-3 text-foreground">
              <Cpu className="h-4.5 w-4.5" />
            </div>
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-confidence-high opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-confidence-high" />
            </span>
          </div>
          <p className="mt-4 font-display text-2xl font-semibold text-confidence-high">Operational</p>
          <p className="mt-1 text-xs text-muted-foreground">Live AI Status &middot; Reasoning Engine</p>
        </Card>
      </motion.div>
    </motion.div>
  );
}
