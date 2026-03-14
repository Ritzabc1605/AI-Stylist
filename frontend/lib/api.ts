import type { OutfitCombination } from "./types";

const BASE_URL = "http://localhost:8000";

export async function suggestOutfits(message: string, history: unknown[] = []) {
  const res = await fetch(`${BASE_URL}/api/suggest`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message, history }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  return res.json();
}

export async function streamStylistProgress(
  message: string,
  onUpdate: (step: string) => void,
  onDone: (data: unknown) => void,
  onError: (err: string) => void,
  onClarify?: (question: string) => void
) {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}/api/suggest/stream`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, history: [] }),
    });
  } catch (e) {
    onError("Could not connect to the AI Stylist server. Make sure the backend is running.");
    return;
  }

  if (!res.ok || !res.body) {
    onError(`Server error (HTTP ${res.status}). Please try again.`);
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      try {
        const data = JSON.parse(line.slice(6));
        if (data.status === "progress") {
          onUpdate(data.message ?? "");
        } else if (data.status === "done") {
          onDone(data);
        } else if (data.status === "error") {
          onError(data.message ?? "An error occurred.");
        } else if (data.status === "clarifying") {
          if (onClarify) onClarify(data.question ?? "Can you give more details?");
          else onError(data.question ?? "Can you give more details?");
        } else if (data.status === "no_products") {
          onError(data.message ?? "No products found for this budget.");
        } else if (data.status === "no_outfits") {
          onError(data.message ?? "Could not generate outfit combinations.");
        }
      } catch {
        // skip malformed SSE lines
      }
    }
  }
}

const SAVED_KEY = "labeld_saved_outfits";

export function saveOutfit(outfit: OutfitCombination): void {
  if (typeof window === "undefined") return;
  const saved = getSavedOutfits();
  // avoid exact duplicates by name+price
  const isDupe = saved.some(
    (s) => s.name === outfit.name && s.total_price === outfit.total_price
  );
  if (!isDupe) {
    localStorage.setItem(SAVED_KEY, JSON.stringify([...saved, outfit]));
  }
}

export function getSavedOutfits(): OutfitCombination[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(SAVED_KEY) ?? "[]");
  } catch {
    return [];
  }
}
