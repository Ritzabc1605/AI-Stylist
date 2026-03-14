export interface OutfitItem {
  id: number;
  sku: string;
  name: string;
  category: string;
  price: number;
  colors: string[];
  occasions: string[];
  climate: string[];
  image_url: string | null;
}

export interface OutfitCombination {
  name: string;
  outfit_name?: string;
  items: OutfitItem[];
  total_price: number;
  description: string;
  stylist_description?: string;
  styling_tip: string;
  occasion_tags: string[];
  outfit_type: string;
  occasion?: string;
  reasoning?: string;
}

export type ProgressStatus = "pending" | "active" | "done";

export interface ProgressStep {
  label: string;
  status: ProgressStatus;
}

export interface BudgetSegment {
  label: string;
  amount: number;
  color: string;
}

export interface StylistRequest {
  message: string;
  conversation_history: Array<{ role: string; content: string }>;
}

export interface StylistResponse {
  status: string;
  outfits: OutfitCombination[];
  summary?: string;
  total_spent?: number;
  total_budget?: number;
  session_id?: string;
  parsed_intent?: {
    destination: string;
    duration_days: number;
    total_budget: number;
    per_outfit_budget: number;
    occasions: string[];
  };
  enriched_context?: {
    climate: string;
    recommended_occasions: string[];
  };
}
