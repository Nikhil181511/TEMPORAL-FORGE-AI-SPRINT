def settings_dict(enable_playwright: bool = False):
    s = {
        "BOT_NAME": "scraper",
        # Consider setting to True and following site policies.
        "ROBOTSTXT_OBEY": False,
        # Slightly slower with jitter to reduce blocking
        "DOWNLOAD_DELAY": 2.0,
        "RANDOMIZE_DOWNLOAD_DELAY": True,
        "CONCURRENT_REQUESTS": 3,
        "DOWNLOAD_TIMEOUT": 60,
        "COOKIES_ENABLED": False,
        "HTTPPROXY_ENABLED": True,
        "DEFAULT_REQUEST_HEADERS": {
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Language": "en-US,en;q=0.9",
            "User-Agent": (
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                "AppleWebKit/537.36 (KHTML, like Gecko) "
                "Chrome/120.0.0.0 Safari/537.36"
            ),
        },
        "LOG_LEVEL": "INFO",
        "RETRY_ENABLED": True,
        "RETRY_TIMES": 4,
        "AUTOTHROTTLE_ENABLED": True,
        "AUTOTHROTTLE_START_DELAY": 1.5,
        "AUTOTHROTTLE_MAX_DELAY": 15.0,
    }

    if enable_playwright:
        # Use Playwright download handler
        s.update(
            {
                "TWISTED_REACTOR": "twisted.internet.asyncioreactor.AsyncioSelectorReactor",
                "DOWNLOAD_HANDLERS": {
                    "http": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
                    "https": "scrapy_playwright.handler.ScrapyPlaywrightDownloadHandler",
                },
                "PLAYWRIGHT_BROWSER_TYPE": "chromium",
                # Conservative concurrency when rendering
                "CONCURRENT_REQUESTS": 2,
                # Navigation/wait tuning
                "PLAYWRIGHT_DEFAULT_NAVIGATION_TIMEOUT": 60000,
                "PLAYWRIGHT_DEFAULT_NAVIGATION_WAIT": "networkidle",
                "PLAYWRIGHT_LAUNCH_OPTIONS": {
                    "headless": True,
                    "args": ["--disable-blink-features=AutomationControlled"],
                },
                # Spoof a realistic desktop UA at the browser context level too
                "PLAYWRIGHT_CONTEXTS": {
                    "default": {
                        "user_agent": (
                            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                            "AppleWebKit/537.36 (KHTML, like Gecko) "
                            "Chrome/120.0.0.0 Safari/537.36"
                        ),
                        "viewport": {"width": 1366, "height": 768},
                        "java_script_enabled": True,
                    }
                },
            }
        )

    return s
