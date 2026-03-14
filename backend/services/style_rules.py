"""
Fashion knowledge base: color compatibility, outfit pairings,
occasion rules, and climate-fabric guidance.
"""

COLOR_COMPATIBILITY: dict[str, list[str]] = {
    "white":      ["navy", "black", "beige", "red", "olive", "camel", "pink", "grey", "gold"],
    "black":      ["white", "red", "camel", "gold", "pink", "grey", "beige", "olive", "navy"],
    "navy":       ["white", "camel", "beige", "gold", "light_blue", "pink", "grey"],
    "beige":      ["white", "brown", "olive", "navy", "rust", "camel", "black"],
    "olive":      ["camel", "white", "rust", "black", "beige", "brown"],
    "red":        ["white", "black", "navy", "camel", "gold"],
    "pink":       ["white", "black", "navy", "grey", "beige", "camel"],
    "camel":      ["white", "black", "navy", "olive", "beige", "rust", "brown"],
    "rust":       ["beige", "olive", "white", "camel", "brown", "black"],
    "brown":      ["beige", "camel", "white", "olive", "rust", "cream"],
    "grey":       ["white", "black", "navy", "pink", "red", "camel"],
    "gold":       ["white", "black", "navy", "red", "brown"],
    "cream":      ["brown", "camel", "olive", "rust", "navy", "black"],
    "light_blue": ["white", "navy", "beige", "camel", "grey"],
    "teal":       ["white", "beige", "camel", "navy", "rust"],
    "mustard":    ["white", "black", "olive", "brown", "navy"],
    "maroon":     ["beige", "camel", "white", "black", "gold"],
    "orange":     ["white", "black", "navy", "brown", "olive"],
    "purple":     ["white", "black", "grey", "beige", "gold"],
}

# Which colors are broadly neutral / go with anything
NEUTRAL_COLORS: list[str] = ["white", "black", "beige", "grey", "navy", "camel"]


OUTFIT_PAIRINGS: list[dict] = [
    {"top_style": "crop_top",       "bottom_style": "high_waist",    "rule": "balanced_proportion",  "note": "High waist compensates for cropped length"},
    {"top_style": "oversized",      "bottom_style": "slim",          "rule": "volume_balance",       "note": "Tuck in oversized top for a clean look"},
    {"top_style": "fitted",         "bottom_style": "wide_leg",      "rule": "volume_balance",       "note": "Fitted top grounds the wide silhouette"},
    {"top_style": "tucked_blouse",  "bottom_style": "midi_skirt",    "rule": "elegant_proportion",   "note": "Full tuck creates a polished waist"},
    {"top_style": "peplum",         "bottom_style": "pencil_skirt",  "rule": "hourglass_emphasis",   "note": "Both pieces accentuate the waist"},
    {"top_style": "wrap_top",       "bottom_style": "straight_pant", "rule": "defined_waist",        "note": "V-neck wrap elongates the torso"},
    {"top_style": "off_shoulder",   "bottom_style": "flared_skirt",  "rule": "feminine_balance",     "note": "Off-shoulder adds width to balance flare"},
    {"top_style": "fitted",         "bottom_style": "midi_skirt",    "rule": "classic_proportion",   "note": "Timeless combination for any occasion"},
    {"top_style": "oversized",      "bottom_style": "leggings",      "rule": "relaxed_casual",       "note": "Comfortable and effortlessly chic"},
    {"top_style": "cropped_jacket", "bottom_style": "wide_leg",      "rule": "structured_volume",    "note": "Cropped outerwear keeps the look light"},
]


