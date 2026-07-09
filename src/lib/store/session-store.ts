import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SessionEvent } from "@/types/events";
import type { SavedAnalysis, SessionAnalysis } from "@/types/shopper";
import { MOCK_SESSIONS } from "@/lib/data/mock-sessions";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface SessionStore {
  events: SessionEvent[];
  sessionId: string;
  sessionLabel: string;
  analysis: SessionAnalysis | null;
  isAnalyzing: boolean;
  error: string | null;
  history: SavedAnalysis[];
  chatMessages: ChatMessage[];

  setEvents: (events: SessionEvent[], label?: string) => void;
  loadMockSession: (id: string) => void;
  loadRandomSession: () => void;
  addEvent: (event: SessionEvent) => void;
  removeEvent: (index: number) => void;
  reorderEvents: (from: number, to: number) => void;
  updateEvent: (index: number, event: SessionEvent) => void;

  setAnalyzing: (v: boolean) => void;
  setAnalysis: (analysis: SessionAnalysis) => void;
  setError: (error: string | null) => void;

  addChatMessage: (msg: ChatMessage) => void;
  clearChat: () => void;

  toggleFavorite: (id: string) => void;
  deleteFromHistory: (id: string) => void;
  renameHistoryEntry: (id: string, label: string) => void;
  reopenAnalysis: (id: string) => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set, get) => ({
      events: MOCK_SESSIONS[0]!.events,
      sessionId: MOCK_SESSIONS[0]!.id,
      sessionLabel: MOCK_SESSIONS[0]!.label,
      analysis: null,
      isAnalyzing: false,
      error: null,
      history: [],
      chatMessages: [],

      setEvents: (events, label) =>
        set({ events, sessionLabel: label ?? "Custom session", sessionId: crypto.randomUUID(), analysis: null, error: null }),

      loadMockSession: (id) => {
        const session = MOCK_SESSIONS.find((s) => s.id === id);
        if (!session) return;
        set({ events: session.events, sessionId: session.id, sessionLabel: session.label, analysis: null, error: null });
      },

      loadRandomSession: () => {
        const session = MOCK_SESSIONS[Math.floor(Math.random() * MOCK_SESSIONS.length)]!;
        set({ events: session.events, sessionId: session.id, sessionLabel: session.label, analysis: null, error: null });
      },

      addEvent: (event) => set({ events: [...get().events, event] }),
      removeEvent: (index) => set({ events: get().events.filter((_, i) => i !== index) }),
      reorderEvents: (from, to) => {
        const events = [...get().events];
        const [moved] = events.splice(from, 1);
        if (!moved) return;
        events.splice(to, 0, moved);
        set({ events });
      },
      updateEvent: (index, event) => {
        const events = [...get().events];
        events[index] = event;
        set({ events });
      },

      setAnalyzing: (v) => set({ isAnalyzing: v }),
      setAnalysis: (analysis) =>
        set((state) => ({
          analysis,
          history: [
            { analysis, favorite: false, savedAt: new Date().toISOString() },
            ...state.history,
          ].slice(0, 20),
        })),
      setError: (error) => set({ error }),

      addChatMessage: (msg) => set({ chatMessages: [...get().chatMessages, msg] }),
      clearChat: () => set({ chatMessages: [] }),

      toggleFavorite: (id) =>
        set((state) => ({
          history: state.history.map((h) => (h.analysis.id === id ? { ...h, favorite: !h.favorite } : h)),
        })),
      deleteFromHistory: (id) =>
        set((state) => ({ history: state.history.filter((h) => h.analysis.id !== id) })),
      renameHistoryEntry: (id, label) =>
        set((state) => ({
          history: state.history.map((h) => (h.analysis.id === id ? { ...h, savedLabel: label } : h)),
        })),
      reopenAnalysis: (id) => {
        const entry = get().history.find((h) => h.analysis.id === id);
        if (!entry) return;
        set({
          events: entry.analysis.sourceEvents,
          sessionId: entry.analysis.sessionId,
          sessionLabel: entry.savedLabel ?? `Reopened · ${entry.analysis.shopperState}`,
          analysis: entry.analysis,
          error: null,
        });
      },
    }),
    {
      name: "cartguru-history",
      partialize: (state) => ({ history: state.history }),
    }
  )
);
