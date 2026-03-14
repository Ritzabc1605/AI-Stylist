# AI Stylist — Project Overview

An Indian ethnic fashion app (LA BELD) where users browse boutiques, shop by category, and get AI-powered outfit suggestions via a chat interface.

---

## Structure

```
AI Stylist/
├── backend/
│   └── database/
│       ├── connection.py   # SQLAlchemy engine + get_db() dependency
│       ├── init_db.py      # DB initialisation script
│       └── models.py       # All ORM models (see below)
└── frontend/
    └── app/
        ├── page.tsx                    # Home page
        ├── categories/page.tsx         # Categories page
        ├── boutiques/page.tsx          # Boutiques page
        ├── components/
        │   ├── BottomNav.tsx           # Fixed bottom navigation bar
        │   └── ChatButton.tsx          # Floating AI Stylist chat button + bottom-sheet modal
        ├── globals.css                 # Tailwind base + .no-scrollbar, .safe-area-pb
        └── layout.tsx                  # Root layout (Geist font, metadata)
```

---

## Backend

- **Framework:** FastAPI (not yet wired up — only DB layer exists)
- **Database:** SQLite (`backend/database/ai_stylist.db`), SQLAlchemy ORM
  - Planned migration path to PostgreSQL via `DATABASE_URL` env var
- **Key packages:** `anthropic`, `openai`, `faiss-cpu`, `sentence-transformers`, `torch`, `celery`, `redis`, `boto3`, `replicate`

### Data models (`models.py`)

| Model | Purpose |
|---|---|
| `User` | Buyers and sellers; `role` = `"buyer" \| "seller" \| "admin"` |
| `Product` | Catalog items with `colors`, `occasions`, `climate` JSON fields |
| `OutfitCombination` | A curated set of products; linked to a `ChatSession` |
| `OutfitItem` | Join table between `OutfitCombination` and `Product` |
| `ChatSession` | Conversation context: destination, duration, budget |
| `ChatMessage` | Individual messages (`role` = `"user" \| "assistant"`) |
| `Order` | Purchase record linked to a user and optionally an `OutfitCombination` |

---

## Frontend

- **Framework:** Next.js 16 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS v4
- **Key packages:** `@anthropic-ai/sdk`, `framer-motion`, `zustand`, `@tanstack/react-query`, `lucide-react`, `zod`, `react-hook-form`, `axios`

### Design system

| Token | Value |
|---|---|
| Primary (wine red) | `#8B1538` |
| Background | `#FAF7F4` (warm off-white) |
| Offer zone bg | `#FFF0E8` (light peach) |
| Font | Geist Sans |

### Pages

- **Home (`/`)** — Header with search + gender tabs, category chips, hero banner, Recently Added, Offer Zone, Best From Your Boutiques, Bestselling Products, Shop by Category
- **Categories (`/categories`)** — Women / Men tabs, scrollable category list with thumbnails and item counts
- **Boutiques (`/boutiques`)** — Hero, Featured Boutiques full-width cards, Curated grid, Boutiques You Follow with product carousels

### AI Chat UI (`ChatButton.tsx`)

A floating pill button ("✦ AI Stylist") fixed above the bottom nav on all three pages. Clicking it opens a bottom sheet with:
- Six suggestion chips (e.g. *"5-day Goa vacation outfits"*, *"Bridal lehengas under ₹5k"*)
- Multi-line textarea (supports simple queries like `"pink"` and complex prompts)
- Send button — **currently UI-only; backend wiring is the next step**

---

## Dev commands

```bash
# Frontend
cd frontend && npm run dev      # starts on http://localhost:3000

# Backend (once FastAPI routes exist)
cd backend && uvicorn main:app --reload
```

---

## Next steps

- Build FastAPI routes for products, boutiques, chat
- Wire `ChatButton` send action to a `/api/chat` endpoint
- Implement AI stylist logic: parse prompt → query products → build `OutfitCombination`
- Add auth (JWT via `python-jose` + `passlib`)
- Orders and account pages
