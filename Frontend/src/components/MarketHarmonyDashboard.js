import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertTriangle, Users, Activity, AlertCircle, TrendingDown, TrendingUp, Brain } from 'lucide-react';
import CompareModal from './CompareModal';

const harmonyScoreData = [
  { day: 'Mon', score: 78 },
  { day: 'Tue', score: 75 },
  { day: 'Wed', score: 72 },
  { day: 'Thu', score: 70 },
  { day: 'Fri', score: 65 },
  { day: 'Sat', score: 62 },
  { day: 'Sun', score: 58 },
];

const regionalPriceData = [
  { city: 'Mumbai', price: 1299 },
  { city: 'Delhi', price: 1350 },
  { city: 'Bangalore', price: 1275 },
  { city: 'Hyderabad', price: 1399 },
  { city: 'Chennai', price: 1325 },
];

const MarketHarmonyDashboard = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="min-h-screen bg-dark-surface p-6">
      {/* Header Section */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-6">
          <img
            src="/images/s25.jpg"
            alt="Samsung S25 Ultra"
            className="w-24 h-24 object-cover rounded-lg shadow-lg"
          />
          <div>
            <h1 className="text-3xl font-bold text-white">
              Market Harmony – Samsung S25 Ultra
            </h1>
            <div className="flex gap-4 text-gray-400 mt-2">
              <span>Category: Smartphones</span>
              <span>Brand: Samsung</span>
              <span>Launch Year: 2025</span>
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
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-400">Average Price</h3>
            <TrendingDown className="text-red-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">$1,299</span>
            <span className="text-red-500 ml-2">↓2.5%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">512GB variant</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-400">Active Sellers</h3>
            <Users className="text-green-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">68</span>
            <span className="text-green-500 ml-2">↑12%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Last 24 hours</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <div className="flex justify-between items-start">
            <h3 className="text-lg text-gray-400">Harmony Score</h3>
            <Activity className="text-red-500" />
          </div>
          <div className="mt-2">
            <span className="text-3xl font-bold">74</span>
            <span className="text-red-500 ml-2">↓3.2%</span>
          </div>
          <p className="text-sm text-gray-500 mt-1">Market health index</p>
        </motion.div>
      </div>

      {/* Alerts Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">Greed & Scarcity Alerts</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-red-500" />
              <div>
                <h3 className="font-semibold text-white">High Price Surge – Samsung S25 Ultra</h3>
                <p className="text-gray-400 mt-1">
                  Price increased 35% in the last 48 hours; only 5 sellers remain.
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-red-500/20 text-red-500 rounded-full text-sm">
                  Price Spike
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="text-orange-500" />
              <div>
                <h3 className="font-semibold text-white">Market Manipulation Warning</h3>
                <p className="text-gray-400 mt-1">
                  2 sellers controlling 70% of 256GB models.
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-orange-500/20 text-orange-500 rounded-full text-sm">
                  High Greed
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <AlertTriangle className="text-yellow-500" />
              <div>
                <h3 className="font-semibold text-white">Limited Availability</h3>
                <p className="text-gray-400 mt-1">
                  Supply decreased by 60% in last 48h. Premium variants running low.
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-yellow-500/20 text-yellow-500 rounded-full text-sm">
                  Low Supply
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="text-purple-500" />
              <div>
                <h3 className="font-semibold text-white">Regional Price Disparity</h3>
                <p className="text-gray-400 mt-1">
                  Price difference up to 15% across major cities for identical models.
                </p>
                <span className="inline-block mt-2 px-3 py-1 bg-purple-500/20 text-purple-500 rounded-full text-sm">
                  Price Spike
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">Harmony Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={harmonyScoreData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="day" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }}
                labelStyle={{ color: '#666' }}
              />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#00fff5"
                strokeWidth={2}
                dot={{ fill: '#00fff5' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card p-6"
        >
          <h3 className="text-xl font-semibold mb-4 text-white">Regional Price Comparison</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={regionalPriceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis dataKey="city" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1E1E1E', border: 'none' }}
                labelStyle={{ color: '#666' }}
              />
              <Bar dataKey="price" fill="#00fff5" />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </section>

      {/* AI Insights Section */}
      <section className="mb-8">
        <h2 className="text-2xl font-bold mb-4 text-white">AI Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <Brain className="text-neon-cyan" />
              <div>
                <h3 className="font-semibold text-white">Price Imbalance Detected</h3>
                <p className="text-gray-400 mt-1">
                  2 sellers control 70% of Samsung S25 Ultra inventory.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <TrendingUp className="text-green-500" />
              <div>
                <h3 className="font-semibold text-white">Market Movement</h3>
                <p className="text-gray-400 mt-1">
                  Seller competition up 10% this week, stabilizing price trends.
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card p-6"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="text-yellow-500" />
              <div>
                <h3 className="font-semibold text-white">AI Recommendation</h3>
                <p className="text-gray-400 mt-1">
                  Monitor Amazon listings; supply signals indicate potential shortage in next 48h.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default MarketHarmonyDashboard;