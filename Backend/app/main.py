from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import subprocess
import sys
import tempfile
import json
import uuid
import re
from typing import Any, Dict, List, Optional

from .llm import get_product_variants
from .duckduckgo_scraper import search_products_ddg
from .ddg_routes import (
    DuckDuckGoScrapeRequest,
    DuckDuckGoFromListRequest,
    scrape_variants_with_duckduckgo,
    scrape_from_list_with_duckduckgo
)
from dotenv import load_dotenv

app = FastAPI()

# Load environment variables from Backend/.env so GEMINI_API_KEY is available
try:
    env_path = Path(__file__).resolve().parents[1] / ".env"
    load_dotenv(dotenv_path=str(env_path))
except Exception:
    # Best-effort; if this fails, os.getenv will still be used
    pass

# CORS for local React dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ProductRequest(BaseModel):
    product: str = Field(..., min_length=2, description="Product keyword to search, e.g., 'Phone'")
    sites: list[str] | None = Field(None, description="Optional list of sites: ['flipkart','amazon']")
    max_items: int | None = Field(None, ge=1, le=20, description="Max items per site (default 10)")
    debug: bool = Field(False, description="Enable extra logging and dump first-page HTML")


class VariantScrapeRequest(BaseModel):
    product: str = Field(..., min_length=2)
    max_variants: int = Field(10, ge=1, le=20)
    max_items: int = Field(5, ge=1, le=20, description="Max items per site for each variant")
    sites: list[str] | None = Field(None, description="Optional list of sites: ['flipkart','amazon']")
    debug: bool = Field(False, description="Enable extra logging and use headless rendering")


class VariantsListRequest(BaseModel):
    product: str = Field(..., min_length=2, description="Product keyword to expand via Gemini")
    max_variants: int = Field(10, ge=1, le=20, description="How many variant names to request")

@app.get("/")
def read_root():
    return {"message": "FastAPI + Scrapy backend is running."}

@app.post("/scrape")
async def scrape_products(req: ProductRequest):
    project_root = Path(__file__).resolve().parents[1]  # .../Backend
    out_dir = Path(tempfile.gettempdir()) / "scrape_results"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_file = out_dir / f"results_{uuid.uuid4().hex}.json"

    cmd = [
        sys.executable, "-m", "app.scrape_runner",
        "--query", req.product,
        "--out", str(out_file),
        "--max-items", str(req.max_items or 10),
    ]
    if req.debug:
        cmd.append("--debug-html")
    # If debug is on and still 0 results often, allow rendering (headless) as an option later
    # For now, keep a simple heuristic: when debug is true, also render the page
    if req.debug:
        cmd.append("--render")
    if req.sites:
        allowed = {"flipkart", "amazon"}
        chosen = ",".join([s for s in req.sites if s in allowed])
        if chosen:
            cmd += ["--sites", chosen]

    try:
        result = subprocess.run(
            cmd,
            cwd=str(project_root),
            check=True,
            capture_output=True,
            text=True,
            timeout=120,
        )
    except subprocess.CalledProcessError as e:
        raise HTTPException(status_code=500, detail=f"Scraper failed: {e.stderr or e.stdout}")
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=504, detail="Scraping timed out")

    if not out_file.exists():
        raise HTTPException(status_code=500, detail="No output produced by scraper")

    with out_file.open("r", encoding="utf-8") as f:
        data = json.load(f)

    return {
        "query": req.product,
        "count": len(data),
        "items": data,
    }


@app.post("/variants_list")
async def variants_list(req: VariantsListRequest):
    """Generate up to N variant names with Gemini and save to Backend/app/list.txt.

    Returns the list and the saved file path.
    """
    # Generate variant names
    variants = get_product_variants(req.product, max_variants=req.max_variants)

    # Save to Backend/app/list.txt
    app_dir = Path(__file__).resolve().parent  # .../Backend/app
    list_path = app_dir / "list.txt"

    try:
        with list_path.open("w", encoding="utf-8") as f:
            for v in variants:
                f.write(f"{v}\n")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to write list.txt: {e}")

    return {
        "product": req.product,
        "count": len(variants),
        "variants": variants,
        "file": str(list_path),
    }


