import React, { useState } from 'react';
import { X, Users, PackageCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const marketplaces = [
  { label: 'Amazon', value: 'amazon' },
  { label: 'Flipkart', value: 'flipkart' },
  { label: 'eBay', value: 'ebay' },
  { label: 'Reliance Digital', value: 'reliance' },
  { label: 'Croma', value: 'croma' },
];

const priceTrends = [
  { day: 'Day 1', amazon: 1340, flipkart: 1299 },
  { day: 'Day 2', amazon: 1342, flipkart: 1299 },
  { day: 'Day 3', amazon: 1345, flipkart: 1300 },
  { day: 'Day 4', amazon: 1350, flipkart: 1302 },
  { day: 'Day 5', amazon: 1352, flipkart: 1305 },
  { day: 'Day 6', amazon: 1350, flipkart: 1300 },
  { day: 'Day 7', amazon: 1349, flipkart: 1299 },
];

const stats = {
  amazon: {
    price: 1349,
    priceChange: 5,
    sellers: 45,
    stock: 'In Stock',
    harmony: 68,
  },
  flipkart: {
    price: 1299,
    priceChange: -2,
    sellers: 52,
    stock: 'In Stock',
    harmony: 76,
  },
};

export default function CompareModal({ open, onClose }) {
  const [market1, setMarket1] = useState('amazon');
  const [market2, setMarket2] = useState('flipkart');

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-2 md:mx-4 bg-dark-card rounded-2xl shadow-2xl border border-cyan-400/20 p-4 md:p-8 animate-fade-in max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-neon-cyan transition"><X size={28} /></button>
        <h2 className="text-2xl md:text-3xl font-bold text-neon-cyan flex items-center gap-3 mb-2">
          <span className="inline-block"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 20v-6m0 0V4m0 10H6m6 0h6" stroke="#00FFF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          Compare Prices Across Sites
        </h2>
        <p className="text-gray-400 mb-6">Select two marketplaces to see real-time pricing and stock comparison.</p>
        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Marketplace 1</label>
            <select value={market1} onChange={e => setMarket1(e.target.value)} className="w-full bg-dark-surface border-2 border-neon-cyan/70 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan">
              {marketplaces.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Marketplace 2</label>
            <select value={market2} onChange={e => setMarket2(e.target.value)} className="w-full bg-dark-surface border-2 border-neon-cyan/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan">
              {marketplaces.map(m => <option key={m.value} value={m.value} disabled={m.value===market1}>{m.label}</option>)}
            </select>
          </div>
        </div>
        <div className="bg-gradient-to-r from-neon-cyan/10 to-dark-card/80 rounded-lg px-6 py-3 mb-6 text-neon-cyan font-medium shadow-inner">
          <span className="font-bold">AI Insight:</span> Amazon price is 3.8% higher than Flipkart average. Flipkart shows better market stability.
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Amazon Card */}
          <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border border-cyan-400/10">
            <h3 className="text-xl font-bold text-neon-cyan mb-4">Amazon</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Average Price</span>
              <span className="text-2xl font-bold text-white">${stats.amazon.price}</span>
              <span className={"ml-2 flex items-center " + (stats.amazon.priceChange > 0 ? 'text-green-400' : 'text-red-400')}>
                {stats.amazon.priceChange > 0 ? <TrendingUp size={18}/> : <TrendingDown size={18}/>} {Math.abs(stats.amazon.priceChange)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Active Sellers</span>
              <span className="flex items-center gap-1 text-white font-bold"><Users size={18}/> {stats.amazon.sellers}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Stock Status</span>
              <span className="flex items-center gap-1 text-green-400 font-bold"><PackageCheck size={18}/> In Stock</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Harmony Score</span>
              <span className="text-neon-cyan font-bold text-xl">{stats.amazon.harmony}</span>
            </div>
          </div>
          {/* Flipkart Card */}
          <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border border-cyan-400/10">
            <h3 className="text-xl font-bold text-neon-cyan mb-4">Flipkart</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Average Price</span>
              <span className="text-2xl font-bold text-white">${stats.flipkart.price}</span>
              <span className={"ml-2 flex items-center " + (stats.flipkart.priceChange > 0 ? 'text-green-400' : 'text-red-400')}>
                {stats.flipkart.priceChange > 0 ? <TrendingUp size={18}/> : <TrendingDown size={18}/>} {Math.abs(stats.flipkart.priceChange)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Active Sellers</span>
              <span className="flex items-center gap-1 text-white font-bold"><Users size={18}/> {stats.flipkart.sellers}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Stock Status</span>
              <span className="flex items-center gap-1 text-green-400 font-bold"><PackageCheck size={18}/> In Stock</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Harmony Score</span>
              <span className="text-neon-cyan font-bold text-xl">{stats.flipkart.harmony}</span>
            </div>
          </div>
        </div>
        <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border border-cyan-400/10">
          <h3 className="text-lg font-bold text-neon-cyan mb-4">Price Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={priceTrends}>
              <XAxis dataKey="day" stroke="#00FFF5" tick={{ fill: '#00FFF5' }} />
              <YAxis stroke="#666" tick={{ fill: '#A0A0B0' }} />
              <Tooltip contentStyle={{ background: '#18181C', border: 'none', color: '#00FFF5' }} labelStyle={{ color: '#00FFF5' }} />
              <Line type="monotone" dataKey="amazon" stroke="#00FFF5" strokeWidth={2} dot={{ fill: '#00FFF5' }} />
              <Line type="monotone" dataKey="flipkart" stroke="#0FF0FF" strokeWidth={2} dot={{ fill: '#0FF0FF' }} />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-2 text-neon-cyan font-bold">
            <span>Amazon</span>
            <span>Flipkart</span>
          </div>
        </div>
      </div>
    </div>
  );
}
