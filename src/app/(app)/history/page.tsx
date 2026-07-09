"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { History as HistoryIcon, GitCompare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/store/session-store";
import { HistoryToolbar, type HistorySortOption } from "@/components/history/history-toolbar";
import { HistoryCard } from "@/components/history/history-card";
import type { SavedAnalysis, ShopperState } from "@/types/shopper";

function sortEntries(entries: SavedAnalysis[], sort: HistorySortOption): SavedAnalysis[] {
  const sorted = [...entries];
  switch (sort) {
    case "recent":
      sorted.sort((a, b) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime());
      break;
    case "oldest":
      sorted.sort((a, b) => new Date(a.savedAt).getTime() - new Date(b.savedAt).getTime());
      break;
    case "confidence-high":
      sorted.sort((a, b) => b.analysis.confidence - a.analysis.confidence);
      break;
    case "confidence-low":
      sorted.sort((a, b) => a.analysis.confidence - b.analysis.confidence);
      break;
  }
  return sorted;
}

export default function HistoryPage() {
  const router = useRouter();
  const history = useSessionStore((s) => s.history);

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<HistorySortOption>("recent");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [stateFilter, setStateFilter] = useState<ShopperState | "all">("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    let entries = history.filter((entry) => {
      if (favoritesOnly && !entry.favorite) return false;
      if (stateFilter !== "all" && entry.analysis.shopperState !== stateFilter) return false;
      if (query) {
        const label = (entry.savedLabel ?? entry.analysis.sessionId).toLowerCase();
        const state = entry.analysis.shopperState.toLowerCase();
        if (!label.includes(query) && !state.includes(query)) return false;
      }
      return true;
    });

    const favorites = entries.filter((e) => e.favorite);
    const rest = entries.filter((e) => !e.favorite);
    entries = [...sortEntries(favorites, sort), ...sortEntries(rest, sort)];
    return entries;
  }, [history, search, sort, favoritesOnly, stateFilter]);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 2) {
        toast.error("Select exactly 2 to compare", {
          description: "Deselect one before choosing another session.",
        });
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleCompare = () => {
    if (selectedIds.length !== 2) return;
    const [a, b] = selectedIds;
    router.push(`/compare?a=${encodeURIComponent(a!)}&b=${encodeURIComponent(b!)}`);
  };

  return (
    <div className="container max-w-[1400px] py-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-wrap items-end justify-between gap-4"
      >
        <div>
          <h1 className="font-display text-3xl font-semibold tracking-tight">History</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Every saved analysis from the reasoning engine, ready to revisit, duplicate, or compare.
          </p>
        </div>
      </motion.div>

      {history.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-24 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-muted-foreground">
            <HistoryIcon className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">No saved analyses yet</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
              Run an analysis on the Analyzer page and it will automatically be saved here so you can revisit,
              duplicate, or compare it later.
            </p>
          </div>
          <Button asChild variant="gradient">
            <Link href="/analyzer">
              <Sparkles className="h-4 w-4" />
              Go to Analyzer
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6 pb-24">
          <HistoryToolbar
            search={search}
            onSearchChange={setSearch}
            sort={sort}
            onSortChange={setSort}
            favoritesOnly={favoritesOnly}
            onFavoritesOnlyChange={setFavoritesOnly}
            stateFilter={stateFilter}
            onStateFilterChange={setStateFilter}
          />

          {filtered.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-16 text-center text-sm text-muted-foreground">
              No saved analyses match your filters.
            </div>
          ) : (
            <motion.div
              layout
              className="grid grid-cols-1 gap-4 lg:grid-cols-2"
            >
              <AnimatePresence mode="popLayout">
                {filtered.map((entry) => (
                  <HistoryCard
                    key={entry.analysis.id}
                    entry={entry}
                    selected={selectedIds.includes(entry.analysis.id)}
                    onToggleSelect={toggleSelect}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      )}

      <AnimatePresence>
        {selectedIds.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-6 left-1/2 z-40 -translate-x-1/2"
          >
            <Button variant="gradient" size="lg" onClick={handleCompare} className="shadow-glow-purple">
              <GitCompare className="h-4 w-4" />
              Compare selected (2)
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
