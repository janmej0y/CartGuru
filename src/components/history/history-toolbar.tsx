"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { SHOPPER_STATES, type ShopperState } from "@/types/shopper";

export type HistorySortOption = "recent" | "oldest" | "confidence-high" | "confidence-low";

export const SORT_LABELS: Record<HistorySortOption, string> = {
  recent: "Most recent",
  oldest: "Oldest first",
  "confidence-high": "Highest confidence",
  "confidence-low": "Lowest confidence",
};

interface HistoryToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  sort: HistorySortOption;
  onSortChange: (value: HistorySortOption) => void;
  favoritesOnly: boolean;
  onFavoritesOnlyChange: (value: boolean) => void;
  stateFilter: ShopperState | "all";
  onStateFilterChange: (value: ShopperState | "all") => void;
}

export function HistoryToolbar({
  search,
  onSearchChange,
  sort,
  onSortChange,
  favoritesOnly,
  onFavoritesOnlyChange,
  stateFilter,
  onStateFilterChange,
}: HistoryToolbarProps) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-4 shadow-card sm:flex-row sm:flex-wrap sm:items-center">
      <div className="relative flex-1 sm:min-w-[220px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by label or shopper state..."
          className="pl-9"
        />
      </div>

      <Select value={stateFilter} onValueChange={(v) => onStateFilterChange(v as ShopperState | "all")}>
        <SelectTrigger className="sm:w-[190px]">
          <SelectValue placeholder="All states" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All states</SelectItem>
          {SHOPPER_STATES.map((state) => (
            <SelectItem key={state} value={state}>
              {state}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={sort} onValueChange={(v) => onSortChange(v as HistorySortOption)}>
        <SelectTrigger className="sm:w-[190px]">
          <SelectValue placeholder="Sort" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(SORT_LABELS) as HistorySortOption[]).map((key) => (
            <SelectItem key={key} value={key}>
              {SORT_LABELS[key]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <label className="flex shrink-0 items-center gap-2.5 rounded-lg border border-border bg-surface-2 px-3 py-2 text-sm text-foreground">
        <Switch checked={favoritesOnly} onCheckedChange={onFavoritesOnlyChange} />
        Favorites only
      </label>
    </div>
  );
}
