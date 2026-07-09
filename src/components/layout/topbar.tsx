"use client";

import { useEffect, useRef, useState } from "react";
import { Search, Bell, ChevronDown, Command, Sparkles, TrendingDown, Users, Plus } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { CommandPalette } from "@/components/layout/command-palette";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { cn } from "@/lib/utils";

interface Workspace {
  name: string;
  dotClass: string;
}

const WORKSPACES: Workspace[] = [
  { name: "Acme Retail Co.", dotClass: "bg-accent-emerald" },
  { name: "Northwind Apparel", dotClass: "bg-accent-blue" },
  { name: "Fixture & Form Co.", dotClass: "bg-accent-purple" },
];

const NOTIFICATIONS = [
  {
    icon: TrendingDown,
    tone: "text-confidence-low",
    title: "3 sessions flagged as Cart Abandoner",
    detail: "High churn risk in the last hour — review recommended actions.",
    time: "12m ago",
  },
  {
    icon: Sparkles,
    tone: "text-accent-purple",
    title: "New personalization recommendation ready",
    detail: "AI suggests a free shipping banner for Discount Seekers.",
    time: "48m ago",
  },
  {
    icon: Users,
    tone: "text-accent-emerald",
    title: "Weekly digest available",
    detail: "129 sessions analyzed, 79.4% average confidence.",
    time: "3h ago",
  },
];

export function Topbar() {
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [workspace, setWorkspace] = useState<Workspace>(WORKSPACES[0]!);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setNotifOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <>
      <header className="no-print sticky top-0 z-20 flex h-16 items-center gap-4 border-b border-border bg-background/70 px-4 backdrop-blur-xl lg:pl-6 lg:pr-8">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg border border-border bg-surface-2 px-2.5 py-1.5 text-xs text-muted-foreground outline-none transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
            <span className={cn("h-1.5 w-1.5 rounded-full", workspace.dotClass)} />
            {workspace.name}
            <ChevronDown className="h-3 w-3" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
            {WORKSPACES.map((ws) => (
              <DropdownMenuItem
                key={ws.name}
                onSelect={() => {
                  setWorkspace(ws);
                  toast.success(`Switched to ${ws.name}`);
                }}
              >
                <span className={cn("h-1.5 w-1.5 rounded-full", ws.dotClass)} />
                <span className="flex-1">{ws.name}</span>
                {ws.name === workspace.name && (
                  <span className="h-1.5 w-1.5 rounded-full bg-accent-purple" />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="cursor-not-allowed opacity-50">
              <Plus className="h-3.5 w-3.5" />
              <span>Add workspace</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <button
          onClick={() => setPaletteOpen(true)}
          className="ml-2 hidden flex-1 max-w-md items-center gap-2 rounded-lg border border-border bg-surface-2 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-accent-purple/40 hover:text-foreground md:flex"
        >
          <Search className="h-3.5 w-3.5" />
          <span className="flex-1 text-left">Search sessions, states, actions...</span>
          <kbd className="flex items-center gap-0.5 rounded border border-border bg-surface-3 px-1.5 py-0.5 text-[10px]">
            <Command className="h-2.5 w-2.5" />K
          </kbd>
        </button>

        <div className="ml-auto flex items-center gap-3">
          <button
            onClick={() => setPaletteOpen(true)}
            className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground md:hidden"
          >
            <Search className="h-4 w-4" />
          </button>

          <div ref={notifRef} className="relative">
            <button
              onClick={() => setNotifOpen((v) => !v)}
              aria-label="Notifications"
              aria-expanded={notifOpen}
              className={cn(
                "relative rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground",
                notifOpen && "bg-surface-2 text-foreground"
              )}
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent-purple" />
            </button>

            {notifOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-80 overflow-hidden rounded-xl border border-border bg-surface-2 shadow-glow animate-in fade-in-0 zoom-in-95">
                <div className="flex items-center justify-between border-b border-border px-4 py-3">
                  <span className="text-sm font-medium text-foreground">Notifications</span>
                  <Badge variant="purple">{NOTIFICATIONS.length} new</Badge>
                </div>
                <div className="max-h-80 overflow-y-auto">
                  {NOTIFICATIONS.map((n, i) => (
                    <div
                      key={i}
                      className="flex gap-3 border-b border-border/60 px-4 py-3 last:border-0 hover:bg-surface-3"
                    >
                      <n.icon className={cn("mt-0.5 h-4 w-4 shrink-0", n.tone)} />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{n.title}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{n.detail}</p>
                        <p className="mt-1 text-[11px] text-muted-foreground/70">{n.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <ThemeToggle />

          <Badge variant="emerald" className="hidden sm:inline-flex">
            Gemini · Live
          </Badge>

          <div className="flex items-center gap-2 pl-2">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarFallback>JJ</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
    </>
  );
}
