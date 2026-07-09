"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { EVENT_LABELS, type SessionEvent } from "@/types/events";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const EVENT_TYPES = Object.keys(EVENT_LABELS);

interface AddEventDialogProps {
  onAdd: (event: SessionEvent) => void;
}

export function AddEventDialog({ onAdd }: AddEventDialogProps) {
  const [open, setOpen] = useState(false);
  const [eventType, setEventType] = useState<string>("view_product");
  const [product, setProduct] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");

  function reset() {
    setEventType("view_product");
    setProduct("");
    setCategory("");
    setPrice("");
  }

  function handleAdd() {
    onAdd({
      event: eventType,
      product: product.trim() || undefined,
      category: category.trim() || undefined,
      price: price.trim() === "" ? undefined : Number(price),
      timestamp: new Date().toISOString(),
    });
    reset();
    setOpen(false);
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full border-dashed">
          <Plus className="h-4 w-4" />
          Add event
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add an event</DialogTitle>
          <DialogDescription>
            Append a new touchpoint to the end of the session. You can reorder it afterwards.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-1.5">
            <Label>Event type</Label>
            <Select value={eventType} onValueChange={setEventType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EVENT_TYPES.map((type) => (
                  <SelectItem key={type} value={type}>
                    {EVENT_LABELS[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label>Product (optional)</Label>
              <Input value={product} onChange={(e) => setProduct(e.target.value)} placeholder="e.g. Nike Air Max 270" />
            </div>
            <div className="space-y-1.5">
              <Label>Category (optional)</Label>
              <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="e.g. Sneakers" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Price (optional)</Label>
            <Input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="e.g. 150"
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <DialogClose asChild>
            <Button variant="ghost">Cancel</Button>
          </DialogClose>
          <Button variant="gradient" onClick={handleAdd}>
            <Plus className="h-4 w-4" />
            Add event
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
