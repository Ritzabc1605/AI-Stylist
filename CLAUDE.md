# AI Stylist — Project Overview

Indian ethnic fashion app (LA BELD / AI Miranda) — users browse boutiques, shop by category, and get AI-powered outfit suggestions via a search-driven stylist flow. No chat UI; search is an overlay on every page.

---

## Structure

```
AI Stylist/
├── backend/
│   ├── main.py                         # FastAPI app, CORS (allows localhost:3000)
│   ├── database/
│   │   ├── connection.py               # SQLAlchemy engine + get_db() dependency
│   │   ├── models.py                   # ORM models
│   │   └── ai_stylist.db               # SQLite (~2000 seeded products)
│   ├── services/
│   │   ├── agents.py                   # 4 async Claude agents + _call_claude() helper
│   │   ├── catalog_search.py           # filter_by_context(), get_products_by_ids()
│   │   └── style_rules.py              # STYLE_RULES dict (color, silhouette, occasion, climate)
│   └── routers/
│       └── stylist.py                  # POST /api/suggest, POST /api/suggest/stream
└── frontend/
    ├── lib/
    │   ├── types.ts                    # Shared TS interfaces
    │   └── api.ts                      # fetch wrappers + SSE stream reader + localStorage helpers
    ├── store/
    │   └── stylistStore.ts             # Zustand store — all UI state + submitSearch() orchestration
    └── app/
        ├── page.tsx                    # Home (client component)
        ├── categories/page.tsx         # Categories (client component)
        ├── boutiques/page.tsx          # Boutiques (client component)
        └── components/
            ├── SearchModal.tsx         # Full-screen overlay: chips, AI Miranda cards, input
            ├── OutfitResultsDrawer.tsx # Bottom drawer: progress → clarifying → results
            ├── BottomNav.tsx           # Fixed bottom nav
            └── ChatButton.tsx          # Legacy floating pill (UI only, not wired)
```

---

## Backend

- **Stack:** FastAPI + SQLAlchemy ORM, SQLite
- **AI model:** `claude-sonnet-4-20250514` via Anthropic SDK `0.84.0`
- **Run:** `cd backend && source venv/bin/activate && ANTHROPIC_API_KEY=sk-... uvicorn main:app --reload`

### Agent pipeline (`services/agents.py`)

Four async agents called sequentially per request. All share `_call_claude()` which strips markdown fences and retries up to 2× on JSON parse failure.

| # | Function | Input → Output |
|---|---|---|
| 1 | `parse_intent(message, history)` | Raw message → `{destination, duration_days, total_budget, per_outfit_budget, occasions, status, clarifying_question}` |
| 2 | `enrich_context(parsed_intent)` | Intent dict → `{climate, cultural_notes, recommended_occasions, outfits_per_occasion, total_outfits_needed}` |
| 3 | `generate_combinations(products, style_rules, budget, num_outfits)` | Catalog slice + rules → `[{outfit_type, item_ids, total_price, occasion, reasoning}]` |
| 4 | `narrate_outfits(outfits_with_products, destination, occasions)` | Combo list → `[{name, description, occasion_tags, styling_tip}]` |

**Design decisions:**
- Agent 3 receives max 80 products (token limit) and a compact `style_rules` subset (color + pairings only)
- Each outfit = 1 dress **OR** (1 top + 1 bottom) + optional outerwear — never both structures
- `style_rules.py` is a static Python dict (no DB), exported as `STYLE_RULES`

### Catalog filtering (`services/catalog_search.py`)

SQLite has limited JSON query support, so filtering is done in Python after a price-filtered SQL query:
- Climate match: `climate in product.climate` (OR)
- Occasion match: `any(o in product.occasions for o in occasions)` (OR)
- OR logic intentionally used — avoids over-restricting the catalog

### API endpoints

- `POST /api/suggest` — full synchronous JSON response
- `POST /api/suggest/stream` — SSE stream, each event: `{"status": "progress"|"done"|"clarifying"|"error"|"no_products"|"no_outfits", ...}`

**Clarifying short-circuit:** Agent 1 returns `status="clarifying"` when destination or budget is missing. The endpoint returns immediately — Agents 2–4 are never called.

### Key models (`database/models.py`)

| Model | Key fields |
|---|---|
| `Product` | `category, price, colors (JSON), occasions (JSON), climate (JSON), image_url` |
| `OutfitCombination` | `outfit_type ("dress"\|"separates"), session_id (FK)` |
| `ChatSession` | `destination, duration_days, total_budget` |

---

## Frontend

- **Stack:** Next.js App Router, React 19, TypeScript, Tailwind CSS v4
- **State:** Zustand `stylistStore` — single store owns all modal/drawer/search state
- **Run:** `cd frontend && npm run dev` → http://localhost:3000

### Design tokens

| Token | Value |
|---|---|
| Brand (wine red) | `#8B1538` |
| AI Miranda accent | `#C2185B` (deep rose) — all interactive elements in stylist flow |
| Background | `#FAF7F4` |
| Font | Geist Sans |

### Stylist flow (end-to-end)

```
Tap search bar/icon
  → SearchModal opens (framer-motion slide-up)
  → User types or picks chip/card → taps "Find Outfits"
  → submitSearch() in store:
      1. closeSearch() + openDrawer()
      2. Resets outfits/error/clarifyingQuestion/progressSteps
      3. Calls streamStylistProgress() (POST /api/suggest/stream via fetch ReadableStream)
      4. SSE "progress" events → advance progressSteps in drawer
      5a. SSE "clarifying" → set clarifyingQuestion → drawer shows "Refine Search" prompt
      5b. SSE "done" → set outfits + totalBudget → drawer shows budget bar + outfit grid
      5c. SSE "error"/"no_products" → set error → drawer shows retry UI
```

**Why SSE over polling:** Gives live step-by-step feedback during the ~5–10s multi-agent call. The frontend uses `fetch` + `ReadableStream` (not `EventSource`) because the endpoint is `POST`.

**Why overlays, not pages:** All three pages (Home, Boutiques, Categories) are client components — SearchModal and OutfitResultsDrawer render as portals on top of existing page content. No navigation away from current page.

### Zustand store state (`store/stylistStore.ts`)

```
isSearchModalOpen, isResultsDrawerOpen
currentQuery, outfits, savedOutfits
progressSteps, isLoading, error, clarifyingQuestion, totalBudget
```

Key actions: `openSearch`, `closeSearch`, `openDrawer`, `closeDrawer`, `saveOutfit`, `submitSearch`

### Image URLs

Backend serves images at `http://localhost:8000/static/images/{category}/...`
Relative `image_url` values must be prefixed with `http://localhost:8000/` in the frontend.

---

## Dev commands

```bash
# Backend (venv already set up)
cd backend && source venv/bin/activate
ANTHROPIC_API_KEY=sk-... uvicorn main:app --reload    # → http://localhost:8000/health

# Frontend
cd frontend && npm run dev                             # → http://localhost:3000
```

---

## Next steps

- Wire `ChatButton` (legacy) to the same `/api/suggest` pipeline or remove it
- Auth: JWT via `python-jose` + `passlib`
- Orders and account pages
- Migrate SQLite → PostgreSQL (`DATABASE_URL` env var already plumbed in `connection.py`)
