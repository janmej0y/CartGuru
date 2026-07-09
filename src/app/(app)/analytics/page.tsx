"use client";

import dynamic from "next/dynamic";
import { motion } from "framer-motion";

function ChartSkeleton({ className = "h-[300px]" }: { className?: string }) {
  return <div className={`skeleton w-full rounded-2xl ${className}`} />;
}

const StateDistributionChart = dynamic(
  () => import("@/components/analytics/state-distribution-chart").then((m) => m.StateDistributionChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-[400px]" /> }
);
const SessionTrendsChart = dynamic(
  () => import("@/components/analytics/session-trends-chart").then((m) => m.SessionTrendsChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-[400px]" /> }
);
const OpportunityBarChart = dynamic(
  () => import("@/components/analytics/opportunity-bar-chart").then((m) => m.OpportunityBarChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-[440px]" /> }
);
const RevenueHeatmap = dynamic(
  () => import("@/components/analytics/revenue-heatmap").then((m) => m.RevenueHeatmap),
  { ssr: false, loading: () => <ChartSkeleton className="h-[380px]" /> }
);
const PerformanceSummaryCards = dynamic(
  () => import("@/components/analytics/performance-summary-cards").then((m) => m.PerformanceSummaryCards),
  { ssr: false, loading: () => <ChartSkeleton className="h-[380px]" /> }
);

export default function AnalyticsPage() {
  return (
    <div className="container max-w-[1400px] py-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-semibold tracking-tight">Analytics</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Deeper insight into personalization performance, classification confidence, and revenue opportunity.
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.08 } } }}
        className="flex flex-col gap-6"
      >
        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-5"
        >
          <div className="lg:col-span-2">
            <StateDistributionChart />
          </div>
          <div className="lg:col-span-3">
            <SessionTrendsChart />
          </div>
        </motion.div>

        <motion.div variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}>
          <OpportunityBarChart />
        </motion.div>

        <motion.div
          variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
          className="grid grid-cols-1 gap-6 lg:grid-cols-5"
        >
          <div className="lg:col-span-3">
            <RevenueHeatmap />
          </div>
          <div className="lg:col-span-2">
            <PerformanceSummaryCards />
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
