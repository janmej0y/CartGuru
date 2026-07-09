"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MOCK_SESSIONS } from "@/lib/data/mock-sessions";
import { useChartTheme } from "@/lib/chart-theme";
import { relativeTime } from "@/lib/utils";
import { personaConfidence } from "@/components/dashboard/dashboard-stats";
import type { ShopperState } from "@/types/shopper";

export function RecentActivity() {
  const sessions = useMemo(() => {
    return [...MOCK_SESSIONS]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 9);
  }, []);

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const { stateColors } = useChartTheme();

  return (
    <Card className="glass h-full">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest sessions classified by the reasoning engine</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.045 } } }}
          className="flex flex-col"
        >
          {sessions.map((session) => {
            const persona = session.persona as ShopperState;
            const confidence = personaConfidence(session.persona);
            return (
              <motion.div
                key={session.id}
                variants={{ hidden: { opacity: 0, x: -8 }, show: { opacity: 1, x: 0 } }}
                className="group flex items-center gap-3 border-b border-border/60 py-3 last:border-0"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: stateColors[persona] }}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-foreground">{session.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {mounted ? relativeTime(session.createdAt) : " "} &middot; {session.events.length} events
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className="hidden shrink-0 sm:inline-flex"
                  style={{
                    borderColor: `${stateColors[persona]}4d`,
                    color: stateColors[persona],
                    backgroundColor: `${stateColors[persona]}1a`,
                  }}
                >
                  {persona}
                </Badge>
                <span className="w-12 shrink-0 text-right font-mono text-xs text-muted-foreground">
                  {confidence}%
                </span>
                <Link
                  href="/analyzer"
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground opacity-0 transition-all hover:bg-surface-2 hover:text-foreground group-hover:opacity-100"
                  aria-label={`View ${session.label}`}
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </CardContent>
    </Card>
  );
}
