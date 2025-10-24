"""
DuckDuckGo-based product search and scraping module.
Uses DuckDuckGo to find products across multiple e-commerce sites.
"""
import re
import json
import requests
from bs4 import BeautifulSoup
from typing import List, Dict, Any, Optional
from urllib.parse import quote_plus, urlparse
import time


class DuckDuckGoScraper:
    """Scrapes product information using DuckDuckGo search."""
    
    ECOMMERCE_SITES = {
        "amazon": "amazon.in",
        "flipkart": "flipkart.com",
        "myntra": "myntra.com",
        "ajio": "ajio.com",
        "snapdeal": "snapdeal.com",
        "shopclues": "shopclues.com",
        "paytmmall": "paytmmall.com",
        "croma": "croma.com",
        "reliance": "reliancedigital.in",
        "tatacliq": "tatacliq.com"
    }
    
    def __init__(self, timeout: int = 10, delay: float = 1.0):
        """
        Initialize the scraper.
        
        Args:
            timeout: Request timeout in seconds
            delay: Delay between requests to avoid rate limiting
        """
        self.timeout = timeout
        self.delay = delay
        self.session = requests.Session()
        self.session.headers.update({
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1'
        })
    
    def search_duckduckgo(self, query: str, site: Optional[str] = None) -> List[str]:
        """
        Search DuckDuckGo for product URLs.
        
        Args:
            query: Product search query
            site: Optional site to restrict search (e.g., 'amazon.in')
            
        Returns:
            List of URLs found
        """
        if site:
            search_query = f"{query} site:{site}"
        else:
            search_query = query
        
        encoded_query = quote_plus(search_query)
        
        try:
            time.sleep(self.delay)
            
            # Try regular DuckDuckGo first
            url = f"https://duckduckgo.com/html/?q={encoded_query}"
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.text, 'html.parser')
            urls = []
            
            # Try multiple selectors for DuckDuckGo results
            selectors = [
                'a.result__a',
                'a[class*="result"]',
                'h2.result__title a',
                '.result__body a',
                '.web-result a'
            ]
            
            for selector in selectors:
                results = soup.select(selector)
                for result in results:
                    href = result.get('href')
                    if href:
                        # DuckDuckGo wraps URLs, extract the actual URL
                        if 'uddg=' in href:
                            try:
                                actual_url = href.split('uddg=')[1].split('&')[0]
                                from urllib.parse import unquote
                                decoded_url = unquote(actual_url)
                                if decoded_url.startswith('http'):
                                    urls.append(decoded_url)
                            except:
                                pass
                        elif href.startswith('http'):
                            urls.append(href)
                
                if urls:
                    break
            
            # Remove duplicates while preserving order
            seen = set()
            unique_urls = []
            for url in urls:
                if url not in seen:
                    seen.add(url)
                    unique_urls.append(url)
            
            return unique_urls[:10]  # Return top 10 results
            
        except Exception as e:
            print(f"Error searching DuckDuckGo: {e}")
            return []
    
    def extract_amazon_product(self, url: str) -> Optional[Dict[str, Any]]:
        """Extract product details from Amazon URL."""
        try:
            time.sleep(self.delay)
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            product = {
                'url': url.split('?')[0],  # Clean URL
                'source': 'amazon',
                'title': None,
                'price': None,
                'rating': None,
                'image': None
            }
            
            # Extract title - try multiple selectors
            title_selectors = [
                ('span', {'id': 'productTitle'}),
                ('h1', {'id': 'title'}),
                ('h1', {'class': 'a-size-large'}),
            ]
            for tag, attrs in title_selectors:
                title_elem = soup.find(tag, attrs)
                if title_elem:
                    product['title'] = title_elem.get_text(strip=True)
                    break
            
            # Extract price - try multiple selectors
            price_selectors = [
                ('span', {'class': 'a-price-whole'}),
                ('span', {'class': 'a-offscreen'}),
                ('span', {'class': 'a-price'}),
                ('span', {'id': 'priceblock_ourprice'}),
                ('span', {'id': 'priceblock_dealprice'}),
            ]
            for tag, attrs in price_selectors:
                price_elem = soup.find(tag, attrs)
                if price_elem:
                    price_text = price_elem.get_text(strip=True)
                    if '₹' in price_text or price_text.replace('.', '').replace(',', '').isdigit():
                        product['price'] = price_text
                        break
            
            # Extract rating
            rating_elem = soup.find('span', class_='a-icon-alt') or \
                         soup.find('i', class_='a-icon-star')
            if rating_elem:
                rating_text = rating_elem.get_text(strip=True)
                rating_match = re.search(r'(\d+\.?\d*)', rating_text)
                if rating_match:
                    product['rating'] = float(rating_match.group(1))
            
            # Extract image
            img_selectors = [
                ('img', {'id': 'landingImage'}),
                ('img', {'class': 'a-dynamic-image'}),
                ('img', {'data-old-hires': True}),
            ]
            for tag, attrs in img_selectors:
                img_elem = soup.find(tag, attrs)
                if img_elem:
                    product['image'] = img_elem.get('src') or img_elem.get('data-old-hires')
                    if product['image']:
                        break
            
            return product if product['title'] else None
            
        except Exception as e:
            print(f"    ✗ Error extracting Amazon product: {e}")
            return None
    
    def extract_flipkart_product(self, url: str) -> Optional[Dict[str, Any]]:
        """Extract product details from Flipkart URL."""
        try:
            time.sleep(self.delay)
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            product = {
                'url': url.split('?')[0],  # Clean URL
                'source': 'flipkart',
                'title': None,
                'price': None,
                'rating': None,
                'image': None
            }
            
            # Extract title - try multiple selectors (Flipkart classes change frequently)
            title_selectors = [
                ('span', {'class': 'VU-ZEz'}),
                ('span', {'class': 'B_NuCI'}),
                ('h1', {'class': 'yhB1nd'}),
                ('span', {'class': 'G6XhRU'}),
            ]
            for tag, attrs in title_selectors:
                title_elem = soup.find(tag, attrs)
                if title_elem:
                    product['title'] = title_elem.get_text(strip=True)
                    break
            
            # If still no title, try any h1
            if not product['title']:
                h1 = soup.find('h1')
                if h1:
                    product['title'] = h1.get_text(strip=True)
            
            # Extract price - try multiple selectors
            price_selectors = [
                ('div', {'class': 'Nx9bqj'}),
                ('div', {'class': '_30jeq3'}),
                ('div', {'class': '_25b18c'}),
            ]
            for tag, attrs in price_selectors:
                price_elem = soup.find(tag, attrs)
                if price_elem:
                    price_text = price_elem.get_text(strip=True)
                    if '₹' in price_text:
                        product['price'] = price_text
                        break
            
            # Extract rating
            rating_selectors = [
                ('div', {'class': 'XQDdHH'}),
                ('div', {'class': '_3LWZlK'}),
                ('span', {'class': '_1lRcqv'}),
            ]
            for tag, attrs in rating_selectors:
                rating_elem = soup.find(tag, attrs)
                if rating_elem:
                    rating_text = rating_elem.get_text(strip=True)
                    rating_match = re.search(r'(\d+\.?\d*)', rating_text)
                    if rating_match:
                        product['rating'] = float(rating_match.group(1))
                        break
            
            # Extract image
            img_selectors = [
                ('img', {'class': '_53J4C-'}),
                ('img', {'class': '_396cs4'}),
                ('img', {'class': 'q6DClP'}),
            ]
            for tag, attrs in img_selectors:
                img_elem = soup.find(tag, attrs)
                if img_elem:
                    product['image'] = img_elem.get('src')
                    if product['image']:
                        break
            
            return product if product['title'] else None
            
        except Exception as e:
            print(f"    ✗ Error extracting Flipkart product: {e}")
            return None
    
    def extract_generic_product(self, url: str, source: str) -> Optional[Dict[str, Any]]:
        """Extract basic product details from any e-commerce URL."""
        try:
            time.sleep(self.delay)
            response = self.session.get(url, timeout=self.timeout)
            response.raise_for_status()
            soup = BeautifulSoup(response.text, 'html.parser')
            
            product = {
                'url': url,
                'source': source,
                'title': None,
                'price': None,
                'rating': None,
                'image': None
            }
            
            # Try to extract title from common locations
            title_elem = soup.find('h1') or soup.find('title')
            if title_elem:
                product['title'] = title_elem.get_text(strip=True)[:200]
            
            # Try to find price (look for currency symbols)
            price_pattern = re.compile(r'[₹$€£]\s*[\d,]+(?:\.\d{2})?')
            price_matches = soup.find_all(string=price_pattern)
            if price_matches:
                product['price'] = price_matches[0].strip()
            
            # Try to find first image
            img_elem = soup.find('img', src=True)
            if img_elem:
                product['image'] = img_elem.get('src')
            
            return product if product['title'] else None
            
        except Exception as e:
            print(f"Error extracting generic product from {url}: {e}")
            return None
    
    def direct_site_search(self, query: str, site_key: str) -> List[str]:
        """
        Directly construct search URLs for e-commerce sites (fallback method).
        
        Args:
            query: Product search query
            site_key: Site key (e.g., 'amazon', 'flipkart')
            
        Returns:
            List of product URLs
        """
        urls = []
        encoded_query = quote_plus(query)
        
        try:
            if site_key == 'amazon':
                search_url = f"https://www.amazon.in/s?k={encoded_query}"
                time.sleep(self.delay)
                response = self.session.get(search_url, timeout=self.timeout)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract product links
                for item in soup.select('div[data-component-type="s-search-result"]')[:10]:
                    link = item.select_one('h2 a')
                    if link and link.get('href'):
                        product_url = 'https://www.amazon.in' + link['href']
                        urls.append(product_url)
                        
            elif site_key == 'flipkart':
                search_url = f"https://www.flipkart.com/search?q={encoded_query}"
                time.sleep(self.delay)
                response = self.session.get(search_url, timeout=self.timeout)
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # Extract product links
                for link in soup.select('a[href*="/p/"]')[:10]:
                    href = link.get('href')
                    if href and '/p/' in href:
                        product_url = 'https://www.flipkart.com' + href if href.startswith('/') else href
                        if product_url not in urls:
                            urls.append(product_url)
                            
        except Exception as e:
            print(f"  Error in direct search for {site_key}: {e}")
        
        return urls
    
    def search_and_scrape(
        self, 
        query: str, 
        sites: Optional[List[str]] = None,
        max_items_per_site: int = 5
    ) -> List[Dict[str, Any]]:
        """
        Search for products using DuckDuckGo and scrape details.
        Falls back to direct site scraping if DuckDuckGo returns no results.
        
        Args:
            query: Product search query
            sites: List of site keys (e.g., ['amazon', 'flipkart'])
            max_items_per_site: Maximum items to scrape per site
            
        Returns:
            List of product dictionaries
        """
        if sites is None:
            sites = ['amazon', 'flipkart']
        
        all_products = []
        
        for site_key in sites:
            if site_key not in self.ECOMMERCE_SITES:
                continue
            
            site_domain = self.ECOMMERCE_SITES[site_key]
            print(f"Searching {site_key} for: {query}")
            
            # Try DuckDuckGo first
            urls = self.search_duckduckgo(query, site_domain)
            
            # If DuckDuckGo returns no results, try direct site search
            if not urls and site_key in ['amazon', 'flipkart']:
                print(f"  → Using direct site search (DuckDuckGo returned no results)")
                urls = self.direct_site_search(query, site_key)
            
            if not urls:
                print(f"  ✗ No URLs found for {site_key}")
                continue
            
            print(f"  → Found {len(urls)} URLs")
            
            # Scrape each URL
            count = 0
            for url in urls:
                if count >= max_items_per_site:
                    break
                
                # Verify URL is from the correct site
                if site_domain not in url:
                    continue
                
                product = None
                if site_key == 'amazon':
                    product = self.extract_amazon_product(url)
                elif site_key == 'flipkart':
                    product = self.extract_flipkart_product(url)
                else:
                    product = self.extract_generic_product(url, site_key)
                
                if product:
                    all_products.append(product)
                    count += 1
                    print(f"  ✓ Scraped: {product['title'][:50]}...")
        
        return all_products


def search_products_ddg(
    product_query: str,
    sites: Optional[List[str]] = None,
    max_items_per_site: int = 5
) -> List[Dict[str, Any]]:
    """
    Main function to search and scrape products using DuckDuckGo.
    
    Args:
        product_query: Product to search for
        sites: List of sites to search (e.g., ['amazon', 'flipkart'])
        max_items_per_site: Maximum items per site
        
    Returns:
        List of product dictionaries
    """
    scraper = DuckDuckGoScraper(timeout=15, delay=0.5)
    return scraper.search_and_scrape(product_query, sites, max_items_per_site)
