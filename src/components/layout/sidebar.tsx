"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Sparkles,
  FlaskConical,
  SlidersHorizontal,
  BarChart3,
  Info,
  Cpu,
  History,
  GitCompareArrows,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/analyzer", label: "Session Analyzer", icon: Sparkles },
  { href: "/playground", label: "AI Playground", icon: FlaskConical },
  { href: "/simulator", label: "Rules Simulator", icon: SlidersHorizontal },
  { href: "/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/history", label: "History", icon: History },
  { href: "/compare", label: "Compare", icon: GitCompareArrows },
  { href: "/about", label: "About", icon: Info },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="no-print hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 z-30 border-r border-border bg-surface/60 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-2.5 px-6">
        <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
          <Cpu className="h-4 w-4 text-white" />
        </div>
        <span className="font-display text-[15px] font-semibold tracking-tight">CartGuru</span>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + "/");
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 rounded-lg bg-surface-2 border border-border"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
                />
              )}
              <Icon className={cn("relative z-10 h-4 w-4", active && "text-accent-purple")} />
              <span className="relative z-10">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-3">
        <div className="rounded-xl border border-border bg-surface-2/60 p-3.5">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-confidence-high opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-confidence-high" />
            </span>
            <span className="text-xs font-medium text-foreground">AI Engine Live</span>
          </div>
          <p className="mt-1.5 text-[11px] leading-relaxed text-muted-foreground">
            Reasoning core ready to classify sessions.
          </p>
        </div>
      </div>
    </aside>
  );
}
