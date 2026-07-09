"use client";

import { useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { StatWidgets } from "@/components/dashboard/stat-widgets";
import { AiHealthWidget } from "@/components/dashboard/ai-health-widget";
import { TopShopperStateWidget } from "@/components/dashboard/top-shopper-state-widget";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { QuickActions } from "@/components/dashboard/quick-actions";

function ChartSkeleton({ className = "h-[260px]" }: { className?: string }) {
  return <div className={`skeleton w-full rounded-2xl ${className}`} />;
}

const ClassificationDonut = dynamic(
  () => import("@/components/dashboard/classification-donut").then((m) => m.ClassificationDonut),
  { ssr: false, loading: () => <ChartSkeleton className="h-[340px]" /> }
);
const SessionTrendChart = dynamic(
  () => import("@/components/dashboard/session-trend-chart").then((m) => m.SessionTrendChart),
  { ssr: false, loading: () => <ChartSkeleton className="h-[340px]" /> }
);
import {
  getAverageConfidence,
  getPersonaDistribution,
  getTodayStats,
} from "@/components/dashboard/dashboard-stats";
import { MOCK_SESSIONS } from "@/lib/data/mock-sessions";

export default function DashboardPage() {
  const stats = useMemo(() => {
    const { todayPoint, sessionsDeltaPct, confidenceDeltaPct } = getTodayStats();
    const distribution = getPersonaDistribution();
    const avgConfidence = getAverageConfidence();

    const highOpportunityCount = distribution
      .filter((d) => ["Cart Abandoner", "Discount Seeker", "Uncertain Buyer"].includes(d.persona))
      .reduce((sum, d) => sum + d.count, 0);

    const classifiedUsers = MOCK_SESSIONS.length * 47; // extrapolated multiplier for "today" scale
    const conversionLift = 18.4;
    const revenueOpportunity = highOpportunityCount * 1240 + classifiedUsers * 6.8;

    return {
      todaySessions: todayPoint.sessions,
      sessionsDeltaPct,
      classifiedUsers,
      classifiedDeltaPct: 6.2,
      avgConfidence,
      confidenceDeltaPct,
      conversionLift,
      conversionLiftDeltaPct: 2.1,
      revenueOpportunity,
      revenueDeltaPct: 9.4,
    };
  }, []);

  return (
    <div className="container max-w-[1400px] py-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">Dashboard</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Real-time overview of shopper classification and personalization performance.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
          Today &middot; Jul 9, 2026
        </div>
      </motion.div>

      <div className="flex flex-col gap-6">
        <StatWidgets data={stats} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <AiHealthWidget />
          <TopShopperStateWidget />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <ClassificationDonut />
          </div>
          <div className="lg:col-span-2">
            <SessionTrendChart />
          </div>
        </div>

        <RecentActivity />

        <QuickActions />
      </div>
    </div>
  );
}
