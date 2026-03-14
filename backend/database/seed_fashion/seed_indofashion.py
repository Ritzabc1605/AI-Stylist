"""
DeepFashion Dataset Seeder (Fixed)
Uses correct category2 labels from Marqo/deepfashion-inshop dataset.

Usage:
    python database/seed_indofashion.py
"""

import os
import sys
import json
import random
from pathlib import Path
from collections import defaultdict

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from PIL import Image
from datasets import load_dataset
from database.connection import engine, SessionLocal
from database.models import Base, Product

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────
TARGET_COUNT = 2000
IMAGES_DIR = Path("static/images")
CATALOG_JSON = Path("catalog.json")

# category2 → our internal category
LABEL_MAP = {
    "dresses":      "dress",
    "rompers":      "dress",
    "blouses":      "top",
    "tees":         "top",
    "graphic":      "top",
    "shirts":       "top",
    "cardigans":    "outerwear",
    "jackets":      "outerwear",
    "suiting":      "outerwear",
    "sweaters":     "outerwear",
    "sweatshirts":  "outerwear",
    "pants":        "bottom",
    "denim":        "bottom",
    "leggings":     "bottom",
    "shorts":       "bottom",
    "skirts":       "bottom",
}

# How many per our internal category
CATEGORY_LIMITS = {
    "dress":        500,
    "top":          500,
    "bottom":       550,
    "outerwear":    450,
}

PRICE_RANGES = {
    "dress":        (2000, 6000),
    "top":          (800,  2500),
    "bottom":       (1000, 3500),
    "outerwear":    (2500, 8000),
}

OCCASION_MAP = {
    "dress":        ["casual", "dinner", "party", "beach", "brunch"],
    "top":          ["casual", "beach", "sightseeing", "brunch"],
    "bottom":       ["casual", "beach", "sightseeing", "dinner"],
    "outerwear":    ["casual", "dinner", "sightseeing", "party"],
}

CLIMATE_MAP = {
    "dress":        ["tropical", "warm"],
    "top":          ["tropical", "warm"],
    "bottom":       ["tropical", "warm", "mild"],
    "outerwear":    ["mild", "cool"],
}

ADJECTIVES = [
    "Elegant", "Floral", "Classic", "Modern", "Embroidered",
    "Printed", "Solid", "Chic", "Boho", "Vintage",
    "Contemporary", "Casual", "Festive", "Minimal", "Trendy"
]

CATEGORY_DISPLAY = {
    "dress":     "Dress",
    "top":       "Top",
    "bottom":    "Bottom",
    "outerwear": "Jacket",
}

def generate_sku(category: str, index: int) -> str:
    prefix = category[:3].upper()
    return f"DF-{prefix}-{index:04d}"

def generate_name(category: str, index: int) -> str:
    adj = ADJECTIVES[index % len(ADJECTIVES)]
    base = CATEGORY_DISPLAY.get(category, category.title())
    return f"{adj} {base}"

def assign_occasions(category: str) -> list:
    pool = OCCASION_MAP.get(category, ["casual"])
    return random.sample(pool, random.randint(2, min(3, len(pool))))

def assign_climate(category: str) -> list:
    pool = CLIMATE_MAP.get(category, ["warm"])
    return random.sample(pool, random.randint(1, min(2, len(pool))))

def assign_price(category: str) -> float:
    low, high = PRICE_RANGES.get(category, (1000, 5000))
    return round(random.uniform(low, high), -1)

def save_image(pil_image, category: str, sku: str) -> str:
    cat_dir = IMAGES_DIR / category
    cat_dir.mkdir(parents=True, exist_ok=True)
    img_path = cat_dir / f"{sku}.jpg"
    pil_image = pil_image.convert("RGB")
    pil_image = pil_image.resize((512, 512), Image.LANCZOS)
    pil_image.save(img_path, "JPEG", quality=85)
    return str(img_path)

