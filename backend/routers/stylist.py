"""
Stylist router: orchestrates the 4-agent pipeline.

POST /api/suggest        — full response
POST /api/suggest/stream — Server-Sent Events with progress updates
"""

import json
import uuid
from typing import AsyncGenerator

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database.connection import get_db
from services.agents import (
    enrich_context,
    generate_combinations,
    narrate_outfits,
    parse_intent,
)
from services.catalog_search import filter_by_context, get_products_by_ids
from services.style_rules import STYLE_RULES

router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response schemas
# ---------------------------------------------------------------------------

class ChatMessage(BaseModel):
    role: str   # "user" | "assistant"
    content: str


class SuggestRequest(BaseModel):
    message: str
    history: list[ChatMessage] = []
    session_id: str | None = None


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _resolve_budgets(parsed: dict) -> tuple[float, float]:
    """
    Returns (total_budget, per_outfit_budget).
    Falls back sensibly when only one is provided.
    """
    total = parsed.get("total_budget") or 0.0
    per_outfit = parsed.get("per_outfit_budget") or 0.0

    if total and not per_outfit:
        num_outfits = max(parsed.get("duration_days") or 3, 1)
        per_outfit = total / num_outfits
    elif per_outfit and not total:
        num_outfits = max(parsed.get("duration_days") or 3, 1)
        total = per_outfit * num_outfits

    return total, per_outfit


def _merge_narration(combos: list[dict], narration: list[dict], products_by_id: dict) -> list[dict]:
    """Merge outfit combination data with narration and resolved product details."""
    outfits = []
    for i, combo in enumerate(combos):
        narr = narration[i] if i < len(narration) else {}
        items = [products_by_id[pid] for pid in combo.get("item_ids", []) if pid in products_by_id]
        outfits.append(
            {
                "name": narr.get("name", f"Outfit {i + 1}"),
                "description": narr.get("description", ""),
                "occasion_tags": narr.get("occasion_tags", [combo.get("occasion", "")]),
                "styling_tip": narr.get("styling_tip", ""),
                "outfit_type": combo.get("outfit_type", "separates"),
                "occasion": combo.get("occasion", ""),
                "reasoning": combo.get("reasoning", ""),
                "total_price": combo.get("total_price", 0.0),
                "items": items,
            }
        )
    return outfits


# ---------------------------------------------------------------------------
# POST /api/suggest
# ---------------------------------------------------------------------------

