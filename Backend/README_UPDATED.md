# Product Search API - Backend

## 🚀 New Feature: DuckDuckGo-Based Product Scraping

This backend now supports **two scraping methods**:

1. **Scrapy-based scraping** (Original) - Advanced scraping with browser automation
2. **DuckDuckGo-based scraping** (New) - Simple, fast searching across multiple e-commerce sites

## 📋 API Endpoints

### Original Scrapy-Based Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scrape` | POST | Scrape products using Scrapy |
| `/variants_list` | POST | Generate product variants using LLM and save to list.txt |
| `/scrape_variants` | POST | Generate variants and scrape with Scrapy |
| `/scrape_from_list` | POST | Read list.txt and scrape with Scrapy |

### New DuckDuckGo-Based Endpoints ⭐

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/scrape_variants_ddg` | POST | Generate variants and scrape using DuckDuckGo |
| `/scrape_from_list_ddg` | POST | Read list.txt and scrape using DuckDuckGo |

## 🎯 Quick Start

### 1. Install Dependencies
```bash
cd Backend
pip install -r req.txt
```

### 2. Set Up Environment
Create a `.env` file in the `Backend` directory:
```
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the Server
```bash
uvicorn app.main:app --reload
```

### 4. Test DuckDuckGo Scraping
```bash
python app/test_ddg.py
```

## 📖 Usage Examples

### Example 1: Quick Product Search with DuckDuckGo

```bash
curl -X POST http://localhost:8000/scrape_variants_ddg \
  -H "Content-Type: application/json" \
  -d '{
    "product": "wireless earbuds",
    "max_variants": 3,
    "max_items_per_site": 2,
    "sites": ["amazon", "flipkart"]
  }'
```

**What happens:**
1. LLM generates 3 product variants (e.g., "Sony WF-1000XM5", "AirPods Pro", "OnePlus Buds Pro 2")
2. DuckDuckGo searches each variant on Amazon and Flipkart
3. Scrapes up to 2 products per site per variant
4. Returns aggregated results with price/rating insights
5. Saves to `Backend/app/result.json`

### Example 2: Two-Step Process

**Step 1: Generate variants**
```bash
curl -X POST http://localhost:8000/variants_list \
  -H "Content-Type: application/json" \
  -d '{
    "product": "laptop",
    "max_variants": 5
  }'
```

**Step 2: Scrape from list**
```bash
curl -X POST http://localhost:8000/scrape_from_list_ddg \
  -H "Content-Type: application/json" \
  -d '{
    "max_items_per_site": 3,
    "sites": ["amazon", "flipkart", "croma"],
    "top_n": 5
  }'
```

### Example 3: Search Multiple E-commerce Sites

```bash
curl -X POST http://localhost:8000/scrape_variants_ddg \
  -H "Content-Type: application/json" \
  -d '{
    "product": "smartwatch",
    "max_variants": 4,
    "max_items_per_site": 2,
    "sites": ["amazon", "flipkart", "myntra", "croma", "reliance"]
  }'
```

## 🏪 Supported E-commerce Sites

### DuckDuckGo Method
- **amazon** - Amazon India
- **flipkart** - Flipkart
- **myntra** - Myntra (Fashion)
- **ajio** - AJIO (Fashion)
- **snapdeal** - Snapdeal
- **croma** - Croma (Electronics)
- **reliance** - Reliance Digital
- **tatacliq** - Tata CLiQ
- **shopclues** - ShopClues
- **paytmmall** - Paytm Mall

### Scrapy Method
- **amazon** - Amazon India (requires browser automation)
- **flipkart** - Flipkart (requires browser automation)

## 🔄 Workflow Comparison

### DuckDuckGo Method (Recommended for Quick Searches)
```
User Query → LLM (Generate Variants) → DuckDuckGo Search → 
HTTP Scraping → Extract Product Data → Return Results
```
**Pros:**
- ✅ Fast and simple
- ✅ Multiple sites support
- ✅ Low resource usage
- ✅ Easy to add new sites

**Cons:**
- ❌ May miss some products
- ❌ Limited to search results
- ❌ Rate limiting possible