def _parse_price_to_float(price: Optional[str]) -> Optional[float]:
    if not price or not isinstance(price, str):
        return None
    cleaned = re.sub(r"[^\d\.]", "", price)
    if not cleaned:
        return None
    try:
        return float(cleaned)
    except ValueError:
        return None


def _compute_insights(items: List[Dict[str, Any]]) -> Dict[str, Any]:
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


@app.post("/scrape_variants")
async def scrape_with_variants(req: VariantScrapeRequest):
    project_root = Path(__file__).resolve().parents[1]  # .../Backend
    out_dir = Path(tempfile.gettempdir()) / "scrape_results"
    out_dir.mkdir(parents=True, exist_ok=True)

    variants = get_product_variants(req.product, max_variants=req.max_variants)

    # Also write variants to a simple temp text file for visibility
    variants_file = out_dir / f"variants_{uuid.uuid4().hex}.txt"
    try:
        with variants_file.open("w", encoding="utf-8") as vf:
            for v in variants:
                vf.write(f"{v}\n")
    except Exception:
        variants_file = None
    all_items: List[Dict[str, Any]] = []

    for variant in variants:
        out_file = out_dir / f"results_{uuid.uuid4().hex}.json"
        cmd = [
            sys.executable,
            "-m",
            "app.scrape_runner",
            "--query",
            variant,
            "--out",
            str(out_file),
            "--max-items",
            str(req.max_items),
        ]

        if req.debug:
            cmd.append("--debug-html")
            cmd.append("--render")
        if req.sites:
            allowed = {"flipkart", "amazon"}
            chosen = ",".join([s for s in req.sites if s in allowed])
            if chosen:
                cmd += ["--sites", chosen]

        try:
            subprocess.run(
                cmd,
                cwd=str(project_root),
                check=True,
                capture_output=True,
                text=True,
                timeout=150,
            )
        except subprocess.CalledProcessError:
            continue
        except subprocess.TimeoutExpired:
            continue

        if out_file.exists():
            try:
                with out_file.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for it in data:
                            if isinstance(it, dict):
                                it["variant"] = variant
                                all_items.append(it)
            except Exception:
                pass

    insights = _compute_insights(all_items)
    return {
        "query": req.product,
        "variants": variants,
        "total_items": len(all_items),
        "insights": insights,
        "items": all_items,
        "variants_file": str(variants_file) if variants_file else None,
    }


class ScrapeFromListRequest(BaseModel):
    max_items: int = Field(5, ge=1, le=20, description="Max items per site for each variant")
    sites: list[str] | None = Field(None, description="Optional list of sites: ['flipkart','amazon']")
    debug: bool = Field(False, description="Enable extra logging and use headless rendering")
    top_n: int | None = Field(5, ge=1, le=50, description="Limit returned items per variant (by appearance order)")
    render: bool = Field(True, description="Use Playwright rendering for dynamic pages")


class DuckDuckGoScrapeRequest(BaseModel):
    product: str = Field(..., min_length=2, description="Product keyword to search")
    max_variants: int = Field(5, ge=1, le=20, description="How many variant names to generate")
    max_items_per_site: int = Field(3, ge=1, le=10, description="Max items per site per variant")
    sites: list[str] | None = Field(None, description="Sites to search: ['amazon','flipkart','myntra','ajio','snapdeal','croma','reliance','tatacliq']")


class DuckDuckGoFromListRequest(BaseModel):
    max_items_per_site: int = Field(3, ge=1, le=10, description="Max items per site per variant")
    sites: list[str] | None = Field(None, description="Sites to search (default: ['amazon','flipkart'])")
    top_n: int | None = Field(5, ge=1, le=50, description="Limit returned items per variant")


