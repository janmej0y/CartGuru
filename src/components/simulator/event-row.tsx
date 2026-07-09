"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, GripVertical, Trash2 } from "lucide-react";
import { EVENT_LABELS, type SessionEvent } from "@/types/events";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EVENT_TYPES = Object.keys(EVENT_LABELS);

interface EventRowProps {
  event: SessionEvent;
  index: number;
  total: number;
  isDragging: boolean;
  isDragOver: boolean;
  onUpdate: (index: number, event: SessionEvent) => void;
  onRemove: (index: number) => void;
  onMoveUp: (index: number) => void;
  onMoveDown: (index: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: () => void;
  onDragEnd: () => void;
}

export function EventRow({
  event,
  index,
  total,
  isDragging,
  isDragOver,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: EventRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: isDragging ? 0.4 : 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -24, scale: 0.96, transition: { duration: 0.18 } }}
      transition={{ type: "spring", bounce: 0.15, duration: 0.4 }}
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => {
        e.preventDefault();
        onDragOver(index);
      }}
      onDrop={(e) => {
        e.preventDefault();
        onDrop();
      }}
      onDragEnd={onDragEnd}
      className={cn(
        "group rounded-xl border bg-surface-2/60 transition-colors",
        isDragOver ? "border-accent-purple/60 bg-accent-purple/5" : "border-border"
      )}
    >
      <div className="flex items-center gap-2 p-2.5">
        <button
          type="button"
          className="cursor-grab touch-none rounded-md p-1.5 text-muted-foreground hover:bg-surface-3 active:cursor-grabbing"
          aria-label="Drag to reorder"
        >
          <GripVertical className="h-4 w-4" />
        </button>

        <span className="w-6 shrink-0 text-center font-mono text-[11px] text-muted-foreground">
          {index + 1}
        </span>

        <Select value={event.event} onValueChange={(v) => onUpdate(index, { ...event, event: v })}>
          <SelectTrigger className="h-9 w-[220px] shrink-0 text-xs">
            <SelectValue placeholder="Event type" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_TYPES.map((type) => (
              <SelectItem key={type} value={type} className="text-xs">
                {EVENT_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <button
          type="button"
          onClick={() => setExpanded((e) => !e)}
          className="flex-1 truncate text-left text-xs text-muted-foreground hover:text-foreground"
        >
          {event.product && <span className="text-foreground">{event.product}</span>}
          {event.category && <span> · {event.category}</span>}
          {typeof event.price === "number" && <span> · ${event.price}</span>}
          {!event.product && !event.category && event.price === undefined && (
            <span className="italic opacity-60">Click to add details</span>
          )}
        </button>

        <div className="flex shrink-0 items-center gap-1 opacity-60 transition-opacity group-hover:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={index === 0}
            onClick={() => onMoveUp(index)}
            aria-label="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={index === total - 1}
            onClick={() => onMoveDown(index)}
            aria-label="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 text-destructive hover:bg-destructive/10 hover:text-destructive"
            onClick={() => onRemove(index)}
            aria-label="Delete event"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      {expanded && (
        <div className="grid grid-cols-3 gap-2 border-t border-border/60 p-2.5 pt-2.5">
          <Input
            placeholder="Product"
            value={event.product ?? ""}
            onChange={(e) => onUpdate(index, { ...event, product: e.target.value || undefined })}
            className="h-8 text-xs"
          />
          <Input
            placeholder="Category"
            value={event.category ?? ""}
            onChange={(e) => onUpdate(index, { ...event, category: e.target.value || undefined })}
            className="h-8 text-xs"
          />
          <Input
            placeholder="Price"
            type="number"
            value={event.price ?? ""}
            onChange={(e) =>
              onUpdate(index, {
                ...event,
                price: e.target.value === "" ? undefined : Number(e.target.value),
              })
            }
            className="h-8 text-xs"
          />
        </div>
      )}
    </motion.div>
  );
}
