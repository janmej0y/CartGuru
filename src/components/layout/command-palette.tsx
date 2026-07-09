"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import {
  LayoutDashboard,
  Sparkles,
  FlaskConical,
  SlidersHorizontal,
  BarChart3,
  Info,
  Shuffle,
  Home,
  History,
  GitCompareArrows,
} from "lucide-react";
import { useSessionStore } from "@/lib/store/session-store";

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const router = useRouter();
  const loadRandomSession = useSessionStore((s) => s.loadRandomSession);

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") onOpenChange(false);
    }
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onOpenChange]);

  function go(href: string) {
    router.push(href);
    onOpenChange(false);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]" onClick={() => onOpenChange(false)}>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in-0" />
      <Command
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-lg overflow-hidden rounded-2xl border border-border bg-surface-2 shadow-glow animate-in fade-in-0 zoom-in-95"
      >
        <Command.Input
          autoFocus
          placeholder="Type a command or search..."
          className="w-full border-b border-border bg-transparent px-4 py-3.5 text-sm outline-none placeholder:text-muted-foreground"
        />
        <Command.List className="max-h-80 overflow-y-auto p-2">
          <Command.Empty className="py-6 text-center text-sm text-muted-foreground">No results found.</Command.Empty>

          <Command.Group heading="Navigate" className="px-2 py-1.5 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:mb-1.5">
            <PaletteItem icon={Home} label="Landing" onSelect={() => go("/")} />
            <PaletteItem icon={LayoutDashboard} label="Dashboard" onSelect={() => go("/dashboard")} />
            <PaletteItem icon={Sparkles} label="Session Analyzer" onSelect={() => go("/analyzer")} />
            <PaletteItem icon={FlaskConical} label="AI Playground" onSelect={() => go("/playground")} />
            <PaletteItem icon={SlidersHorizontal} label="Rules Simulator" onSelect={() => go("/simulator")} />
            <PaletteItem icon={BarChart3} label="Analytics" onSelect={() => go("/analytics")} />
            <PaletteItem icon={History} label="History" onSelect={() => go("/history")} />
            <PaletteItem icon={GitCompareArrows} label="Compare Sessions" onSelect={() => go("/compare")} />
            <PaletteItem icon={Info} label="About" onSelect={() => go("/about")} />
          </Command.Group>

          <Command.Group heading="Actions" className="px-2 py-1.5 text-xs font-medium text-muted-foreground [&_[cmdk-group-heading]]:mb-1.5">
            <PaletteItem
              icon={Shuffle}
              label="Load random session"
              onSelect={() => {
                loadRandomSession();
                go("/analyzer");
              }}
            />
          </Command.Group>
        </Command.List>
      </Command>
    </div>
  );
}

function PaletteItem({
  icon: Icon,
  label,
  onSelect,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onSelect: () => void;
}) {
  return (
    <Command.Item
      onSelect={onSelect}
      className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm text-foreground data-[selected=true]:bg-surface-3"
    >
      <Icon className="h-4 w-4 text-muted-foreground" />
      {label}
    </Command.Item>
  );
}