@router.post("/suggest")
async def suggest(req: SuggestRequest, db: Session = Depends(get_db)):
    session_id = req.session_id or str(uuid.uuid4())
    history = [m.model_dump() for m in req.history]

    # Agent 1 — parse intent
    try:
        parsed = await parse_intent(req.message, history)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Intent parsing failed: {e}")

    if parsed.get("status") == "clarifying":
        return {
            "session_id": session_id,
            "status": "clarifying",
            "question": parsed.get("clarifying_question"),
        }

    # Agent 2 — enrich context
    try:
        enriched = await enrich_context(parsed)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context enrichment failed: {e}")

    climate = enriched.get("climate", "warm")
    occasions = enriched.get("recommended_occasions", parsed.get("occasions") or ["casual"])
    total_outfits = enriched.get("total_outfits_needed", parsed.get("duration_days") or 3)

    total_budget, per_outfit_budget = _resolve_budgets(parsed)
    if per_outfit_budget <= 0:
        per_outfit_budget = 3000.0  # sensible default

    # Catalog filter
    products = await filter_by_context(climate, occasions, per_outfit_budget, db)
    if not products:
        return {
            "session_id": session_id,
            "status": "no_products",
            "message": "No products found in this price range. Try increasing your budget.",
        }

    # Agent 3 — generate combinations
    try:
        combos = await generate_combinations(products, STYLE_RULES, per_outfit_budget, total_outfits)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Outfit generation failed: {e}")

    if not combos:
        return {
            "session_id": session_id,
            "status": "no_outfits",
            "message": "Could not generate outfit combinations for this context.",
        }

    # Resolve product details for narration
    all_ids = [pid for combo in combos for pid in combo.get("item_ids", [])]
    products_by_id = get_products_by_ids(all_ids, db)

    outfits_with_products = [
        {**combo, "items": [products_by_id[pid] for pid in combo.get("item_ids", []) if pid in products_by_id]}
        for combo in combos
    ]

    # Agent 4 — narrate
    try:
        narration = await narrate_outfits(
            outfits_with_products,
            parsed.get("destination", "your destination"),
            occasions,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Narration failed: {e}")

    outfits = _merge_narration(combos, narration, products_by_id)

    return {
        "session_id": session_id,
        "status": "success",
        "parsed_intent": parsed,
        "enriched_context": enriched,
        "outfits": outfits,
    }


# ---------------------------------------------------------------------------
# POST /api/suggest/stream  (Server-Sent Events)
# ---------------------------------------------------------------------------

@router.post("/suggest/stream")
async def suggest_stream(req: SuggestRequest, db: Session = Depends(get_db)):
    session_id = req.session_id or str(uuid.uuid4())
    history = [m.model_dump() for m in req.history]

    async def event_generator() -> AsyncGenerator[str, None]:
        def _sse(payload: dict) -> str:
            return f"data: {json.dumps(payload)}\n\n"

        try:
            yield _sse({"status": "progress", "message": "Analyzing your destination..."})

            parsed = await parse_intent(req.message, history)

            if parsed.get("status") == "clarifying":
                yield _sse(
                    {
                        "status": "clarifying",
                        "question": parsed.get("clarifying_question"),
                        "session_id": session_id,
                    }
                )
                return

            yield _sse({"status": "progress", "message": "Understanding climate and culture..."})
            enriched = await enrich_context(parsed)

            climate = enriched.get("climate", "warm")
            occasions = enriched.get("recommended_occasions", parsed.get("occasions") or ["casual"])
            total_outfits = enriched.get("total_outfits_needed", parsed.get("duration_days") or 3)
            _, per_outfit_budget = _resolve_budgets(parsed)
            if per_outfit_budget <= 0:
                per_outfit_budget = 3000.0

            yield _sse({"status": "progress", "message": "Browsing catalog for you..."})
            products = await filter_by_context(climate, occasions, per_outfit_budget, db)

            if not products:
                yield _sse(
                    {
                        "status": "no_products",
                        "message": "No products found in this price range.",
                        "session_id": session_id,
                    }
                )
                return

            yield _sse({"status": "progress", "message": "Putting together outfits..."})
            combos = await generate_combinations(products, STYLE_RULES, per_outfit_budget, total_outfits)

            if not combos:
                yield _sse(
                    {
                        "status": "no_outfits",
                        "message": "Could not generate outfit combinations.",
                        "session_id": session_id,
                    }
                )
                return

            all_ids = [pid for combo in combos for pid in combo.get("item_ids", [])]
            products_by_id = get_products_by_ids(all_ids, db)
            outfits_with_products = [
                {
                    **combo,
                    "items": [
                        products_by_id[pid]
                        for pid in combo.get("item_ids", [])
                        if pid in products_by_id
                    ],
                }
                for combo in combos
            ]

            yield _sse({"status": "progress", "message": "Writing your style guide..."})
            narration = await narrate_outfits(
                outfits_with_products,
                parsed.get("destination", "your destination"),
                occasions,
            )

            outfits = _merge_narration(combos, narration, products_by_id)

            yield _sse(
                {
                    "status": "done",
                    "session_id": session_id,
                    "parsed_intent": parsed,
                    "enriched_context": enriched,
                    "outfits": outfits,
                }
            )

        except Exception as e:
            yield _sse({"status": "error", "message": str(e)})

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
        },
    )
