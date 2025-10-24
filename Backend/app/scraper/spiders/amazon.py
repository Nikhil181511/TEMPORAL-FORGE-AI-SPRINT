import re
from urllib.parse import quote_plus, urljoin
from datetime import datetime
import logging
from pathlib import Path

import scrapy
try:
    from scrapy_playwright.page import PageMethod
except Exception:
    PageMethod = None
from app.scraper.items import ProductItem


class AmazonSpider(scrapy.Spider):
    name = "amazon"
    allowed_domains = ["amazon.in", "www.amazon.in"]

    def __init__(self, query=None, max_items=10, debug_html: bool = False, render: bool = False, **kwargs):
        super().__init__(**kwargs)
        self.query = query or ""
        self.max_items = int(max_items)
        self.collected = 0
        self.debug_html = debug_html
        self._dumped = False
        self.render = render

    def start_requests(self):
        # Tweak query to prefer English/IN results
        url = f"https://www.amazon.in/s?k={quote_plus(self.query)}&language=en_IN"
        meta = None
        if self.render:
            meta = {
                "playwright": True,
                "playwright_context_kwargs": {
                    "user_agent": (
                        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                        "AppleWebKit/537.36 (KHTML, like Gecko) "
                        "Chrome/120.0.0.0 Safari/537.36"
                    ),
                    "viewport": {"width": 1366, "height": 768},
                    "locale": "en-IN",
                },
            }
            if PageMethod is not None:
                meta["playwright_page_methods"] = [
                    PageMethod("wait_for_selector", "div.s-search-results", {"timeout": 15000}),
                    PageMethod("evaluate", "() => window.scrollBy(0, 1500)"),
                    PageMethod("wait_for_timeout", 800),
                ]
        yield scrapy.Request(
            url,
            callback=self.parse,
            headers={
                "Accept-Language": "en-IN,en;q=0.9",
                "Referer": "https://www.amazon.in/",
            },
            meta=meta,
        )

    def parse(self, response):
        if self.debug_html and not self._dumped:
            try:
                import tempfile, os
                import re as _re
                slug = _re.sub(r"[^a-zA-Z0-9]+", "_", self.query)[:40]
                fn = os.path.join(tempfile.gettempdir(), f"amazon_{slug}.html")
                with open(fn, "wb") as fp:
                    fp.write(response.body)
                self.logger.debug(f"Saved Amazon HTML to {fn}")
                # Also save inside the workspace for easier inspection
                try:
                    app_dir = Path(__file__).resolve().parents[2]
                    dbg_dir = app_dir / "debug_dumps"
                    dbg_dir.mkdir(parents=True, exist_ok=True)
                    with open(dbg_dir / f"amazon_{slug}.html", "wb") as fp2:
                        fp2.write(response.body)
                    self.logger.debug(f"Saved Amazon HTML to {dbg_dir / f'amazon_{slug}.html'}")
                except Exception as e2:
                    self.logger.debug(f"Failed to write workspace dump: {e2}")
            except Exception as e:
                self.logger.debug(f"Failed to dump Amazon HTML: {e}")
            self._dumped = True

        # Detect anti-bot/captcha page quickly
        b = response.body.lower()
        if b.find(b"captcha") != -1 or b.find(b"robot check") != -1:
            logging.warning("Amazon captcha/blocked page encountered")
            return

        # Prefer canonical search results container
        products = response.css("div.s-search-results div.s-result-item.s-asin[data-asin]")
        if not products:
            # Fallback patterns
            products = response.xpath("//div[contains(@class,'s-result-item') and @data-asin and contains(@data-component-type,'s-search-result')]")
        self.logger.debug(f"Amazon products found: {len(products)}")
        for p in products:
            if self.collected >= self.max_items:
                break

            title = p.css("h2 a span::text").get() or p.css("h2 a::attr(aria-label)").get()
            # Prefer the fully formatted price Amazon shows
            price_text = p.css("span.a-price span.a-offscreen::text").get()
            price_whole = p.css("span.a-price span.a-price-whole::text").get()
            price_frac = p.css("span.a-price span.a-price-fraction::text").get()
            price = None
            if price_text:
                # e.g., '₹54,999.00' -> '54999.00'
                digits = re.sub(r"[^\d.]", "", price_text)
                price = digits or price_text
            elif price_whole:
                price = price_whole.replace(",", "")
                if price_frac:
                    price = f"{price}.{price_frac}"

            rating_text = p.css("span.a-icon-alt::text").get()
            rating = None
            if rating_text:
                m = re.search(r"(\d+(\.\d+)?)", rating_text)
                rating = float(m.group(1)) if m else None

            review_count_text = p.css(
                "span[aria-label$='ratings']::attr(aria-label), span.a-size-base.s-underline-text::text"
            ).get()
            review_count = None
            if review_count_text:
                m = re.search(r"([\d,]+)", review_count_text)
                review_count = int(m.group(1).replace(",", "")) if m else None

            link = p.css("h2 a::attr(href)").get()
            url = urljoin(response.url, link) if link else response.url

            item = ProductItem()
            item["source"] = "amazon"
            item["title"] = title.strip() if title else None
            item["price"] = price
            item["seller"] = None
            item["availability"] = None
            item["rating"] = rating
            item["review_count"] = review_count
            item["timestamp"] = datetime.utcnow().isoformat()
            item["url"] = url

            self.collected += 1
            yield item
