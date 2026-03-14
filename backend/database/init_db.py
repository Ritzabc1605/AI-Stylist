"""
Run this once to create all tables and seed the catalog.
Usage: python database/init_db.py
"""
import json
import os
import sys

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database.connection import engine, SessionLocal
from database.models import Base, Product

def create_tables():
    print("Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created")

def seed_catalog():
    catalog_path = os.path.join(os.path.dirname(__file__), "..", "catalog.json")
    if not os.path.exists(catalog_path):
        print("⚠️  catalog.json not found, skipping seed")
        return

    db = SessionLocal()
    try:
        existing = db.query(Product).count()
        if existing > 0:
            print(f"⚠️  Catalog already has {existing} products, skipping seed")
            return

        with open(catalog_path) as f:
            items = json.load(f)

        for i, item in enumerate(items):
            product = Product(
                sku=item["id"],
                name=item["name"],
                description=item.get("description", ""),
                category=item["category"],
                price=item["price"],
                stock_quantity=50,
                colors=item.get("colors", []),
                occasions=item.get("occasions", []),
                climate=item.get("climate", []),
                image_url=item.get("image_url", ""),
                is_active=True
            )
            db.add(product)

        db.commit()
        print(f"✅ Seeded {len(items)} products into catalog")
    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_tables()
    seed_catalog()
    print("\n✅ Database ready at database/ai_stylist.db")