def seed_database(products: list):
    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        if existing > 0:
            print(f"⚠️  DB already has {existing} products.")
            answer = input("   Clear and re-seed? (y/n): ").strip().lower()
            if answer == "y":
                db.query(Product).delete()
                db.commit()
                print("   Cleared.\n")
            else:
                print("   Skipping DB seed.")
                return

        print(f"💾 Inserting {len(products)} products into SQLite...")
        for p in products:
            db.add(Product(
                sku=p["sku"],
                name=p["name"],
                description=p["description"],
                category=p["category"],
                price=p["price"],
                stock_quantity=random.randint(10, 100),
                colors=p["colors"],
                occasions=p["occasions"],
                climate=p["climate"],
                image_url=p["image_url"],
                is_active=True
            ))
        db.commit()
        print(f"✅ Inserted {len(products)} products\n")
    except Exception as e:
        db.rollback()
        print(f"❌ DB insert failed: {e}")
        raise
    finally:
        db.close()

def update_catalog_json(products: list):
    catalog = [
        {
            "id": p["sku"],
            "name": p["name"],
            "category": p["category"],
            "price": p["price"],
            "colors": p["colors"],
            "occasions": p["occasions"],
            "climate": p["climate"],
            "image_url": p["image_url"],
            "description": p["description"]
        }
        for p in products
    ]
    with open(CATALOG_JSON, "w") as f:
        json.dump(catalog, f, indent=2)
    print(f"✅ Updated catalog.json with {len(catalog)} items\n")

def main():
    Base.metadata.create_all(bind=engine)
    IMAGES_DIR.mkdir(parents=True, exist_ok=True)

    print("📦 Loading DeepFashion dataset (using cache)...")
    dataset = load_dataset("Marqo/deepfashion-inshop", split="data")
    print(f"✅ Loaded {len(dataset)} samples\n")

    # Shuffle for variety
    indices = list(range(len(dataset)))
    random.shuffle(indices)

    category_counts = defaultdict(int)
    products = []
    skipped = 0
    global_index = 1

    print("🔄 Processing images...\n")

    for idx in indices:
        if len(products) >= TARGET_COUNT:
            break

        sample = dataset[idx]
        raw_label = sample.get("category2", "")
        category = LABEL_MAP.get(raw_label)

        if not category:
            skipped += 1
            continue

        limit = CATEGORY_LIMITS.get(category, 0)
        if category_counts[category] >= limit:
            continue

        try:
            pil_image = sample["image"]
            if not isinstance(pil_image, Image.Image):
                skipped += 1
                continue

            sku = generate_sku(category, global_index)
            occasions = assign_occasions(category)
            climate = assign_climate(category)

            raw_color = sample.get("color", "") or ""
            colors = [raw_color.lower()] if raw_color else ["multicolor"]

            raw_desc = sample.get("text", "") or ""
            description = raw_desc[:200] if raw_desc else f"{generate_name(category, global_index)} for {', '.join(occasions)}"

            image_url = save_image(pil_image, category, sku)

            products.append({
                "sku": sku,
                "name": generate_name(category, global_index),
                "description": description,
                "category": category,
                "price": assign_price(category),
                "colors": colors,
                "occasions": occasions,
                "climate": climate,
                "image_url": image_url,
            })

            category_counts[category] += 1
            global_index += 1

            if len(products) % 100 == 0:
                print(f"   ✓ {len(products)} products processed...")

        except Exception as e:
            skipped += 1
            continue

    print(f"\n📊 Done:")
    print(f"   Total products : {len(products)}")
    print(f"   Skipped        : {skipped}")
    print(f"\n   Breakdown by category:")
    for cat, count in sorted(category_counts.items()):
        print(f"   {cat:<15} {count}")

    if not products:
        print("\n❌ No products processed.")
        return

    seed_database(products)
    update_catalog_json(products)

    print("🎉 Catalog ready!")
    print(f"   DB     : database/ai_stylist.db")
    print(f"   Images : static/images/")
    print(f"   JSON   : catalog.json")

if __name__ == "__main__":
    main()