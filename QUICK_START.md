# 🚀 Quick Start Guide

## Get Started in 3 Steps

### 1️⃣ Setup Backend (2 minutes)

```bash
# Navigate to Backend folder
cd Backend

# Install dependencies
pip install -r req.txt

# Create .env file and add your Gemini API key
echo GEMINI_API_KEY=your_api_key_here > .env

# Start the server
uvicorn app.main:app --reload
```

✅ Backend running at: http://localhost:8000

---

### 2️⃣ Setup Frontend (1 minute)

```bash
# Open new terminal
# Navigate to Frontend folder
cd Frontend

# Install dependencies (if not already done)
npm install

# Start the development server
npm start
```

✅ Frontend running at: http://localhost:3000

---

### 3️⃣ Start Scraping! (30 seconds)

1. **Open your browser**: http://localhost:3000
2. **Select method**: Choose "🦆 DuckDuckGo" (recommended)
3. **Enter product**: Type "smartphone" or "laptop"
4. **Select sites**: Check Amazon and Flipkart
5. **Click**: "🚀 Scrape Products"
6. **Wait**: Results appear in 10-30 seconds!

---

## 🎯 Example Searches

### Quick Search
```
Product: wireless earbuds
Method: DuckDuckGo
Sites: Amazon, Flipkart
Max Variants: 3
Items per site: 2
```

### Comprehensive Search
```
Product: laptop
Method: DuckDuckGo
Sites: Amazon, Flipkart, Croma, Reliance
Max Variants: 5
Items per site: 3
```

### Fashion Search
```
Product: running shoes
Method: DuckDuckGo
Sites: Myntra, Ajio, Amazon, Flipkart
Max Variants: 4
Items per site: 2
```

---

## 🔧 Troubleshooting

### Server won't start?
```bash
# Check if port 8000 is in use
# Windows:
netstat -ano | findstr :8000

# Use different port:
uvicorn app.main:app --port 8001
```

### Frontend can't connect?
Update `Frontend/package.json`:
```json
"proxy": "http://localhost:8000"
```

### No results?
- Check internet connection
- Try fewer sites (2-3)
- Use specific product names
- Check backend logs

### LLM errors?
- Verify GEMINI_API_KEY in `.env`
- Check API quota at Google AI Studio
- Try with fewer variants

---

## 📊 What You Get

### Results Include:
✅ Product titles  
✅ Prices from multiple sites  
✅ Ratings and reviews  
✅ Direct links to products  
✅ Average price across sites  
✅ Average rating  
✅ Per-variant breakdown  

### Saved Files:
📄 `Backend/app/list.txt` - Generated variants  
📄 `Backend/app/result.json` - Complete results  

---

## 🎨 UI Features

### Controls
- **Method selector**: Choose DuckDuckGo or Scrapy
- **Product input**: Enter what you're looking for
- **Variants slider**: Adjust 1-10 variants
- **Items slider**: Set items per site (1-10)
- **Site checkboxes**: Select multiple sites

### Results Display
- **Summary stats**: Count, avg price, avg rating
- **Data table**: All products in organized table
- **Method badge**: Shows which method was used
- **Export ready**: Results saved as JSON

---

## 💡 Pro Tips

1. **Start small**: Use 2-3 variants and 2 items for quick tests
2. **DuckDuckGo first**: Faster and supports more sites
3. **Specific searches**: "iPhone 15" works better than "phone"
4. **Multiple sites**: Compare prices across 3-4 sites
5. **Check results**: Review `result.json` for complete data

---

## 📱 Supported Sites

### DuckDuckGo Method (10 sites)
- ✅ Amazon India
- ✅ Flipkart
- ✅ Myntra
- ✅ Ajio
- ✅ Snapdeal
- ✅ Croma
- ✅ Reliance Digital
- ✅ Tata CLiQ
- ✅ ShopClues
- ✅ Paytm Mall

### Scrapy Method (2 sites)
- ✅ Amazon India
- ✅ Flipkart

---

## 🧪 Test It Out

### Test Backend Only
```bash
cd Backend
python app/test_ddg.py
```

### Test Full Integration
```bash
cd Backend
# Make sure server is running first
python test_integration.py
```

### Test API Directly
```bash
curl -X POST http://localhost:8000/scrape_variants_ddg \
  -H "Content-Type: application/json" \
  -d '{"product":"smartphone","max_variants":2,"max_items_per_site":1}'
```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| `IMPLEMENTATION_SUMMARY.md` | Complete overview |
| `Backend/DUCKDUCKGO_USAGE.md` | DuckDuckGo guide |
| `Backend/API_QUICK_REFERENCE.md` | API reference |
| `Backend/README_UPDATED.md` | Full backend docs |
| `Frontend/FRONTEND_UPDATES.md` | UI changes |

---

## 🎉 You're All Set!

Your AI-powered product scraping system is ready to use!

**Next Steps:**
1. Try different products
2. Experiment with various sites
3. Compare prices across platforms
4. Save your favorite searches
5. Explore the results in `result.json`

---

## 🆘 Need Help?

1. Check the docs listed above
2. Review error messages in browser console
3. Check backend terminal for logs
4. Visit http://localhost:8000/docs for API docs
5. Run test scripts to verify setup

---

**Happy Scraping! 🎊**
