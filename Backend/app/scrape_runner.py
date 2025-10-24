import argparse
from scrapy.crawler import CrawlerProcess
from scrapy.settings import Settings

from app.scraper.settings import settings_dict
from app.scraper.spiders.flipkart import FlipkartSpider
from app.scraper.spiders.amazon import AmazonSpider


def main():
    parser = argparse.ArgumentParser(description="Run product scraping spiders")
    parser.add_argument("--query", required=True, help="Product keyword")
    parser.add_argument("--out", required=True, help="Output JSON file path")
    parser.add_argument("--max-items", type=int, default=10, help="Max items per site")
    parser.add_argument(
        "--sites",
        default="",
        help="Comma-separated sites to scrape: flipkart,amazon (default: both)",
    )
    parser.add_argument(
        "--render",
        action="store_true",
        help="Use Playwright (headless Chromium) for fetching pages",
    )
    parser.add_argument(
        "--debug-html",
        action="store_true",
        help="Dump first response HTML to a temp file and increase logging",
    )
    args = parser.parse_args()

    s = Settings()
    for k, v in settings_dict(enable_playwright=args.render).items():
        s.set(k, v)

    if args.debug_html:
        s.set("LOG_LEVEL", "DEBUG")

    s.set(
        "FEEDS",
        {
            args.out: {
                "format": "json",
                "encoding": "utf8",
                "overwrite": True,
                "indent": 2,
            }
        },
    )

    process = CrawlerProcess(settings=s)

    sites = [x.strip().lower() for x in args.sites.split(",") if x.strip()] or ["flipkart", "amazon"]
    if "flipkart" in sites:
        process.crawl(FlipkartSpider, query=args.query, max_items=args.max_items, debug_html=args.debug_html, render=args.render)
    if "amazon" in sites:
        process.crawl(AmazonSpider, query=args.query, max_items=args.max_items, debug_html=args.debug_html, render=args.render)
    process.start()


if __name__ == "__main__":
    main()
