import json
import os
from typing import List

try:
    import google.generativeai as genai
except Exception:  # pragma: no cover - optional at import time
    genai = None


class LLMUnavailable(Exception):
    pass


def get_product_variants(product: str, max_variants: int = 10) -> List[str]:
    """Return up to N product variants using Google Gemini.

    Requires env var GEMINI_API_KEY (or GOOGLE_API_KEY) to be set.
    Returns a list of strings. Falls back to [product] if LLM unavailable or key missing.
    """
    api_key = os.getenv("GEMINI_API_KEY") or os.getenv("GOOGLE_API_KEY")
    if not api_key or genai is None:
        # Graceful fallback: just return the original product
        return [product]

    genai.configure(api_key=api_key)

    # Prefer a lightweight model for speed/cost
    model = genai.GenerativeModel("gemini-2.5-flash")

    prompt = f"""
    You are a helpful assistant that expands a shopping query into concrete product variants.

    Input product: "{product}"

    Task:
    - Generate up to {max_variants} specific, popular variants or models for the given product in the Indian market.
    - Focus on meaningful variants users actually search for (e.g., for Phone: "iPhone 15", "Samsung Galaxy S24", "OnePlus 12").
    - Respond ONLY as a compact JSON array of strings. No extra text.

    Example response:
    ["iPhone 15", "Samsung Galaxy S24", "OnePlus 12", "Xiaomi Redmi Note 13", "Realme 12 Pro"]
    """

    resp = model.generate_content(prompt)
    text = resp.text.strip() if hasattr(resp, "text") and resp.text else ""

    # Attempt direct JSON parse; otherwise extract first JSON array
    variants: List[str] = []
    try:
        variants = json.loads(text)
        if not isinstance(variants, list):
            variants = []
    except Exception:
        # naive extraction of the first [...] block
        start = text.find("[")
        end = text.rfind("]")
        if start != -1 and end != -1 and end > start:
            try:
                variants = json.loads(text[start : end + 1])
            except Exception:
                variants = []

    cleaned = []
    for v in variants:
        if isinstance(v, str):
            s = v.strip()
            if s and s.lower() != product.lower():
                cleaned.append(s)
    # Always include the original product at the front
    merged = [product] + [x for i, x in enumerate(cleaned) if x not in cleaned[:i]]
    return merged[: max(1, max_variants)]
