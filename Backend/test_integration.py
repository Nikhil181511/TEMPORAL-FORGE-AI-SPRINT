"""
Integration test for the complete workflow:
1. Generate variants using LLM
2. Scrape products using DuckDuckGo
3. Verify results
"""
import requests
import json
import time


BASE_URL = "http://localhost:8000"


def test_complete_workflow():
    """Test the complete DuckDuckGo scraping workflow"""
    print("=" * 70)
    print("INTEGRATION TEST: LLM + DuckDuckGo Product Scraping")
    print("=" * 70)
    
    # Test 1: Generate variants list
    print("\n📝 Test 1: Generating product variants...")
    print("-" * 70)
    
    variants_request = {
        "product": "smartphone",
        "max_variants": 3
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/variants_list",
            json=variants_request,
            timeout=30
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Generated {data['count']} variants:")
            for variant in data['variants']:
                print(f"  - {variant}")
            print(f"✓ Saved to: {data['file']}")
        else:
            print(f"✗ Request failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        return False
    
    # Wait a bit before next test
    time.sleep(2)
    
    # Test 2: Scrape from list using DuckDuckGo
    print("\n🔍 Test 2: Scraping products from list using DuckDuckGo...")
    print("-" * 70)
    
    scrape_request = {
        "max_items_per_site": 2,
        "sites": ["amazon", "flipkart"],
        "top_n": 3
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/scrape_from_list_ddg",
            json=scrape_request,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Scraped {data['total_items']} products")
            print(f"\n📊 Insights:")
            if data['insights']['overall']['avg_price']:
                print(f"  Average Price: ₹{data['insights']['overall']['avg_price']}")
            if data['insights']['overall']['avg_rating']:
                print(f"  Average Rating: {data['insights']['overall']['avg_rating']}/5")
            
            print(f"\n📦 Products by variant:")
            for variant_info in data['insights']['per_variant'][:3]:
                print(f"  {variant_info['variant']}: {variant_info['count']} products")
            
            print(f"\n💾 Results saved to: {data['file']}")
            
            # Show sample products
            if data['items']:
                print(f"\n🛍️  Sample products:")
                for item in data['items'][:3]:
                    print(f"  - [{item['source']}] {item['title'][:60]}...")
                    if item.get('price'):
                        print(f"    Price: {item['price']}")
                    if item.get('rating'):
                        print(f"    Rating: {item['rating']}/5")
            
        else:
            print(f"✗ Request failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    # Test 3: One-step scraping
    print("\n⚡ Test 3: One-step variant generation and scraping...")
    print("-" * 70)
    
    onestep_request = {
        "product": "wireless earbuds",
        "max_variants": 2,
        "max_items_per_site": 1,
        "sites": ["amazon", "flipkart"]
    }
    
    try:
        response = requests.post(
            f"{BASE_URL}/scrape_variants_ddg",
            json=onestep_request,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ Generated {len(data['variants'])} variants")
            print(f"✓ Scraped {data['total_items']} products")
            
            if data['insights']['overall']['avg_price']:
                print(f"\n📊 Average Price: ₹{data['insights']['overall']['avg_price']}")
            
        else:
            print(f"✗ Request failed: {response.status_code}")
            print(f"  Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"✗ Error: {e}")
        import traceback
        traceback.print_exc()
        return False
    
    print("\n" + "=" * 70)
    print("✅ ALL TESTS PASSED!")
    print("=" * 70)
    return True


def test_server_health():
    """Check if server is running"""
    try:
        response = requests.get(f"{BASE_URL}/", timeout=5)
        return response.status_code == 200
    except:
        return False


if __name__ == "__main__":
    print("\n🔍 Checking if server is running...")
    if not test_server_health():
        print("❌ Server is not running!")
        print("\nPlease start the server first:")
        print("  cd Backend")
        print("  uvicorn app.main:app --reload")
        exit(1)
    
    print("✓ Server is running\n")
    
    success = test_complete_workflow()
    exit(0 if success else 1)
