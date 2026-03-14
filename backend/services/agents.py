"""
Four Claude-powered agents for the AI Stylist pipeline.

Each agent is an async function that makes one focused Anthropic API call
and returns a parsed dict. A shared helper handles JSON extraction and
retry logic (up to 2 retries on parse failure).
"""

import json
import re

from anthropic import AsyncAnthropic

MODEL = "claude-sonnet-4-20250514"
MAX_TOKENS = 1024

# ---------------------------------------------------------------------------
# Shared helper
# ---------------------------------------------------------------------------

async def _call_claude(system: str, user_msg: str) -> dict | list:
    """
    Call Claude with a focused system prompt, return parsed JSON.
    Retries up to 2 times if the response is not valid JSON.
    """
    client = AsyncAnthropic()  # reads ANTHROPIC_API_KEY from env
    messages = [{"role": "user", "content": user_msg}]

    for attempt in range(3):
        response = await client.messages.create(
            model=MODEL,
            max_tokens=MAX_TOKENS,
            system=system,
            messages=messages,
        )
        text = response.content[0].text.strip()

        # Strip markdown code fences if Claude wrapped the JSON
        text = re.sub(r"^```(?:json)?\s*", "", text, flags=re.MULTILINE)
        text = re.sub(r"\s*```$", "", text, flags=re.MULTILINE)
        text = text.strip()

        try:
            return json.loads(text)
        except json.JSONDecodeError:
            if attempt == 2:
                raise ValueError(
                    f"Claude returned invalid JSON after 3 attempts. Raw: {text[:300]}"
                )
            # Append a stricter instruction and retry
            messages = [
                {"role": "user", "content": user_msg},
                {"role": "assistant", "content": text},
                {
                    "role": "user",
                    "content": "Your response was not valid JSON. Return ONLY a valid JSON object or array — no markdown, no explanation.",
                },
            ]


# ---------------------------------------------------------------------------
# Agent 1 — parse_intent
# ---------------------------------------------------------------------------

_PARSE_INTENT_SYSTEM = """\
You are a travel fashion assistant. Extract the user's intent from their message and conversation history.
Return ONLY a JSON object with these exact keys:
- destination (string or null)
- duration_days (integer or null)
- total_budget (float or null) — overall budget in INR
- per_outfit_budget (float or null) — budget per outfit in INR
- budget_type ("total" | "per_outfit" | null)
- occasions (array of strings, e.g. ["beach", "dinner", "sightseeing"])
- style_preferences (array of strings, e.g. ["boho", "minimalist", "ethnic"])
- status ("ready" | "clarifying")
- clarifying_question (string or null) — ask ONE question if critical info is missing

Set status="clarifying" when budget is missing or destination is unclear.
Do not include any text outside the JSON object.
"""


async def parse_intent(user_message: str, history: list[dict]) -> dict:
    """
    Agent 1: Extract travel + fashion intent from the user message.
    Returns a dict; status="clarifying" means a follow-up question is needed.
    """
    history_text = ""
    if history:
        history_text = "\n".join(
            f"{m['role'].upper()}: {m['content']}" for m in history[-6:]
        )
        history_text = f"Conversation history:\n{history_text}\n\n"

    user_msg = f"{history_text}User message: {user_message}"
    return await _call_claude(_PARSE_INTENT_SYSTEM, user_msg)


# ---------------------------------------------------------------------------
# Agent 2 — enrich_context
# ---------------------------------------------------------------------------

_ENRICH_CONTEXT_SYSTEM = """\
You are a travel and fashion culture expert. Given a parsed travel intent, enrich it with destination knowledge.
Return ONLY a JSON object with these exact keys:
- climate ("tropical" | "warm" | "mild" | "cool")
- cultural_notes (string — brief note on dress expectations, e.g. "Rajasthan temples require modest coverage")
- recommended_occasions (array of strings from: beach, dinner, sightseeing, cultural, party, casual, brunch)
- outfits_per_occasion (object mapping occasion → integer, e.g. {"beach": 2, "dinner": 1})
- total_outfits_needed (integer — sum of outfits_per_occasion values, capped at duration_days)

Use real-world knowledge about Indian and international destinations.
Do not include any text outside the JSON object.
"""