### Scrapy Method (For Comprehensive Scraping)
```
User Query → LLM (Generate Variants) → Scrapy Spider → 
Browser Automation → Deep Scraping → Return Results
```
**Pros:**
- ✅ Comprehensive results
- ✅ JavaScript support
- ✅ Better parsing

**Cons:**
- ❌ Slower
- ❌ Higher resource usage
- ❌ Fewer sites supported

## 📊 Response Format

All endpoints return JSON with this structure:

```json
{
  "query": "smartphone",
  "variants": ["smartphone", "iPhone 15", "Samsung Galaxy S24"],
  "total_items": 12,
  "insights": {
    "overall": {
      "avg_price": 45000.50,
      "avg_rating": 4.5,
      "count": 12
    },
    "per_variant": [
      {
        "variant": "iPhone 15",
        "count": 4,
        "avg_price": 79900.00,
        "avg_rating": 4.7
      }
    ]
  },
  "items": [
    {
      "url": "https://...",
      "source": "amazon",
      "title": "iPhone 15 Pro (128GB)",
      "price": "₹1,34,900",
      "rating": 4.6,
      "image": "https://...",
      "variant": "iPhone 15"
    }
  ],
  "file": "path/to/result.json"
}
```

## 🛠️ Configuration

### Adjust Scraping Parameters

Edit `app/duckduckgo_scraper.py`:

```python
# Change default timeout
scraper = DuckDuckGoScraper(timeout=15, delay=0.5)

# Modify delay between requests (in seconds)
# Increase to avoid rate limiting
self.delay = 1.0  # Default: 0.5
```

### Add New E-commerce Sites

In `app/duckduckgo_scraper.py`, add to `ECOMMERCE_SITES`:

```python
ECOMMERCE_SITES = {
    "amazon": "amazon.in",
    "flipkart": "flipkart.com",
    "mynewsite": "mynewsite.com",  # Add here
}
```

Then implement the extraction method:

```python
def extract_mynewsite_product(self, url: str) -> Optional[Dict[str, Any]]:
    # Custom extraction logic
    pass
```

## 📁 Project Structure

```
Backend/
├── app/
│   ├── __init__.py
│   ├── main.py                    # Main FastAPI application
│   ├── llm.py                     # LLM integration (Gemini)
│   ├── duckduckgo_scraper.py     # DuckDuckGo scraping ⭐ NEW
│   ├── ddg_routes.py             # DuckDuckGo endpoints ⭐ NEW
│   ├── test_ddg.py               # Test script ⭐ NEW
│   ├── scrape_runner.py          # Scrapy runner
│   ├── list.txt                  # Generated variants
│   ├── result.json               # Scraping results
│   └── scraper/                  # Scrapy project
│       ├── spiders/
│       │   ├── amazon.py
│       │   └── flipkart.py
│       ├── items.py
│       └── settings.py
├── req.txt                        # Dependencies
├── README.md                      # This file
├── DUCKDUCKGO_USAGE.md           # Detailed DDG guide ⭐ NEW
└── .env                          # Environment variables
```

## 🔧 Troubleshooting

### No Results from DuckDuckGo?
- Verify internet connection
- Try different search terms
- Check if sites are accessible
- Increase `delay` to avoid rate limiting

### Import Errors?
```bash
# Reinstall dependencies
pip install -r req.txt
```

### LLM Not Working?
- Check GEMINI_API_KEY in .env
- Verify API key is valid
- Check API quota

## 📚 Additional Resources

- [DUCKDUCKGO_USAGE.md](./DUCKDUCKGO_USAGE.md) - Detailed DuckDuckGo usage guide
- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [BeautifulSoup Docs](https://www.crummy.com/software/BeautifulSoup/bs4/doc/)

## 🤝 Contributing

To add support for a new e-commerce site:

1. Add site domain to `ECOMMERCE_SITES` in `duckduckgo_scraper.py`
2. Implement extraction method (follow existing patterns)
3. Test with `test_ddg.py`
4. Update documentation

## 📄 License

This project is part of TEMPORAL FORGE AI SPRINT.
