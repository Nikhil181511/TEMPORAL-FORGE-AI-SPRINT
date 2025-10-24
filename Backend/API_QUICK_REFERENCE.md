# API Quick Reference

## 🚀 Start Server
```bash
cd Backend
uvicorn app.main:app --reload
```
Server runs at: `http://localhost:8000`

## 📍 Endpoints Overview

### 🆕 DuckDuckGo Method (Recommended)

#### 1. One-Step: Generate Variants + Scrape
**POST** `/scrape_variants_ddg`

```json
{
  "product": "laptop",
  "max_variants": 5,
  "max_items_per_site": 3,
  "sites": ["amazon", "flipkart"]
}
```

#### 2. Two-Step Process

**Step A:** Generate variants  
**POST** `/variants_list`
```json
{
  "product": "laptop",
  "max_variants": 10
}
```

**Step B:** Scrape from saved list  
**POST** `/scrape_from_list_ddg`
```json
{
  "max_items_per_site": 3,
  "sites": ["amazon", "flipkart"],
  "top_n": 5
}
```

---

### 🔧 Original Scrapy Method

#### 1. Direct Scrape
**POST** `/scrape`
```json
{
  "product": "Phone",
  "sites": ["flipkart", "amazon"],
  "max_items": 10,
  "debug": false
}
```

#### 2. Scrape with Variants
**POST** `/scrape_variants`
```json
{
  "product": "Phone",
  "max_variants": 10,
  "max_items": 5,
  "sites": ["flipkart"],
  "debug": false
}
```

#### 3. Scrape from List
**POST** `/scrape_from_list`
```json
{
  "max_items": 5,
  "sites": ["flipkart", "amazon"],
  "debug": false,
  "top_n": 5,
  "render": true
}
```

---

## 🏪 Available Sites

### DuckDuckGo Method
`amazon`, `flipkart`, `myntra`, `ajio`, `snapdeal`, `croma`, `reliance`, `tatacliq`, `shopclues`, `paytmmall`

### Scrapy Method
`amazon`, `flipkart`

---

## 🧪 Testing

### Test DuckDuckGo Scraper
```bash
cd Backend
python app/test_ddg.py
```

### Integration Test (requires server running)
```bash
cd Backend
python test_integration.py
```

---

## 📤 Response Format

```json
{
  "query": "product_name",
  "variants": ["variant1", "variant2"],
  "total_items": 15,
  "insights": {
    "overall": {
      "avg_price": 45000.50,
      "avg_rating": 4.5,
      "count": 15
    },
    "per_variant": [...]
  },
  "items": [
    {
      "url": "https://...",
      "source": "amazon",
      "title": "Product Title",
      "price": "₹45,000",
      "rating": 4.5,
      "image": "https://...",
      "variant": "variant1"
    }
  ],
  "file": "/path/to/result.json"
}
```

---

## 📁 Output Files

- **`Backend/app/list.txt`** - Generated product variants
- **`Backend/app/result.json`** - Complete scraping results with insights

---

## ⚙️ Request Parameters

### Common Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `product` | string | required | Product to search |
| `max_variants` | int | 5-10 | Number of variants to generate |
| `max_items` | int | 5-10 | Max items per site (Scrapy) |
| `max_items_per_site` | int | 3 | Max items per site (DuckDuckGo) |
| `sites` | array | varies | E-commerce sites to search |
| `top_n` | int | 5 | Limit items per variant |
| `debug` | bool | false | Enable debug mode (Scrapy) |
| `render` | bool | true | Use browser automation (Scrapy) |

---

## 🔍 Usage Examples

### Python
```python
import requests

# DuckDuckGo search
response = requests.post(
    "http://localhost:8000/scrape_variants_ddg",
    json={
        "product": "smartphone",
        "max_variants": 3,
        "max_items_per_site": 2,
        "sites": ["amazon", "flipkart"]
    }
)

data = response.json()
print(f"Found {data['total_items']} products")
```

### cURL
```bash
curl -X POST http://localhost:8000/scrape_variants_ddg \
  -H "Content-Type: application/json" \
  -d '{"product":"smartphone","max_variants":3,"max_items_per_site":2}'
```

### JavaScript (Fetch)
```javascript
fetch('http://localhost:8000/scrape_variants_ddg', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: 'smartphone',
    max_variants: 3,
    max_items_per_site: 2,
    sites: ['amazon', 'flipkart']
  })
})
.then(res => res.json())
.then(data => console.log(`Found ${data.total_items} products`));
```

---

## 🆘 Troubleshooting

### Server won't start
```bash
# Check if port 8000 is in use
netstat -ano | findstr :8000

# Use different port
uvicorn app.main:app --port 8001
```

### No results
- Check internet connection
- Verify site accessibility
- Try different search terms
- Reduce `max_items_per_site`

### Import errors
```bash
pip install -r req.txt
```

### LLM errors
- Check `GEMINI_API_KEY` in `.env`
- Verify API quota
- Check API key validity

---

## 📚 Documentation

- **Detailed Guide:** [DUCKDUCKGO_USAGE.md](./DUCKDUCKGO_USAGE.md)
- **Full README:** [README_UPDATED.md](./README_UPDATED.md)
- **API Docs:** `http://localhost:8000/docs` (when server is running)

---

## 💡 Pro Tips

1. **Start simple**: Use `max_variants=3` and `max_items_per_site=2` for testing
2. **Rate limiting**: Increase delay in `duckduckgo_scraper.py` if needed
3. **Multiple sites**: Test with 2 sites first, then expand
4. **Cache results**: Use `result.json` to avoid repeated scraping
5. **API docs**: Visit `/docs` for interactive API documentation

---

## 🎯 Recommended Workflow

1. **Generate variants** → `/variants_list`
2. **Review list.txt** → Check generated variants
3. **Scrape products** → `/scrape_from_list_ddg`
4. **Review results** → Check `result.json`
5. **Iterate** → Adjust parameters and repeat
