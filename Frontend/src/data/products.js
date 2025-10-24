const products = [
  // 📱 Phones
  {
    id: "1",
    title: "Samsung S25 Ultra",
    brand: "Samsung",
    launchYear: 2025,
    averagePrice: 119999,
    priceChange: -2.5,
    activeSellers: 68,
    sellerChange: 12,
    harmonyScore: 74,
    harmonyChange: -3.2,
    category: "Phones",
    variant: "512GB",
    alerts: [
      {
        type: "Market Dip",
        title: "Slight Price Drop",
        description:
          "Overall prices dropped 2.5% as new stock arrived in retail stores."
      }
    ],
    charts: {
      harmonyTrend: [76, 75, 74, 73, 75, 74, 74],
      regionalPrices: {
        Mumbai: 121499,
        Delhi: 118999,
        Bangalore: 120499,
        Hyderabad: 119999
      }
    },
    aiInsights: [
      {
        type: "Recommendation",
        message:
          "With rising seller competition, consider buying this week for the best price."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1738830234395-a351829a1c7b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Ftc3VuZyUyMFMyNSUyMFVsdHJhfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
  },
  {
    id: "2",
    title: "iPhone 16 Pro",
    brand: "Apple",
    launchYear: 2025,
    averagePrice: 139999,
    priceChange: 1.2,
    activeSellers: 72,
    sellerChange: 5,
    harmonyScore: 81,
    harmonyChange: 2.4,
    category: "Phones",
    variant: "256GB",
    alerts: [
      {
        type: "Stable Market",
        title: "Balanced Pricing",
        description:
          "Prices remain stable due to consistent supply from authorized retailers."
      }
    ],
    charts: {
      harmonyTrend: [80, 79, 81, 82, 81, 81, 82],
      regionalPrices: {
        Mumbai: 141499,
        Delhi: 138499,
        Bangalore: 139999,
        Hyderabad: 140499
      }
    },
    aiInsights: [
      {
        type: "Market Observation",
        message:
          "Steady sales volume, suggesting market maturity and pricing stability."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1695822822491-d92cee704368?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aVBob25lJTIwMTUlMjBQcm8lMjBNYXh8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
  },
  {
    id: "3",
    title: "Google Pixel 9 Pro",
    brand: "Google",
    launchYear: 2025,
    averagePrice: 109999,
    priceChange: 0.8,
    activeSellers: 55,
    sellerChange: 3,
    harmonyScore: 78,
    harmonyChange: 1.5,
    category: "Phones",
    variant: "256GB",
    alerts: [
      {
        type: "Positive Trend",
        title: "Healthy Market Balance",
        description:
          "Increased competition among sellers keeping Pixel prices stable."
      }
    ],
    charts: {
      harmonyTrend: [75, 76, 77, 78, 79, 78, 78],
      regionalPrices: {
        Mumbai: 110499,
        Delhi: 108999,
        Bangalore: 109499,
        Hyderabad: 110999
      }
    },
    aiInsights: [
      {
        type: "Recommendation",
        message:
          "Pixel 9 Pro prices are expected to remain steady for the next quarter."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1724322637761-1fef6ca8c8b3?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R29vZ2xlJTIwUGl4ZWwlMjA5JTIwUHJvfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
  },
  {
    id: "4",
    title: "OnePlus 13 Pro",
    brand: "OnePlus",
    launchYear: 2025,
    averagePrice: 89999,
    priceChange: -1.3,
    activeSellers: 60,
    sellerChange: 10,
    harmonyScore: 83,
    harmonyChange: 2.8,
    category: "Phones",
    variant: "512GB",
    alerts: [
      {
        type: "Healthy Market",
        title: "High Harmony Detected",
        description:
          "Balanced pricing and increased seller activity indicate a stable market."
      }
    ],
    charts: {
      harmonyTrend: [80, 81, 82, 83, 84, 83, 83],
      regionalPrices: {
        Mumbai: 90999,
        Delhi: 88999,
        Bangalore: 89999,
        Hyderabad: 89599
      }
    },
    aiInsights: [
      {
        type: "Market Stability",
        message:
          "OnePlus maintains competitive pricing, enhancing overall harmony."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1658851362428-e136c3efad4b?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8T25lUGx1cyUyMDEzJTIwUHJvJTIwcGhvbmV8ZW58MHx8MHx8fDA%3D&auto=format&fit=crop&q=60&w=600"
  },

  // 💻 Laptops
  {
    id: "5",
    title: "MacBook Pro M3",
    brand: "Apple",
    launchYear: 2024,
    averagePrice: 219999,
    priceChange: -1.8,
    activeSellers: 42,
    sellerChange: 8,
    harmonyScore: 80,
    harmonyChange: 1.2,
    category: "Laptops",
    variant: "16-inch, 1TB",
    alerts: [
      {
        type: "Low Supply",
        title: "Limited Availability",
        description:
          "High demand for M3 chips; stock running low in all regions."
      }
    ],
    charts: {
      harmonyTrend: [82, 81, 79, 80, 81, 80, 80],
      regionalPrices: {
        Mumbai: 222999,
        Delhi: 224999,
        Bangalore: 219499,
        Hyderabad: 223499
      }
    },
    aiInsights: [
      {
        type: "Market Movement",
        message: "Seller competition up 15%, stabilizing overall prices."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "6",
    title: "Dell XPS 16",
    brand: "Dell",
    launchYear: 2024,
    averagePrice: 179999,
    priceChange: 2.5,
    activeSellers: 34,
    sellerChange: -4,
    harmonyScore: 72,
    harmonyChange: -1.8,
    category: "Laptops",
    variant: "512GB, RTX 4070",
    alerts: [
      {
        type: "Price Surge",
        title: "Retail Price Hike",
        description:
          "Retailers increased prices by 10% following stock shortages."
      }
    ],
    charts: {
      harmonyTrend: [75, 74, 73, 72, 70, 72, 72],
      regionalPrices: {
        Mumbai: 181499,
        Delhi: 182999,
        Bangalore: 178499,
        Hyderabad: 180999
      }
    },
    aiInsights: [
      {
        type: "Recommendation",
        message:
          "Expected restock next week; avoid current inflated prices."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1713470812508-c276021f1b93?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8RGVsbCUyMFhQUyUyMDE2JTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
  },
  {
    id: "7",
    title: "HP Spectre x360",
    brand: "HP",
    launchYear: 2024,
    averagePrice: 154999,
    priceChange: -0.9,
    activeSellers: 50,
    sellerChange: 6,
    harmonyScore: 85,
    harmonyChange: 3.1,
    category: "Laptops",
    variant: "16GB RAM, 1TB SSD",
    alerts: [
      {
        type: "Stable Demand",
        title: "Market Harmony Rising",
        description:
          "Strong competition among sellers ensuring fair pricing trends."
      }
    ],
    charts: {
      harmonyTrend: [82, 83, 84, 85, 86, 85, 85],
      regionalPrices: {
        Mumbai: 156499,
        Delhi: 153999,
        Bangalore: 154499,
        Hyderabad: 155499
      }
    },
    aiInsights: [
      {
        type: "Insight",
        message:
          "HP's premium ultrabook series continues to drive a well-balanced market."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "8",
    title: "Asus ROG Zephyrus G16",
    brand: "Asus",
    launchYear: 2024,
    averagePrice: 169999,
    priceChange: 3.2,
    activeSellers: 27,
    sellerChange: -3,
    harmonyScore: 69,
    harmonyChange: -2.5,
    category: "Laptops",
    variant: "RTX 4060, 16GB RAM",
    alerts: [
      {
        type: "Price Alert",
        title: "Gaming Laptop Surge",
        description:
          "Gaming demand caused a short-term spike in ROG laptop prices."
      }
    ],
    charts: {
      harmonyTrend: [71, 70, 69, 68, 69, 70, 69],
      regionalPrices: {
        Mumbai: 171499,
        Delhi: 170499,
        Bangalore: 169999,
        Hyderabad: 170999
      }
    },
    aiInsights: [
      {
        type: "Recommendation",
        message:
          "Expect gaming laptop prices to normalize after new GPU stock release."
      }
    ],
    image:
      "https://plus.unsplash.com/premium_photo-1754404025529-8961df8c7380?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8QXN1cyUyMFJPRyUyMFplcGh5cnVzJTIwRzE2JTIwbGFwdG9wfGVufDB8fDB8fHww&auto=format&fit=crop&q=60&w=600"
  },

  // 🏠 Housing
  {
    id: "9",
    title: "Luxury Beachfront Villa, North Goa",
    brand: "Goa Realty Group",
    launchYear: 2019,
    averagePrice: 32000000,
    priceChange: 4.5,
    activeSellers: 5,
    sellerChange: 1,
    harmonyScore: 61,
    harmonyChange: -3.5,
    category: "Housing",
    variant: "4BHK Beach Villa",
    alerts: [
      {
        type: "Price Spike",
        title: "Luxury Market Surge",
        description: "Premium villa prices up 8% in coastal areas."
      }
    ],
    charts: {
      harmonyTrend: [68, 66, 63, 62, 61, 60, 61],
      regionalPrices: {
        Anjuna: 31000000,
        Vagator: 32500000,
        Calangute: 31800000
      }
    },
    aiInsights: [
      {
        type: "Recommendation",
        message:
          "High-end buyers dominating the market; best to invest soon before Q4 price rise."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "10",
    title: "Sea View Apartment, South Goa",
    brand: "BlueWave Developers",
    launchYear: 2021,
    averagePrice: 14500000,
    priceChange: 1.8,
    activeSellers: 9,
    sellerChange: 2,
    harmonyScore: 67,
    harmonyChange: 2.1,
    category: "Housing",
    variant: "3BHK Sea View Apartment",
    alerts: [
      {
        type: "Stable Market",
        title: "Balanced Pricing",
        description:
          "Consistent price range across South Goa coastal zones."
      }
    ],
    charts: {
      harmonyTrend: [65, 65, 66, 67, 68, 67, 67],
      regionalPrices: {
        Colva: 14200000,
        Benaulim: 14500000,
        Cavelossim: 14750000
      }
    },
    aiInsights: [
      {
        type: "Market Movement",
        message:
          "Steady demand from NRI buyers; moderate appreciation likely."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=800&q=60"
  },
  {
    id: "11",
    title: "Penthouse, Bandra West Mumbai",
    brand: "UrbanEdge Realty",
    launchYear: 2020,
    averagePrice: 78000000,
    priceChange: 5.2,
    activeSellers: 3,
    sellerChange: 0,
    harmonyScore: 58,
    harmonyChange: -2.8,
    category: "Housing",
    variant: "5BHK Sky Penthouse",
    alerts: [
      {
        type: "Price Hike",
        title: "Luxury Urban Surge",
        description:
          "Mumbai’s luxury penthouse market saw 5% growth driven by premium buyers."
      }
    ],
    charts: {
      harmonyTrend: [60, 59, 58, 57, 58, 58, 58],
      regionalPrices: {
        Bandra: 78000000,
        Worli: 81000000,
        LowerParel: 77000000
      }
    },
    aiInsights: [
      {
        type: "Insight",
        message:
          "High-end urban buyers pushing up prices; rental yields remain consistent."
      }
    ],
    image:
      "https://www.guptasen.com/wp-content/uploads/2021/02/duplex-penthouse-furnished-bandra-west.jpg"
  },
  {
    id: "12",
    title: "Lakeview Apartment, Pune",
    brand: "SereneBuilders",
    launchYear: 2022,
    averagePrice: 9500000,
    priceChange: -1.2,
    activeSellers: 11,
    sellerChange: 3,
    harmonyScore: 73,
    harmonyChange: 2.6,
    category: "Housing",
    variant: "2BHK Premium Lakeview",
    alerts: [
      {
        type: "Positive Market",
        title: "Growing Stability",
        description:
          "Developers offering competitive pricing boosting housing harmony."
      }
    ],
    charts: {
      harmonyTrend: [71, 72, 73, 74, 74, 73, 73],
      regionalPrices: {
        Kothrud: 9400000,
        Hinjewadi: 9600000,
        Baner: 9500000
      }
    },
    aiInsights: [
      {
        type: "Recommendation",
        message:
          "A balanced housing market in Pune offers good investment potential."
      }
    ],
    image:
      "https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?auto=format&fit=crop&w=800&q=60"
  }
];

export default products;
