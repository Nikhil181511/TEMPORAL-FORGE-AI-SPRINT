# DuckDuckGo Product Scraping - Usage Guide

## Overview
This update adds DuckDuckGo-based web scraping capabilities to search for products across multiple e-commerce sites after the LLM generates product variants.

## New Features

### 1. DuckDuckGo Search Integration
- Searches multiple e-commerce sites using DuckDuckGo
- Supports: Amazon, Flipkart, Myntra, Ajio, Snapdeal, Croma, Reliance Digital, Tata CLiQ, and more
- Simple HTTP-based scraping (no browser automation required)

### 2. New API Endpoints

#### `/scrape_variants_ddg` - Generate Variants & Scrape with DuckDuckGo
Generates product variants using LLM, then searches and scrapes using DuckDuckGo.

**Request Body:**
```json
{
  "product": "laptop",
  "max_variants": 5,
  "max_items_per_site": 3,
  "sites": ["amazon", "flipkart"]
}
```

**Response:**
```json
{
  "query": "laptop",
  "variants": ["laptop", "Dell XPS", "MacBook Air", "ThinkPad", "HP Pavilion"],
  "total_items": 15,
  "insights": {
    "overall": {
      "avg_price": 65000.50,
      "avg_rating": 4.3,
      "count": 15
    },
    "per_variant": [...]
  },
  "items": [...],
  "file": "path/to/result.json"
}
```

#### `/scrape_from_list_ddg` - Scrape from Existing list.txt
Reads variants from `Backend/app/list.txt` and scrapes using DuckDuckGo.

**Request Body:**
```json
{
  "max_items_per_site": 3,
  "sites": ["amazon", "flipkart", "myntra"],
  "top_n": 5
}
```

## Workflow

### Method 1: One-Step Process
1. Call `/scrape_variants_ddg` with your product query
2. Get results immediately with all variants scraped

### Method 2: Two-Step Process
1. Call `/variants_list` to generate and save variants to `list.txt`
2. Call `/scrape_from_list_ddg` to scrape those variants

## Installation

1. Install new dependencies:
```bash
pip install -r req.txt
```

The new packages added:
- `requests` - HTTP library
- `beautifulsoup4` - HTML parsing
- `lxml` - Fast XML/HTML parser

## Usage Examples

### Example 1: Quick Search for Smartphones
```bash
curl -X POST http://localhost:8000/scrape_variants_ddg \
  -H "Content-Type: application/json" \
  -d '{
    "product": "smartphone",
    "max_variants": 3,
    "max_items_per_site": 2,
    "sites": ["amazon", "flipkart"]
  }'
```

### Example 2: Search Multiple Sites
```bash
curl -X POST http://localhost:8000/scrape_variants_ddg \
  -H "Content-Type: application/json" \
  -d '{
    "product": "headphones",
    "max_variants": 5,
    "max_items_per_site": 3,
    "sites": ["amazon", "flipkart", "croma", "reliance"]
  }'
```

### Example 3: Use Existing Variants
```bash
# Step 1: Generate variants
curl -X POST http://localhost:8000/variants_list \
  -H "Content-Type: application/json" \
  -d '{
    "product": "laptop",
    "max_variants": 10
  }'

# Step 2: Scrape from list
curl -X POST http://localhost:8000/scrape_from_list_ddg \
  -H "Content-Type: application/json" \
  -d '{
    "max_items_per_site": 5,
    "sites": ["amazon", "flipkart"],
    "top_n": 3
  }'
```

## Supported E-commerce Sites

- **amazon** - Amazon India (amazon.in)
- **flipkart** - Flipkart
- **myntra** - Myntra (Fashion)
- **ajio** - AJIO (Fashion)
- **snapdeal** - Snapdeal
- **croma** - Croma (Electronics)
- **reliance** - Reliance Digital
- **tatacliq** - Tata CLiQ
- **shopclues** - ShopClues
- **paytmmall** - Paytm Mall

## Advantages of DuckDuckGo Method

1. **Simple** - No browser automation needed
2. **Fast** - HTTP requests only
3. **Reliable** - Works without JavaScript
4. **Multiple Sites** - Easy to add new e-commerce sites
5. **Low Resource** - Less CPU and memory usage

## Output Files

Results are saved to:
- **`Backend/app/result.json`** - Complete results with insights
- **`Backend/app/list.txt`** - Generated variants (when using `/variants_list`)

## Notes

- DuckDuckGo may rate-limit requests, so there's a built-in delay between requests
- Some sites may block scraping - the scraper handles errors gracefully
- Product extraction uses heuristics and may not work for all sites
- For best results, use specific product queries rather than generic terms

## Troubleshooting

**No results found?**
- Try different site combinations
- Use more specific product queries
- Check if the sites are accessible from your location

**Scraping errors?**
- Increase delay in `duckduckgo_scraper.py`
- Reduce `max_items_per_site`
- Try different sites

**Rate limiting?**
- Reduce number of variants
- Reduce items per site
- Add longer delays between requests