@app.post("/scrape_from_list")
async def scrape_from_list(req: ScrapeFromListRequest):
    """Read variants from Backend/app/list.txt, scrape each variant, compute insights,
    and save combined results to Backend/app/result.json.
    """
    project_root = Path(__file__).resolve().parents[1]  # .../Backend
    app_dir = Path(__file__).resolve().parent
    list_path = app_dir / "list.txt"
    result_path = app_dir / "result.json"

    if not list_path.exists():
        raise HTTPException(status_code=404, detail="list.txt not found. Generate variants first.")

    # Read variants
    try:
        raw = list_path.read_text(encoding="utf-8").splitlines()
        variants = [v.strip() for v in raw if v.strip()]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to read list.txt: {e}")

    out_dir = Path(tempfile.gettempdir()) / "scrape_results"
    out_dir.mkdir(parents=True, exist_ok=True)
    all_items: List[Dict[str, Any]] = []
    debug_logs: List[Dict[str, Any]] = []

    for variant in variants:
        out_file = out_dir / f"results_{uuid.uuid4().hex}.json"
        cmd = [
            sys.executable,
            "-m",
            "app.scrape_runner",
            "--query",
            variant,
            "--out",
            str(out_file),
            "--max-items",
            str(req.max_items),
        ]
        # Render when requested to maximize reliability on dynamic pages
        if req.render:
            cmd.append("--render")
        if req.debug:
            cmd.append("--debug-html")
        # Default to Flipkart if not specified
        sites_pref = req.sites or ["flipkart"]
        allowed = {"flipkart", "amazon"}
        chosen = ",".join([s for s in sites_pref if s in allowed])
        if chosen:
            cmd += ["--sites", chosen]

        try:
            proc = subprocess.run(
                cmd,
                cwd=str(project_root),
                check=True,
                capture_output=True,
                text=True,
                timeout=180,
            )
            if req.debug:
                debug_logs.append({
                    "variant": variant,
                    "returncode": proc.returncode,
                    "stdout_tail": (proc.stdout[-4000:] if proc.stdout else None),
                    "stderr_tail": (proc.stderr[-4000:] if proc.stderr else None),
                })
        except subprocess.CalledProcessError as e:
            if req.debug:
                debug_logs.append({
                    "variant": variant,
                    "returncode": e.returncode,
                    "stdout_tail": (e.stdout[-4000:] if e.stdout else None),
                    "stderr_tail": (e.stderr[-4000:] if e.stderr else None),
                    "error": "CalledProcessError",
                })
            continue
        except subprocess.TimeoutExpired as e:
            if req.debug:
                debug_logs.append({
                    "variant": variant,
                    "returncode": None,
                    "stdout_tail": None,
                    "stderr_tail": None,
                    "error": f"Timeout after {e.timeout}s",
                })
            continue

        if out_file.exists():
            try:
                with out_file.open("r", encoding="utf-8") as f:
                    data = json.load(f)
                    if isinstance(data, list):
                        for it in data:
                            if isinstance(it, dict):
                                it["variant"] = variant
                                all_items.append(it)
            except Exception:
                pass

    # Optionally limit per-variant items to top_n (preserve appearance order)
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

    insights = _compute_insights(all_items)

    # Save combined results to Backend/app/result.json
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

    # Optionally write debug logs to a file for inspection
    debug_file_path = None
    if req.debug and debug_logs:
        try:
            debug_file = app_dir / "scrape_debug.log"
            with debug_file.open("w", encoding="utf-8") as lf:
                lf.write(json.dumps(debug_logs, ensure_ascii=False, indent=2))
            debug_file_path = str(debug_file)
        except Exception:
            debug_file_path = None

    return {
        "query": "variants_list",
        "variants": variants,
        "total_items": len(all_items),
        "insights": insights,
        "items": all_items,
        "file": str(result_path),
        "count": len(all_items),
        **({"debug_log_file": debug_file_path, "logs": debug_logs} if req.debug else {}),
    }

@app.post("/scrape_variants_ddg")
async def scrape_variants_ddg_endpoint(req: DuckDuckGoScrapeRequest):
    return await scrape_variants_with_duckduckgo(req)


@app.post("/scrape_from_list_ddg")
async def scrape_from_list_ddg_endpoint(req: DuckDuckGoFromListRequest):
    return await scrape_from_list_with_duckduckgo(req)
