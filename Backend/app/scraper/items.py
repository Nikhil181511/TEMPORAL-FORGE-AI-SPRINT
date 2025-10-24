import scrapy


class ProductItem(scrapy.Item):
    source = scrapy.Field()        # 'flipkart' or 'amazon'
    title = scrapy.Field()
    price = scrapy.Field()
    seller = scrapy.Field()
    availability = scrapy.Field()
    rating = scrapy.Field()
    review_count = scrapy.Field()
    timestamp = scrapy.Field()
    url = scrapy.Field()
