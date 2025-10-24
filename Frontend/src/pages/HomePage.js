import React from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import ProductCard from "../components/ProductCard";
import products from "../data/products";
import { motion } from 'framer-motion';
import { convertUSDToINR } from '../utils/currency';

export default function HomePage() {
  const location = useLocation();
  const selectedCategory = location.state?.category || "phone";

  // Normalize category for matching
  const categoryMap = {
    phone: "Phones",
    laptop: "Laptops",
    housing: "Housing"
  };
  const filterCategory = categoryMap[selectedCategory.toLowerCase()] || "Phones";
  const filteredProducts = products.filter(p => p.category === filterCategory);

  return (
    <div className="mp-app">
      <Header />
      <motion.main className="mp-main" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <section className="overview">
          <h2>Market Overview</h2>
          <p className="sub">
            Real-time {filterCategory} market insights and pricing harmony metrics
          </p>
          <div className="stats-grid">
            <StatCard title="Average Price" value={convertUSDToINR(947)} change="+8.3%" hint="Price trend" />
            <StatCard title="Number of Sellers" value="2,347" change="-12.4%" hint="Seller count trend" />
            <StatCard title="Harmony Score" value="64" hint="Moderate Balance" accent="highlight" />
          </div>
        </section>

        <section className="alerts">
          <h3>{filterCategory} Pricing Alerts</h3>
          <p className="sub">
            {filterCategory} models requiring immediate attention • {filteredProducts.length} active alerts
          </p>
          <div className="products-grid">
            {filteredProducts.map((p) => (
              <ProductCard key={p.id} item={p} />
            ))}
          </div>
        </section>
      </motion.main>
    </div>
  );
}