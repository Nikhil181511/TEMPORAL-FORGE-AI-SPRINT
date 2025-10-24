"""
Quick test to verify the updated DuckDuckGo scraper with direct site search fallback
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.duckduckgo_scraper import DuckDuckGoScraper


def test_direct_search():
    """Test direct site search (no DuckDuckGo)"""
    print("=" * 70)
    print("TESTING DIRECT SITE SEARCH (Fallback Method)")
    print("=" * 70)
    
    scraper = DuckDuckGoScraper(timeout=15, delay=0.8)
    
    # Test direct Amazon search
    print("\n1. Testing Amazon Direct Search...")
    print("-" * 70)
    urls = scraper.direct_site_search("iPhone 15", "amazon")
    print(f"Found {len(urls)} Amazon URLs")
    for i, url in enumerate(urls[:3], 1):
        print(f"  {i}. {url[:80]}...")
    
    # Test direct Flipkart search
    print("\n2. Testing Flipkart Direct Search...")
    print("-" * 70)
    urls = scraper.direct_site_search("iPhone 15", "flipkart")
    print(f"Found {len(urls)} Flipkart URLs")
    for i, url in enumerate(urls[:3], 1):
        print(f"  {i}. {url[:80]}...")
    
    # Test full scraping with fallback
    print("\n3. Testing Full Scraping (with fallback)...")
    print("-" * 70)
    products = scraper.search_and_scrape(
        product_query="Samsung Galaxy S24",
        sites=["amazon", "flipkart"],
        max_items_per_site=2
    )
    
    print(f"\n✓ Successfully scraped {len(products)} products\n")
    
    for i, product in enumerate(products, 1):
        print(f"Product {i}:")
        print(f"  Source: {product.get('source')}")
        print(f"  Title: {product.get('title', 'N/A')[:70]}...")
        print(f"  Price: {product.get('price', 'N/A')}")
        print(f"  Rating: {product.get('rating', 'N/A')}")
        print()
    
    print("=" * 70)
    if products:
        print("✅ TEST PASSED - Products successfully scraped!")
    else:
        print("⚠️  WARNING - No products scraped (check site accessibility)")
    print("=" * 70)
    
    return len(products) > 0


if __name__ == "__main__":
    try:
        success = test_direct_search()
        sys.exit(0 if success else 1)
    except Exception as e:
        print(f"\n❌ ERROR: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
