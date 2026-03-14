"use client";

import { create } from "zustand";
import type { OutfitCombination, ProgressStep } from "../lib/types";
import {
  streamStylistProgress,
  saveOutfit as saveOutfitToStorage,
  getSavedOutfits,
} from "../lib/api";

const PROGRESS_LABELS = [
  "Understanding your trip...",
  "Mapping destination & climate...",
  "Scanning catalog...",
  "Building outfit combinations...",
  "Adding stylist touches...",
];

// Keywords from backend SSE progress messages, matched in order
const PROGRESS_KEYWORDS = [
  "analyzing",
  "understanding",
  "browsing",
  "putting",
  "writing",
];

const initialSteps = (): ProgressStep[] =>
  PROGRESS_LABELS.map((label) => ({ label, status: "pending" }));

interface StylistStore {
  isSearchModalOpen: boolean;
  isResultsDrawerOpen: boolean;
  currentQuery: string;
  outfits: OutfitCombination[];
  savedOutfits: OutfitCombination[];
  progressSteps: ProgressStep[];
  isLoading: boolean;
  error: string | null;
  clarifyingQuestion: string | null;
  totalBudget: number | null;

  openSearch: () => void;
  closeSearch: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  setQuery: (query: string) => void;
  setOutfits: (outfits: OutfitCombination[]) => void;
  saveOutfit: (outfit: OutfitCombination) => void;
  setProgress: (steps: ProgressStep[]) => void;
  setError: (error: string | null) => void;
  submitSearch: (message: string) => Promise<void>;
}

export const useStylistStore = create<StylistStore>((set, get) => ({
  isSearchModalOpen: false,
  isResultsDrawerOpen: false,
  currentQuery: "",
  outfits: [],
  savedOutfits: typeof window !== "undefined" ? getSavedOutfits() : [],
  progressSteps: initialSteps(),
  isLoading: false,
  error: null,
  clarifyingQuestion: null,
  totalBudget: null,

  openSearch: () => set({ isSearchModalOpen: true }),
  closeSearch: () => set({ isSearchModalOpen: false }),
  openDrawer: () => set({ isResultsDrawerOpen: true }),
  closeDrawer: () => set({ isResultsDrawerOpen: false }),
  setQuery: (query) => set({ currentQuery: query }),
  setOutfits: (outfits) => set({ outfits }),
  saveOutfit: (outfit) => {
    saveOutfitToStorage(outfit);
    set({ savedOutfits: getSavedOutfits() });
  },
  setProgress: (steps) => set({ progressSteps: steps }),
  setError: (error) => set({ error }),

  submitSearch: async (message: string) => {
    get().closeSearch();
    get().openDrawer();

    set({
      currentQuery: message,
      isLoading: true,
      error: null,
      clarifyingQuestion: null,
      outfits: [],
      progressSteps: initialSteps(),
      totalBudget: null,
    });

    let activeIndex = 0;

    const advanceTo = (idx: number) => {
      set((state) => ({
        progressSteps: state.progressSteps.map((step, i) => ({
          ...step,
          status: i < idx ? "done" : i === idx ? "active" : "pending",
        })),
      }));
    };

    advanceTo(0);

    await streamStylistProgress(
      message,
      (stepMsg) => {
        const lower = stepMsg.toLowerCase();
        const idx = PROGRESS_KEYWORDS.findIndex((kw) => lower.includes(kw));
        if (idx !== -1 && idx > activeIndex) {
          activeIndex = idx;
          advanceTo(idx);
        }
      },
      (data: unknown) => {
        const d = data as {
          outfits?: OutfitCombination[];
          parsed_intent?: { total_budget?: number };
        };
        set((state) => ({
          outfits: d.outfits ?? [],
          totalBudget: d.parsed_intent?.total_budget ?? null,
          isLoading: false,
          progressSteps: state.progressSteps.map((step) => ({
            ...step,
            status: "done",
          })),
        }));
      },
      (err: string) => {
        set({ error: err, isLoading: false });
      },
      (question: string) => {
        set({ clarifyingQuestion: question, isLoading: false });
      }
    );
  },
}));
