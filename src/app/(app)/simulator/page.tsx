"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dices, FileStack, Play, RotateCcw, SlidersHorizontal } from "lucide-react";
import { toast } from "sonner";
import { useSessionStore } from "@/lib/store/session-store";
import type { SessionEvent } from "@/types/events";
import type { SessionAnalysis } from "@/types/shopper";
import { EventRow } from "@/components/simulator/event-row";
import { AddEventDialog } from "@/components/simulator/add-event-dialog";
import { SimulatorResultPanel } from "@/components/simulator/simulator-result-panel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const DEBOUNCE_MS = 600;

export default function SimulatorPage() {
  const events = useSessionStore((s) => s.events);
  const sessionId = useSessionStore((s) => s.sessionId);
  const sessionLabel = useSessionStore((s) => s.sessionLabel);
  const analysis = useSessionStore((s) => s.analysis);
  const isAnalyzing = useSessionStore((s) => s.isAnalyzing);
  const error = useSessionStore((s) => s.error);

  const addEvent = useSessionStore((s) => s.addEvent);
  const removeEvent = useSessionStore((s) => s.removeEvent);
  const reorderEvents = useSessionStore((s) => s.reorderEvents);
  const updateEvent = useSessionStore((s) => s.updateEvent);
  const setEvents = useSessionStore((s) => s.setEvents);
  const loadRandomSession = useSessionStore((s) => s.loadRandomSession);
  const setAnalyzing = useSessionStore((s) => s.setAnalyzing);
  const setAnalysis = useSessionStore((s) => s.setAnalysis);
  const setError = useSessionStore((s) => s.setError);

  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const runAnalysis = useCallback(
    async (evts: SessionEvent[], sid: string) => {
      if (evts.length === 0) return;
      const myRequestId = ++requestIdRef.current;
      setAnalyzing(true);
      setError(null);
      try {
        const res = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId: sid, events: evts }),
        });
        const data = await res.json();
        if (myRequestId !== requestIdRef.current) return; // stale response
        if (!res.ok) {
          setError(data.error ?? "Failed to analyze session");
          toast.error(data.error ?? "Failed to analyze session");
          return;
        }
        setAnalysis(data.analysis as SessionAnalysis);
      } catch {
        if (myRequestId !== requestIdRef.current) return;
        setError("Network error while analyzing session");
        toast.error("Network error while analyzing session");
      } finally {
        if (myRequestId === requestIdRef.current) setAnalyzing(false);
      }
    },
    [setAnalyzing, setAnalysis, setError]
  );

  // auto rerun on any change to events, debounced
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (events.length === 0) return;
    debounceRef.current = setTimeout(() => {
      runAnalysis(events, sessionId);
    }, DEBOUNCE_MS);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, sessionId]);

  function handleMoveUp(index: number) {
    if (index === 0) return;
    reorderEvents(index, index - 1);
  }

  function handleMoveDown(index: number) {
    if (index === events.length - 1) return;
    reorderEvents(index, index + 1);
  }

  function handleDragStart(index: number) {
    setDragIndex(index);
  }

  function handleDragOver(index: number) {
    if (index !== dragOverIndex) setDragOverIndex(index);
  }

  function handleDrop() {
    if (dragIndex === null || dragOverIndex === null || dragIndex === dragOverIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }
    reorderEvents(dragIndex, dragOverIndex);
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setDragOverIndex(null);
  }

  function handleStartFromScratch() {
    setEvents([], "Custom session");
    toast.success("Cleared. Starting from scratch.");
  }

  function handleLoadSample() {
    setEvents(
      [
        { event: "view_product", product: "Nike Air Max 270", category: "Sneakers", price: 150 },
        { event: "compare_products", product: "Nike Air Max 270 vs Adidas Ultraboost" },
        { event: "add_to_cart", product: "Nike Air Max 270", price: 150 },
        { event: "begin_checkout" },
        { event: "abandon_checkout" },
      ],
      "Sample session"
    );
    toast.success("Loaded sample session");
  }

  function handleRerunNow() {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    runAnalysis(events, sessionId);
  }

  return (
    <div className="dot-grid relative min-h-screen">
      <div className="mx-auto max-w-7xl px-6 py-8 lg:px-10">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8 flex flex-wrap items-start justify-between gap-4"
        >
          <div>
            <div className="mb-2 flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue shadow-glow-purple">
                <SlidersHorizontal className="h-4.5 w-4.5 text-white" />
              </div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Rules Simulator</h1>
            </div>
            <p className="max-w-xl text-sm text-muted-foreground">
              Build or edit an event stream by hand and watch the AI reclassify the shopper in real time —
              every add, delete, and reorder triggers an automatic rerun.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="font-mono">{sessionLabel}</Badge>
            <Button variant="outline" size="sm" onClick={handleLoadSample}>
              <FileStack className="h-4 w-4" />
              Load sample
            </Button>
            <Button variant="outline" size="sm" onClick={loadRandomSession}>
              <Dices className="h-4 w-4" />
              Random mock session
            </Button>
            <Button variant="outline" size="sm" onClick={handleStartFromScratch}>
              <RotateCcw className="h-4 w-4" />
              Start from scratch
            </Button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_360px]">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-3">
              <div>
                <CardTitle>Event stream</CardTitle>
                <CardDescription>
                  {events.length} event{events.length === 1 ? "" : "s"} · reorder with the arrows or by dragging
                </CardDescription>
              </div>
              <Button size="sm" variant="gradient" onClick={handleRerunNow} disabled={events.length === 0}>
                <Play className="h-4 w-4" />
                Rerun now
              </Button>
            </CardHeader>
            <CardContent className="space-y-2.5">
              <AnimatePresence initial={false}>
                {events.map((event, index) => (
                  <EventRow
                    key={`${index}-${event.event}`}
                    event={event}
                    index={index}
                    total={events.length}
                    isDragging={dragIndex === index}
                    isDragOver={dragOverIndex === index && dragIndex !== index}
                    onUpdate={updateEvent}
                    onRemove={removeEvent}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onDragStart={handleDragStart}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop}
                    onDragEnd={handleDragEnd}
                  />
                ))}
              </AnimatePresence>

              {events.length === 0 && (
                <div className="rounded-xl border border-dashed border-border bg-surface-2/30 p-8 text-center">
                  <p className="text-sm text-muted-foreground">
                    No events yet. Add one below, or load a sample / random session to get started.
                  </p>
                </div>
              )}

              <div className="pt-1">
                <AddEventDialog onAdd={addEvent} />
              </div>
            </CardContent>
          </Card>

          <div>
            <SimulatorResultPanel
              analysis={analysis}
              isAnalyzing={isAnalyzing}
              error={error}
              eventCount={events.length}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
