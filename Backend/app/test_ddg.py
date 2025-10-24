"""
Test script to verify DuckDuckGo scraping functionality
"""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.duckduckgo_scraper import search_products_ddg


def test_simple_search():
    """Test basic DuckDuckGo product search"""
    print("Testing DuckDuckGo scraper...")
    print("=" * 60)
    
    # Test with a simple query
    query = "iPhone 15"
    sites = ["amazon", "flipkart"]
    max_items = 2
    
    print(f"\nSearching for: {query}")
    print(f"Sites: {sites}")
    print(f"Max items per site: {max_items}")
    print("-" * 60)
    
    try:
        results = search_products_ddg(
            product_query=query,
            sites=sites,
            max_items_per_site=max_items
        )
        
        print(f"\n✓ Found {len(results)} products\n")
        
        for i, product in enumerate(results, 1):
            print(f"\nProduct {i}:")
            print(f"  Source: {product.get('source', 'N/A')}")
            print(f"  Title: {product.get('title', 'N/A')[:80]}...")
            print(f"  Price: {product.get('price', 'N/A')}")
            print(f"  Rating: {product.get('rating', 'N/A')}")
            print(f"  URL: {product.get('url', 'N/A')[:80]}...")
        
        print("\n" + "=" * 60)
        print("✓ Test completed successfully!")
        return True
        
    except Exception as e:
        print(f"\n✗ Error during test: {e}")
        import traceback
        traceback.print_exc()
        return False


if __name__ == "__main__":
    success = test_simple_search()
    sys.exit(0 if success else 1)
