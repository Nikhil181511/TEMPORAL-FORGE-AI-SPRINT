import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import products from '../data/products';
import phones from '../data/phones.json';
import laptops from '../data/laptops.json';
import houses from '../data/houses.json';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Users, Activity, AlertCircle, TrendingDown, TrendingUp, Brain } from 'lucide-react';
import CompareModal from './CompareModal';


export default function MarketHarmonyDashboard() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [summary, setSummary] = useState(null); // product summary from products.js (has image)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    try {
      // find product summary to know category and image
      const prodSummary = products.find((p) => String(p.id) === String(id));
      setSummary(prodSummary || null);

      if (!prodSummary) {
        setError('Product not found in catalog.');
        setLoading(false);
        return;
      }

      const category = prodSummary.category;
      let sourceArray = [];
      if (category === 'Phones') sourceArray = phones;
      else if (category === 'Laptops') sourceArray = laptops;
      else if (category === 'Housing') sourceArray = houses;
      else sourceArray = [];

      const detail = sourceArray.find((p) => String(p.id) === String(id));
      if (!detail) {
        setError('Detailed data not available for this product.');
        setLoading(false);
        return;
      }

      setData(detail);
    } catch (e) {
      console.error(e);
      setError('Error loading data for this product.');
    }

    setLoading(false);
  }, [id]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-neon-cyan text-xl font-bold">Loading market data...</div>;
  if (error) return <div className="flex items-center justify-center min-h-screen text-red-500 text-xl font-bold">{error}</div>;
  if (!data) return null;

  // Convert charts for recharts
  const harmonyTrend = (data.charts?.harmonyTrend || []).map((score, i) => ({ day: `Day ${i+1}`, score }));
  const regionalPrices = data.charts?.regionalPrices ? Object.entries(data.charts.regionalPrices).map(([city, price]) => ({ city, price })) : [];

  const imgSrc = summary?.image || '/images/s25.jpg';

  return (
    <div className="min-h-screen bg-dark-surface p-6">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img
            src={imgSrc}
            alt={data.name}
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Market Harmony – {data.name}
            </h1>
            <div className="flex gap-4 text-gray-400 mt-2">
              <span>Category: {data.category}</span>
              <span>Brand: {data.brand}</span>
              <span>Launch Year: {data.launchYear}</span>
            </div>
          </div>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="px-6 py-3 bg-neon-cyan text-dark-surface rounded-xl font-semibold hover:shadow-neon"
          onClick={() => setShowModal(true)}
        >
          Compare Prices
        </motion.button>
      </header>
      <CompareModal open={showModal} onClose={() => setShowModal(false)} />

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="card p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-400">Average Price</h3>
            {data.priceChange < 0 ? <TrendingDown className="text-red-500" /> : <TrendingUp className="text-green-500" />}
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{data.averagePrice.toLocaleString ? data.averagePrice.toLocaleString() : data.averagePrice}</span>
            <span className={data.priceChange < 0 ? 'text-red-500 ml-2' : 'text-green-500 ml-2'}>
              {data.priceChange < 0 ? `↓${Math.abs(data.priceChange)}%` : `↑${data.priceChange}%`}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">{data.variant} variant</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="card p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-400">Active Sellers</h3>
            <Users className="text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{data.activeSellers}</span>
            <span className="text-green-500 ml-2">↑{data.sellerChange}%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} className="card p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-400">Harmony Score</h3>
            <Activity className={data.harmonyChange < 0 ? 'text-red-500' : 'text-green-500'} />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">{data.harmonyScore}</span>
            <span className={data.harmonyChange < 0 ? 'text-red-500 ml-2' : 'text-green-500 ml-2'}>
              {data.harmonyChange < 0 ? `↓${Math.abs(data.harmonyChange)}%` : `↑${data.harmonyChange}%`}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Market health index</p>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Greed & Scarcity Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(data.alerts || []).map((alert, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="card p-6">
              <div className="flex items-start gap-4">
                {alert.type === 'Price Spike' && <AlertTriangle className="text-red-500" />}
                {alert.type === 'High Greed' && <AlertCircle className="text-orange-500" />}
                {alert.type === 'Scarcity' && <AlertTriangle className="text-yellow-500" />}
                {alert.type === 'Region' && <AlertCircle className="text-purple-500" />}
                <div>
                  <h3 className="font-semibold text-white">{alert.title}</h3>
                  <p className="text-gray-400 mt-1">{alert.description}</p>
                  <span className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                    alert.type === 'Price Spike' ? 'bg-red-500/20 text-red-500' :
                    alert.type === 'High Greed' ? 'bg-orange-500/20 text-orange-500' :
                    alert.type === 'Scarcity' ? 'bg-yellow-500/20 text-yellow-500' :
                    'bg-purple-500/20 text-purple-500'
                  }`}>
                    {alert.type}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div whileHover={{ scale: 1.02 }} className="card p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Harmony Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={harmonyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }} labelStyle={{ color: '#666' }} />
              <Line type="monotone" dataKey="score" stroke="#00fff5" strokeWidth={2} dot={{ fill: '#00fff5' }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
        <motion.div whileHover={{ scale: 1.02 }} className="card p-6">
          <h3 className="text-xl font-semibold mb-4 text-white">Regional Price Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalPrices}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="city" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }} labelStyle={{ color: '#666' }} />
              <Bar dataKey="price" fill="#00fff5" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* AI Insights Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(data.aiInsights || []).map((insight, i) => (
            <motion.div key={i} whileHover={{ scale: 1.02 }} className="card p-6">
              <div className="flex items-start gap-4">
                {insight.type === 'Imbalance' && <Brain className="text-neon-cyan" />}
                {insight.type === 'Recommendation' && <AlertCircle className="text-yellow-500" />}
                <div>
                  <h3 className="font-semibold text-white">{insight.type}</h3>
                  <p className="text-gray-400 mt-1">{insight.message}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}