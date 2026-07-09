"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { GitCompare, History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSessionStore } from "@/lib/store/session-store";
import { ComparisonSummary } from "@/components/compare/comparison-summary";
import { CompareColumn } from "@/components/compare/compare-column";

function ComparePageInner() {
  const searchParams = useSearchParams();
  const idA = searchParams.get("a");
  const idB = searchParams.get("b");

  const history = useSessionStore((s) => s.history);
  const entryA = idA ? history.find((h) => h.analysis.id === idA) : undefined;
  const entryB = idB ? history.find((h) => h.analysis.id === idB) : undefined;

  const labelA = entryA ? entryA.savedLabel ?? entryA.analysis.sessionId : null;
  const labelB = entryB ? entryB.savedLabel ?? entryB.analysis.sessionId : null;

  const isValid = !!entryA && !!entryB;

  return (
    <div className="container max-w-[1400px] py-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="font-display text-3xl font-semibold tracking-tight">Compare Sessions</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          {isValid ? (
            <>
              Side-by-side comparison of{" "}
              <span className="font-medium text-foreground">
                {labelA} ({entryA!.analysis.shopperState})
              </span>{" "}
              and{" "}
              <span className="font-medium text-foreground">
                {labelB} ({entryB!.analysis.shopperState})
              </span>
              .
            </>
          ) : (
            "Pick two saved analyses to see how their classifications, confidence, and recommendations differ."
          )}
        </p>
      </motion.div>

      {!isValid ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface px-6 py-24 text-center"
        >
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border bg-surface-2 text-muted-foreground">
            <GitCompare className="h-7 w-7" />
          </div>
          <div>
            <h2 className="font-display text-xl font-semibold text-foreground">Nothing to compare yet</h2>
            <p className="mx-auto mt-1.5 max-w-md text-sm text-muted-foreground">
              {idA || idB
                ? "One or both of the selected sessions couldn't be found — they may have been deleted from history."
                : "Head to History and select exactly two saved analyses to compare them side by side."}
            </p>
          </div>
          <Button asChild variant="gradient">
            <Link href="/history">
              <History className="h-4 w-4" />
              Go to History
            </Link>
          </Button>
        </motion.div>
      ) : (
        <div className="flex flex-col gap-6">
          <ComparisonSummary a={entryA!.analysis} b={entryB!.analysis} labelA={labelA!} labelB={labelB!} />

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <CompareColumn entry={entryA!} />
            <CompareColumn entry={entryB!} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={null}>
      <ComparePageInner />
    </Suspense>
  );
}