OCCASION_RULES: dict[str, dict] = {
    "beach": {
        "fabrics":      ["cotton", "linen", "rayon", "jersey"],
        "silhouettes":  ["flowy", "relaxed", "loose", "breezy"],
        "colors":       ["white", "sky_blue", "coral", "yellow", "teal", "sand"],
        "avoid":        ["heavy_embroidery", "velvet", "wool", "structured"],
        "preferred_categories": ["dress", "top", "bottom"],
    },
    "dinner": {
        "fabrics":      ["chiffon", "silk", "satin", "lace", "crepe"],
        "silhouettes":  ["fitted", "structured", "midi", "elegant"],
        "colors":       ["black", "navy", "red", "gold", "burgundy", "jewel_tones"],
        "avoid":        ["overly_casual", "denim", "jersey"],
        "preferred_categories": ["dress", "co-ord", "top", "bottom"],
    },
    "sightseeing": {
        "fabrics":      ["cotton", "linen", "denim", "jersey"],
        "silhouettes":  ["relaxed", "comfortable", "practical"],
        "colors":       ["neutrals", "earth_tones", "pastels"],
        "avoid":        ["heels_required", "very_formal", "restrictive"],
        "preferred_categories": ["top", "bottom", "dress"],
    },
    "cultural": {
        "fabrics":      ["silk", "cotton", "georgette", "chiffon"],
        "silhouettes":  ["modest", "covered", "graceful"],
        "colors":       ["rich_tones", "jewel_tones", "traditional_prints"],
        "prefer":       ["ethnic_elements", "modest_coverage"],
        "avoid":        ["very_short", "revealing"],
        "preferred_categories": ["dress", "co-ord", "top", "bottom"],
    },
    "party": {
        "fabrics":      ["sequin", "chiffon", "silk", "lace", "velvet"],
        "silhouettes":  ["statement", "fitted", "dramatic"],
        "colors":       ["bold", "metallics", "jewel_tones", "black"],
        "avoid":        ["plain_basics", "overly_casual"],
        "preferred_categories": ["dress", "co-ord", "top", "bottom"],
    },
    "casual": {
        "fabrics":      ["cotton", "denim", "jersey", "linen"],
        "silhouettes":  ["relaxed", "comfortable", "everyday"],
        "colors":       ["all"],
        "avoid":        [],
        "preferred_categories": ["top", "bottom", "dress"],
    },
    "brunch": {
        "fabrics":      ["cotton", "linen", "chiffon", "jersey"],
        "silhouettes":  ["relaxed", "put_together", "feminine"],
        "colors":       ["pastels", "white", "floral_prints", "neutrals"],
        "avoid":        ["very_formal", "too_casual"],
        "preferred_categories": ["dress", "top", "bottom", "co-ord"],
    },
}


CLIMATE_FABRIC_RULES: dict[str, dict] = {
    "tropical": {
        "fabrics":       ["cotton", "linen", "rayon", "bamboo", "jersey"],
        "silhouettes":   ["loose", "flowy", "breathable"],
        "avoid":         ["wool", "velvet", "heavy_polyester", "synthetic_blends"],
        "outerwear":     "optional_light",
        "note":          "Breathability is key in humid heat",
    },
    "warm": {
        "fabrics":       ["cotton", "linen", "chiffon", "georgette", "chambray"],
        "silhouettes":   ["relaxed", "light", "airy"],
        "avoid":         ["wool", "velvet", "heavy_knit"],
        "outerwear":     "optional_light",
        "note":          "Light layers for temperature variation",
    },
    "mild": {
        "fabrics":       ["cotton", "denim", "light_knit", "chiffon", "poplin"],
        "silhouettes":   ["all_work"],
        "avoid":         [],
        "outerwear":     "recommended",
        "note":          "Most fabrics work; light jacket is handy",
    },
    "cool": {
        "fabrics":       ["wool", "knit", "denim", "velvet", "flannel", "corduroy"],
        "silhouettes":   ["layered", "structured"],
        "avoid":         ["very_sheer", "sleeveless_only"],
        "outerwear":     "essential",
        "note":          "Layering is essential; outerwear is a hero piece",
    },
}

# Destination-to-climate quick lookup (supplement Claude's knowledge)
DESTINATION_CLIMATE_HINTS: dict[str, str] = {
    "goa": "tropical",
    "kerala": "tropical",
    "mumbai": "tropical",
    "chennai": "tropical",
    "andaman": "tropical",
    "maldives": "tropical",
    "bali": "tropical",
    "thailand": "tropical",
    "rajasthan": "warm",
    "jaipur": "warm",
    "jodhpur": "warm",
    "delhi": "mild",
    "agra": "mild",
    "bangalore": "mild",
    "pune": "mild",
    "hyderabad": "mild",
    "shimla": "cool",
    "manali": "cool",
    "ladakh": "cool",
    "darjeeling": "cool",
    "london": "cool",
    "paris": "mild",
    "new york": "mild",
    "singapore": "tropical",
    "dubai": "warm",
}

# Assembled export used by agents
STYLE_RULES: dict = {
    "color_compatibility":      COLOR_COMPATIBILITY,
    "neutral_colors":           NEUTRAL_COLORS,
    "outfit_pairings":          OUTFIT_PAIRINGS,
    "occasion_rules":           OCCASION_RULES,
    "climate_fabric_rules":     CLIMATE_FABRIC_RULES,
    "destination_climate_hints": DESTINATION_CLIMATE_HINTS,
}
