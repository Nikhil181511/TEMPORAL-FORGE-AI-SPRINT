# FastAPI + Scrapy Backend

- `app/`: Main application code
  - `main.py`: FastAPI entrypoint (exposes `/` and `/scrape`)
  - `scrape_runner.py`: CLI invoked by the API to run Scrapy spiders
  - `scraper/`: Scrapy package (items, settings, spiders)
- `req.txt`: Python dependencies

## Setup (Windows)

1. Create a virtual environment and activate it

```
python -m venv venv
venv\Scripts\activate
```

2. Install dependencies

```
pip install -r req.txt
```

3. Run the API

```
uvicorn app.main:app --reload
```

## API

POST `/scrape`

Body:

```
{ "product": "Phone" }
```

Response:

```
{
  "query": "Phone",
  "count": 10,
  "items": [
    {"source":"flipkart","title":"...","price":"...","seller":null,"availability":null,"rating":4.3,"review_count":1234,"timestamp":"...","url":"..."},
    {"source":"amazon","title":"...", ...}
  ]
}
```

Notes:
- Scraping may violate site terms; use responsibly and prefer official APIs.
- Selectors can change over time; adjust spiders if needed.

### Variants expansion with Gemini

POST `/scrape_variants`

Body:

```
{ "product": "Phone", "max_variants": 10, "max_items": 5 }
```

Set your Gemini API key first:

Windows PowerShell (current session only):

```
$env:GEMINI_API_KEY="<your-key>"
```

Or persist for future sessions:

```
setx GEMINI_API_KEY "<your-key>"
```

This endpoint expands your product into variants using Gemini and scrapes each variant, returning combined items plus basic insights (average price/rating overall and per variant). If no API key is set, it gracefully falls back to scraping only the original product.