async def enrich_context(parsed_intent: dict) -> dict:
    """
    Agent 2: Map destination to climate, cultural context, and occasion breakdown.
    """
    user_msg = f"Parsed travel intent:\n{json.dumps(parsed_intent, indent=2)}"
    return await _call_claude(_ENRICH_CONTEXT_SYSTEM, user_msg)


# ---------------------------------------------------------------------------
# Agent 3 — generate_combinations
# ---------------------------------------------------------------------------

_GENERATE_COMBINATIONS_SYSTEM = """\
You are a professional fashion stylist. Create outfit combinations from the given product catalog.

Rules:
1. Each outfit = 1 dress OR (1 top + 1 bottom) with optional outerwear — never both a dress and a top+bottom
2. Follow the color_compatibility rules: items in one outfit must have compatible colors
3. Follow outfit_pairings silhouette rules where possible
4. Each outfit total price must not exceed per_outfit_budget
5. Aim for variety: different colors, different occasions, different outfit structures
6. Only use product IDs that exist in the provided catalog

Return ONLY a JSON array of outfit objects. Each object:
{
  "outfit_type": "dress" | "separates",
  "item_ids": [integer, ...],
  "total_price": float,
  "occasion": string,
  "reasoning": string (one sentence explaining color/silhouette choices)
}

Do not include any text outside the JSON array.
"""


async def generate_combinations(
    products: list[dict],
    style_rules: dict,
    per_outfit_budget: float,
    num_outfits: int,
) -> list[dict]:
    """
    Agent 3: Generate outfit combinations from filtered catalog using style rules.
    """
    # Send a concise subset of products to avoid token overload (max 80 items)
    catalog_sample = products[:80]

    # Only send relevant style rules to keep the prompt tight
    compact_rules = {
        "color_compatibility": style_rules["color_compatibility"],
        "outfit_pairings": [
            {"top_style": p["top_style"], "bottom_style": p["bottom_style"], "rule": p["rule"]}
            for p in style_rules["outfit_pairings"]
        ],
    }

    user_msg = (
        f"Product catalog ({len(catalog_sample)} items):\n"
        f"{json.dumps(catalog_sample, indent=2)}\n\n"
        f"Style rules:\n{json.dumps(compact_rules, indent=2)}\n\n"
        f"Per-outfit budget: ₹{per_outfit_budget}\n"
        f"Number of outfits to create: {num_outfits}\n\n"
        "Create exactly the requested number of outfit combinations."
    )
    result = await _call_claude(_GENERATE_COMBINATIONS_SYSTEM, user_msg)
    return result if isinstance(result, list) else []


# ---------------------------------------------------------------------------
# Agent 4 — narrate_outfits
# ---------------------------------------------------------------------------

_NARRATE_OUTFITS_SYSTEM = """\
You are a style copywriter for a premium Indian fashion app. Write engaging copy for outfit suggestions.

For each outfit in the input array, return a JSON object with:
- name (string — catchy 3-4 word name, e.g. "Sunset Dinner Look", "Breezy Beach Day")
- description (string — exactly 2 sentences: what the outfit is + why it works for the occasion)
- occasion_tags (array of strings)
- styling_tip (string — one actionable accessory/styling suggestion, e.g. "Pair with strappy sandals and a wicker bag")

Return ONLY a JSON array in the same order as the input.
Do not include any text outside the JSON array.
"""


async def narrate_outfits(
    outfits_with_products: list[dict],
    destination: str,
    occasions: list[str],
) -> list[dict]:
    """
    Agent 4: Write names, descriptions, and styling tips for each outfit.
    """
    user_msg = (
        f"Destination: {destination}\n"
        f"Trip occasions: {', '.join(occasions)}\n\n"
        f"Outfits:\n{json.dumps(outfits_with_products, indent=2)}"
    )
    result = await _call_claude(_NARRATE_OUTFITS_SYSTEM, user_msg)
    return result if isinstance(result, list) else []
