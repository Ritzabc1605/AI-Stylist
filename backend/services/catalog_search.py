"""
Catalog search: queries SQLite products table and filters
by climate, occasions, and budget.
"""

from sqlalchemy.orm import Session
from database.models import Product


async def filter_by_context(
    climate: str,
    occasions: list[str],
    max_price: float,
    db: Session,
) -> list[dict]:
    """
    Returns products matching climate + occasion context under max_price.

    SQLite has limited JSON query support so we filter in Python after
    fetching price-filtered rows.
    """
    rows = (
        db.query(Product)
        .filter(Product.is_active == True, Product.price <= max_price)
        .all()
    )

    results: list[dict] = []
    for p in rows:
        product_climate: list[str] = p.climate or []
        product_occasions: list[str] = p.occasions or []

        climate_match = not product_climate or climate in product_climate
        occasion_match = not product_occasions or any(
            o in product_occasions for o in occasions
        )

        # Include if either climate or occasion matches (OR logic avoids over-restriction)
        if climate_match or occasion_match:
            results.append(
                {
                    "id": p.id,
                    "sku": p.sku,
                    "name": p.name,
                    "category": p.category,
                    "price": p.price,
                    "colors": p.colors or [],
                    "occasions": product_occasions,
                    "climate": product_climate,
                    "image_url": p.image_url,
                }
            )

    return results


def get_products_by_ids(product_ids: list[int], db: Session) -> dict[int, dict]:
    """Fetch products by id list; returns a dict keyed by product id."""
    rows = db.query(Product).filter(Product.id.in_(product_ids)).all()
    return {
        p.id: {
            "id": p.id,
            "sku": p.sku,
            "name": p.name,
            "category": p.category,
            "price": p.price,
            "colors": p.colors or [],
            "occasions": p.occasions or [],
            "climate": p.climate or [],
            "image_url": p.image_url,
        }
        for p in rows
    }
