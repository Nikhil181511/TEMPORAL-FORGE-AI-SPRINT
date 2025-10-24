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


class FlipkartSpider(scrapy.Spider):
    name = "flipkart"
    allowed_domains = ["flipkart.com"]

    def __init__(self, query=None, max_items=10, debug_html: bool = False, render: bool = False, **kwargs):
        super().__init__(**kwargs)
        self.query = query or ""
        self.max_items = int(max_items)
        self.collected = 0
        self.debug_html = debug_html
        self._dumped = False
        self.render = render

    def start_requests(self):
        url = f"https://www.flipkart.com/search?q={quote_plus(self.query)}"
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
                    PageMethod("wait_for_selector", "div._2kHMtA, div._1AtVbE", {"timeout": 15000}),
                    PageMethod("evaluate", "() => window.scrollBy(0, 1500)"),
                    PageMethod("wait_for_timeout", 800),
                ]
        yield scrapy.Request(
            url,
            callback=self.parse,
            headers={
                "Accept-Language": "en-IN,en;q=0.9",
                "Referer": "https://www.flipkart.com/",
            },
            meta=meta,
        )

    def parse(self, response):
        if self.debug_html and not self._dumped:
            try:
                import tempfile, os
                slug = re.sub(r"[^a-zA-Z0-9]+", "_", self.query)[:40]
                fn = os.path.join(tempfile.gettempdir(), f"flipkart_{slug}.html")
                with open(fn, "wb") as fp:
                    fp.write(response.body)
                self.logger.debug(f"Saved Flipkart HTML to {fn}")
                # Also save inside the workspace for easier inspection
                try:
                    app_dir = Path(__file__).resolve().parents[2]
                    dbg_dir = app_dir / "debug_dumps"
                    dbg_dir.mkdir(parents=True, exist_ok=True)
                    with open(dbg_dir / f"flipkart_{slug}.html", "wb") as fp2:
                        fp2.write(response.body)
                    self.logger.debug(f"Saved Flipkart HTML to {dbg_dir / f'flipkart_{slug}.html'}")
                except Exception as e2:
                    self.logger.debug(f"Failed to write workspace dump: {e2}")
            except Exception as e:
                self.logger.debug(f"Failed to dump Flipkart HTML: {e}")
            self._dumped = True
        # Detect anti-bot/captcha page quickly
        if b"captcha" in response.body.lower():
            logging.warning("Flipkart captcha/blocked page encountered")
            return

        # Pattern 1: Standard grid items (phones/electronics)
        product_cards = response.css("div._2kHMtA")
        # Pattern 2: List container + anchor (common in electronics, laptops)
        if not product_cards:
            product_cards = response.css("div._1AtVbE a._1fQZEK").xpath("ancestor::div[@data-id][1]")
        # Pattern 3: Compact grid cards
        if not product_cards:
            product_cards = response.css("div._4ddWXP, div._2B099V")
        # Pattern 4: Anchor cards (popular for general categories)
        if not product_cards:
            product_cards = response.css("a.s1Q9rs, a.IRpwTa").xpath("ancestor::div[@data-id][1]")
        # Pattern 5: Other variants seen in A/B tests
        if not product_cards:
            product_cards = response.css("div.yUATFE, div.-CXtew")

        # Fallback: generic data-id blocks with product anchors
        if not product_cards:
            product_cards = response.xpath(
                "//div[@data-id][.//a[contains(@href,'/p/') or contains(@href,'/item/') or contains(@href,'/product/')]]"
            )

        self.logger.debug(f"Flipkart product_cards found: {len(product_cards)}")

        for card in product_cards:
            if self.collected >= self.max_items:
                break

            title = (
                card.css("div._4rR01T::text").get()
                or card.css("div.KzDlHZ::text").get()
                or card.css("a._1fQZEK::attr(title)").get()
                or card.css("a._2rpwqI::attr(title)").get()
                or card.css("a.s1Q9rs::text").get()
                or card.css("a.IRpwTa::text").get()
                or card.css("a::attr(title)").get()
                or card.xpath(".//a/text()").get()
            )

            price = (
                card.css("div._30jeq3._1_WHN1::text").get()
                or card.css("div._30jeq3::text").get()
                or card.css("div.Nx9bqj::text").get()
                or card.css("div.whN1::text").get()
                or card.xpath(".//div[contains(@class,'_30jeq3') or contains(@class,'Nx9bqj')]/text()").get()
            )
            rating = card.css("div._3LWZlK::text").get()
            review_count_text = card.css("span._2_R_DZ span::text").getall()
            review_count = None
            if review_count_text:
                joined = " ".join(review_count_text)
                m = re.search(r"([\d,]+)\s+Ratings", joined)
                if m:
                    review_count = int(m.group(1).replace(",", ""))

            link = card.css("a._1fQZEK::attr(href), a.IRpwTa::attr(href), a.s1Q9rs::attr(href), a._2rpwqI::attr(href), a::attr(href)").get()
            if not link:
                link = card.xpath(".//a[contains(@href,'/p/') or contains(@href,'/item/') or contains(@href,'/product/')]/@href").get()
            url = urljoin(response.url, link) if link else response.url

            item = ProductItem()
            item["source"] = "flipkart"
            item["title"] = title.strip() if title else None
            item["price"] = price.strip() if price else None
            item["seller"] = None
            item["availability"] = None
            item["rating"] = float(rating) if rating and re.match(r"^\d+(\.\d+)?$", rating) else None
            item["review_count"] = review_count
            item["timestamp"] = datetime.utcnow().isoformat()
            item["url"] = url

            self.collected += 1
            yield item
