"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Sparkles, Wand2, Shuffle, Copy, Trash2, FileJson, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useSessionStore } from "@/lib/store/session-store";
import { MOCK_SESSIONS, SAMPLE_EVENT_JSON, randomMockSession } from "@/lib/data/mock-sessions";
import type { SessionEvent } from "@/types/events";

function eventsToJson(events: SessionEvent[]) {
  return JSON.stringify(events, null, 2);
}

interface SessionInputPanelProps {
  onAnalyze: (events: SessionEvent[]) => void;
  isAnalyzing: boolean;
}

export function SessionInputPanel({ onAnalyze, isAnalyzing }: SessionInputPanelProps) {
  const events = useSessionStore((s) => s.events);
  const sessionLabel = useSessionStore((s) => s.sessionLabel);
  const setEvents = useSessionStore((s) => s.setEvents);

  const [draft, setDraft] = useState(() => eventsToJson(events));
  const [parseError, setParseError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dragCounterRef = useRef(0);

  // Keep textarea in sync with the store when events change from outside (mock load etc.)
  useEffect(() => {
    setDraft(eventsToJson(events));
    setParseError(null);
  }, [events]);

  const validate = (text: string): SessionEvent[] | null => {
    try {
      const parsed = JSON.parse(text);
      if (!Array.isArray(parsed)) {
        setParseError("JSON must be an array of event objects.");
        return null;
      }
      if (parsed.length === 0) {
        setParseError("At least one event is required.");
        return null;
      }
      for (const item of parsed) {
        if (typeof item !== "object" || item === null || typeof item.event !== "string") {
          setParseError('Each event needs at least an "event" string field.');
          return null;
        }
      }
      setParseError(null);
      return parsed as SessionEvent[];
    } catch (err) {
      setParseError(err instanceof Error ? err.message : "Invalid JSON");
      return null;
    }
  };

  const handleAnalyzeClick = () => {
    const parsed = validate(draft);
    if (!parsed) {
      toast.error("Fix the JSON before analyzing");
      return;
    }
    setEvents(parsed, "Custom session");
    onAnalyze(parsed);
  };

  const handleTrySample = () => {
    const sample = MOCK_SESSIONS[0]!;
    setEvents(sample.events, sample.label);
    setDraft(eventsToJson(sample.events));
    toast.success(`Loaded sample: ${sample.label}`);
  };

  const handleRandomSession = () => {
    const session = randomMockSession()!;
    setEvents(session.events, session.label);
    setDraft(eventsToJson(session.events));
    toast.success(`Loaded: ${session.label}`);
  };

  const handleLoadMock = (id: string) => {
    const session = MOCK_SESSIONS.find((s) => s.id === id);
    if (!session) return;
    setEvents(session.events, session.label);
    setDraft(eventsToJson(session.events));
    toast.success(`Loaded: ${session.label}`);
  };

  const loadFile = (file: File) => {
    if (!/\.json$/i.test(file.name) && file.type !== "application/json") {
      setParseError("Only .json files are supported.");
      toast.error("Only .json files are supported");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const text = typeof reader.result === "string" ? reader.result : "";
      const parsed = validate(text);
      if (!parsed) {
        toast.error("Uploaded file contains invalid session JSON");
        return;
      }
      setDraft(text);
      const label = file.name.replace(/\.json$/i, "");
      setEvents(parsed, label || "Uploaded session");
      toast.success(`Loaded file: ${file.name}`);
    };
    reader.onerror = () => {
      setParseError("Could not read the selected file.");
      toast.error("Could not read the selected file");
    };
    reader.readAsText(file);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    e.target.value = "";
  };

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!e.dataTransfer.types.includes("Files")) return;
    dragCounterRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current = Math.max(0, dragCounterRef.current - 1);
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragCounterRef.current = 0;
    setIsDragging(false);
    if (isAnalyzing) return;
    const file = e.dataTransfer.files?.[0];
    if (file) loadFile(file);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(draft);
    toast.success("Event JSON copied to clipboard");
  };

  const handleClear = () => {
    setDraft("[]");
    setParseError(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleAnalyzeClick();
    }
  };

  const previewSessions = MOCK_SESSIONS.slice(0, 6);

  return (
    <div className="no-print flex flex-col gap-5">
      <div
        className="relative"
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={handleFileInputChange}
        />
        {isDragging && (
          <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-accent-purple bg-accent-purple/10 backdrop-blur-sm">
            <Upload className="h-6 w-6 text-accent-purple" />
            <span className="text-sm font-medium text-accent-purple">Drop JSON file here</span>
          </div>
        )}
        <Card className={cn("border-border transition-colors", isDragging && "border-accent-purple/60")}>
          <CardHeader className="gap-2">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileJson className="h-4 w-4 text-accent-blue" />
              Session event stream
            </CardTitle>
            <Badge variant="outline" className="font-mono text-[10px]">
              {sessionLabel}
            </Badge>
          </div>
          <CardDescription>
            Paste a raw JSON array of shopper events, or load one of the sample sessions below.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 pt-0">
          <Textarea
            ref={textareaRef}
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              validate(e.target.value);
            }}
            onKeyDown={handleKeyDown}
            spellCheck={false}
            className={cn(
              "h-[320px] resize-y text-xs leading-relaxed",
              parseError && "border-confidence-low/50 focus-visible:ring-confidence-low"
            )}
            placeholder={SAMPLE_EVENT_JSON}
          />
          {parseError && (
            <p className="rounded-md border border-confidence-low/30 bg-confidence-low/10 px-3 py-2 text-xs text-confidence-low">
              {parseError}
            </p>
          )}

          <div className="flex flex-wrap gap-2">
            <Button variant="gradient" onClick={handleAnalyzeClick} disabled={isAnalyzing || !!parseError} className="flex-1 min-w-[140px]">
              <Sparkles />
              {isAnalyzing ? "Analyzing…" : "Analyze"}
            </Button>
            <Button variant="outline" onClick={handleTrySample} disabled={isAnalyzing}>
              <Wand2 />
              Try sample
            </Button>
            <Button variant="outline" onClick={handleRandomSession} disabled={isAnalyzing}>
              <Shuffle />
              Random session
            </Button>
            <Button variant="outline" onClick={handleUploadClick} disabled={isAnalyzing}>
              <Upload />
              Upload file
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              <Copy /> Copy JSON
            </Button>
            <Button variant="ghost" size="sm" onClick={handleClear}>
              <Trash2 /> Clear
            </Button>
            <span className="ml-auto self-center text-[11px] text-muted-foreground">
              &#8984;/Ctrl + Enter to analyze
            </span>
          </div>
        </CardContent>
        </Card>
      </div>
      {/* end drag-and-drop wrapper */}

      <div>
        <div className="mb-2 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Example sessions
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {previewSessions.map((session) => (
            <button
              key={session.id}
              type="button"
              onClick={() => handleLoadMock(session.id)}
              disabled={isAnalyzing}
              className="group flex flex-col gap-1.5 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-left transition-colors hover:border-accent-purple/40 hover:bg-surface-3 disabled:pointer-events-none disabled:opacity-50"
            >
              <span className="text-xs font-medium leading-snug text-foreground line-clamp-1">{session.label}</span>
              <Badge variant="secondary" className="w-fit text-[10px]">
                {session.persona}
              </Badge>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
