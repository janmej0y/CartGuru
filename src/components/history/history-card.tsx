"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Star, Copy, Trash2, FolderOpen, Layers, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { cn, relativeTime } from "@/lib/utils";
import { getStateStyle } from "@/components/analyzer/shopper-state-styles";
import { useSessionStore } from "@/lib/store/session-store";
import { useRunAnalysis } from "@/lib/hooks/use-run-analysis";
import type { SavedAnalysis } from "@/types/shopper";

interface HistoryCardProps {
  entry: SavedAnalysis;
  selected: boolean;
  onToggleSelect: (id: string) => void;
}

export function HistoryCard({ entry, selected, onToggleSelect }: HistoryCardProps) {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDuplicating, setIsDuplicating] = useState(false);

  useEffect(() => setMounted(true), []);

  const toggleFavorite = useSessionStore((s) => s.toggleFavorite);
  const deleteFromHistory = useSessionStore((s) => s.deleteFromHistory);
  const reopenAnalysis = useSessionStore((s) => s.reopenAnalysis);
  const { runAnalysis } = useRunAnalysis();

  const { analysis, favorite, savedLabel, savedAt } = entry;
  const stateStyle = getStateStyle(analysis.shopperState);
  const StateIcon = stateStyle.icon;
  const title = savedLabel ?? analysis.sessionId;

  const handleDuplicate = async () => {
    setIsDuplicating(true);
    const result = await runAnalysis(analysis.sourceEvents);
    setIsDuplicating(false);
    if (result) {
      toast.success("Duplicated analysis created");
      router.push("/analyzer");
    }
  };

  const handleReopen = () => {
    reopenAnalysis(analysis.id);
    router.push("/analyzer");
  };

  const handleDelete = () => {
    deleteFromHistory(analysis.id);
    setDeleteOpen(false);
    toast.success("Removed from history");
  };

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25 }}
      >
        <Card
          className={cn(
            "group relative h-full overflow-hidden transition-all",
            selected ? "border-accent-purple shadow-glow-purple ring-1 ring-accent-purple" : "hover:border-border/80"
          )}
        >
          <button
            type="button"
            onClick={() => onToggleSelect(analysis.id)}
            className={cn(
              "absolute right-4 top-4 z-10 flex h-6 w-6 items-center justify-center rounded-full border transition-colors",
              selected
                ? "border-accent-purple bg-accent-purple text-white"
                : "border-border bg-surface-2 text-transparent hover:border-accent-purple/60"
            )}
            aria-label={selected ? "Deselect for comparison" : "Select for comparison"}
            title={selected ? "Deselect for comparison" : "Select for comparison"}
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>

          <CardContent className="flex flex-col gap-4 p-5">
            <div className="flex items-start gap-3 pr-8">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                  stateStyle.className
                )}
              >
                <StateIcon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-foreground">{title}</p>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted-foreground">
                  <span>{mounted ? relativeTime(savedAt) : " "}</span>
                  <span aria-hidden>&middot;</span>
                  <span className="inline-flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {analysis.sourceEvents.length} events
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className={cn("gap-1.5", stateStyle.className)}>
                <span className={cn("h-1.5 w-1.5 rounded-full", stateStyle.dot)} />
                {analysis.shopperState}
              </Badge>
              <Badge variant="secondary">{analysis.confidence}% confidence</Badge>
              {favorite && (
                <Badge variant="warning" className="gap-1">
                  <Star className="h-3 w-3 fill-current" />
                  Favorite
                </Badge>
              )}
            </div>

            <p className="line-clamp-2 text-xs text-muted-foreground">{analysis.aiExplanation}</p>

            <div className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleFavorite(analysis.id)}
                aria-label={favorite ? "Unfavorite" : "Favorite"}
                className={cn(favorite && "text-confidence-mid")}
              >
                <Star className={cn("h-4 w-4", favorite && "fill-current")} />
              </Button>
              <div className="flex items-center gap-1.5">
                <Button variant="outline" size="sm" onClick={handleDuplicate} disabled={isDuplicating}>
                  <Copy className="h-3.5 w-3.5" />
                  {isDuplicating ? "Running..." : "Duplicate"}
                </Button>
                <Button variant="secondary" size="sm" onClick={handleReopen}>
                  <FolderOpen className="h-3.5 w-3.5" />
                  Reopen
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-muted-foreground hover:text-confidence-low"
                  onClick={() => setDeleteOpen(true)}
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete this saved analysis?</DialogTitle>
            <DialogDescription>
              &ldquo;{title}&rdquo; will be permanently removed from your history. This can&rsquo;t be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
