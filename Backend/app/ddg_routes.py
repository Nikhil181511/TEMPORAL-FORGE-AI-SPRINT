"""
Additional endpoints for DuckDuckGo-based product scraping.
Import and include these routes in your main FastAPI app.
"""

from fastapi import HTTPException
from pydantic import BaseModel, Field
from pathlib import Path
import json
from typing import Any, Dict, List

from .llm import get_product_variants
from .duckduckgo_scraper import search_products_ddg


class DuckDuckGoScrapeRequest(BaseModel):
    product: str = Field(..., min_length=2, description="Product keyword to search")
    max_variants: int = Field(5, ge=1, le=20, description="How many variant names to generate")
    max_items_per_site: int = Field(3, ge=1, le=10, description="Max items per site per variant")
    sites: list[str] | None = Field(None, description="Sites to search: ['amazon','flipkart','myntra','ajio','snapdeal','croma','reliance','tatacliq']")


class DuckDuckGoFromListRequest(BaseModel):
    max_items_per_site: int = Field(3, ge=1, le=10, description="Max items per site per variant")
    sites: list[str] | None = Field(None, description="Sites to search (default: ['amazon','flipkart'])")
    top_n: int | None = Field(5, ge=1, le=50, description="Limit returned items per variant")


def _parse_price_to_float(price: str | None) -> float | None:
    """Parse price string to float."""
    if not price or not isinstance(price, str):
        return None
    import re
    cleaned = re.sub(r"[^\d\.]", "", price)
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def _compute_insights(items: List[Dict[str, Any]]) -> Dict[str, Any]:
    """Compute price and rating insights."""
    prices = [p for p in (_parse_price_to_float(x.get("price")) for x in items) if p is not None]
    ratings = [float(r) for r in (x.get("rating") for x in items) if isinstance(r, (int, float))]
    overall = {
        "avg_price": round(sum(prices) / len(prices), 2) if prices else None,
        "avg_rating": round(sum(ratings) / len(ratings), 2) if ratings else None,
        "count": len(items),
    }

    per_variant: Dict[str, Dict[str, Any]] = {}
    for it in items:
        v = (it.get("variant") or "").strip() or "(original)"
        per_variant.setdefault(v, {"variant": v, "count": 0, "_prices": [], "_ratings": []})
        per_variant[v]["count"] += 1
        p = _parse_price_to_float(it.get("price"))
        if p is not None:
            per_variant[v]["_prices"].append(p)
        r = it.get("rating")
        if isinstance(r, (int, float)):
            per_variant[v]["_ratings"].append(float(r))

    per_variant_list: List[Dict[str, Any]] = []
    for v, rec in per_variant.items():
        prices_v = rec.pop("_prices")
        ratings_v = rec.pop("_ratings")
        rec["avg_price"] = round(sum(prices_v) / len(prices_v), 2) if prices_v else None
        rec["avg_rating"] = round(sum(ratings_v) / len(ratings_v), 2) if ratings_v else None
        per_variant_list.append(rec)

    return {"overall": overall, "per_variant": per_variant_list}


async def scrape_variants_with_duckduckgo(req: DuckDuckGoScrapeRequest):
    """
    Generate product variants using LLM, then use DuckDuckGo to search and scrape 
    product details from multiple e-commerce sites.
    
    This is a simpler alternative to the Scrapy-based approach.
    """
    # Generate variants using LLM
    variants = get_product_variants(req.product, max_variants=req.max_variants)
    
    # Default sites if not specified
    sites = req.sites or ['amazon', 'flipkart']
    
    all_items: List[Dict[str, Any]] = []
    
    # Scrape each variant using DuckDuckGo
    for variant in variants:
        print(f"\nProcessing variant: {variant}")
        try:
            products = search_products_ddg(
                product_query=variant,
                sites=sites,
                max_items_per_site=req.max_items_per_site
            )
            
            # Add variant info to each product
            for product in products:
                product['variant'] = variant
                all_items.append(product)
                
        except Exception as e:
            print(f"Error scraping variant '{variant}': {e}")
            continue
    
    # Compute insights
    insights = _compute_insights(all_items)
    
    # Save to app directory
    app_dir = Path(__file__).resolve().parent
    result_path = app_dir / "result.json"
    
    try:
        with result_path.open("w", encoding="utf-8") as rf:
            json.dump(
                {
                    "query": req.product,
                    "variants": variants,
                    "total_items": len(all_items),
                    "insights": insights,
                    "items": all_items,
                },
                rf,
                ensure_ascii=False,
                indent=2,
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write result.json: {e}")
    
    return {
        "query": req.product,
        "variants": variants,
        "total_items": len(all_items),
        "insights": insights,
        "items": all_items,
        "file": str(result_path),
    }


async def scrape_from_list_with_duckduckgo(req: DuckDuckGoFromListRequest):
    """
    Read variants from Backend/app/list.txt, then use DuckDuckGo to search and scrape
    product details from multiple e-commerce sites. Save results to result.json.
    """
    app_dir = Path(__file__).resolve().parent
    list_path = app_dir / "list.txt"
    result_path = app_dir / "result.json"
    
    if not list_path.exists():
        raise HTTPException(status_code=404, detail="list.txt not found. Generate variants first using /variants_list endpoint.")
    
    # Read variants from list.txt
    try:
        raw = list_path.read_text(encoding="utf-8").splitlines()
        variants = [v.strip() for v in raw if v.strip()]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read list.txt: {e}")
    
    if not variants:
        raise HTTPException(status_code=400, detail="list.txt is empty")
    
    # Default sites if not specified
    sites = req.sites or ['amazon', 'flipkart']
    
    all_items: List[Dict[str, Any]] = []
    
    # Scrape each variant using DuckDuckGo
    for variant in variants:
        print(f"\nProcessing variant: {variant}")
        try:
            products = search_products_ddg(
                product_query=variant,
                sites=sites,
                max_items_per_site=req.max_items_per_site
            )
            
            # Add variant info to each product
            for product in products:
                product['variant'] = variant
                all_items.append(product)
                
        except Exception as e:
            print(f"Error scraping variant '{variant}': {e}")
            continue
    
    # Optionally limit per-variant items to top_n
    if req.top_n:
        limited: List[Dict[str, Any]] = []
        per_counts: Dict[str, int] = {}
        for it in all_items:
            v = (it.get("variant") or "").strip() or "(original)"
            c = per_counts.get(v, 0)
            if c < req.top_n:
                limited.append(it)
                per_counts[v] = c + 1
        all_items = limited
    
    # Compute insights
    insights = _compute_insights(all_items)
    
    # Save to result.json
    try:
        with result_path.open("w", encoding="utf-8") as rf:
            json.dump(
                {
                    "variants": variants,
                    "total_items": len(all_items),
                    "insights": insights,
                    "items": all_items,
                },
                rf,
                ensure_ascii=False,
                indent=2,
            )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write result.json: {e}")
    
    return {
        "query": "variants_from_list",
        "variants": variants,
        "total_items": len(all_items),
        "insights": insights,
        "items": all_items,
        "file": str(result_path),
    }
