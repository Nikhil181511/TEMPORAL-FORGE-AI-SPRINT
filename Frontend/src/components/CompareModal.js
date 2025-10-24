import React, { useState, useMemo } from 'react';
import { X, Users, PackageCheck, TrendingUp, TrendingDown } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { convertUSDToINR } from '../utils/currency';

// Marketplace sets per category
const ELECTRONICS_MARKETS = [
  { label: 'Amazon', value: 'amazon' },
  { label: 'Flipkart', value: 'flipkart' },
  { label: 'eBay', value: 'ebay' },
  { label: 'Reliance Digital', value: 'reliance' },
  { label: 'Croma', value: 'croma' },
];
const HOUSING_MARKETS = [
  { label: '99acres', value: '99acres' },
  { label: 'MagicBricks', value: 'magicbricks' },
  { label: 'Housing.com', value: 'housing' },
  { label: 'NoBroker', value: 'nobroker' },
  { label: 'CommonFloor', value: 'commonfloor' },
];

// Deterministic offset map for marketplaces to produce stable mock numbers
const MARKET_OFFSETS = {
  amazon: 0.03,
  flipkart: -0.02,
  ebay: -0.01,
  reliance: 0.01,
  croma: 0.02,
  '99acres': 0.04,
  magicbricks: 0.02,
  housing: -0.01,
  nobroker: 0.00,
  commonfloor: -0.03,
};

function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

export default function CompareModal({ open, onClose, product }) {
  const [market1, setMarket1] = useState(null);
  const [market2, setMarket2] = useState(null);

  // Decide marketplaces based on product category
  const marketplaces = useMemo(() => {
    const cat = product?.category || '';
    if (String(cat).toLowerCase().includes('housing')) return HOUSING_MARKETS;
    return ELECTRONICS_MARKETS;
  }, [product]);

  // Initialize selection when product or marketplaces change
  React.useEffect(() => {
    if (marketplaces.length > 0) {
      setMarket1(marketplaces[0].value);
      setMarket2(marketplaces[1]?.value || marketplaces[0].value);
    }
  }, [marketplaces]);

  // Helper to build deterministic stats for a marketplace
  const buildStats = (market, basePrice) => {
    const offset = MARKET_OFFSETS[market] ?? 0;
    const price = Math.round(basePrice * (1 + offset));
    const priceChange = Math.round(offset * 100);
    const sellers = 20 + (market.length * 3) + (product?.id ? Number(String(product.id).slice(-1)) : 0);
    const harmony = clamp(Math.round((product?.harmonyScore || 60) + (offset * 100)), 10, 99);
    const stock = priceChange < 0 ? 'Low' : 'In Stock';
    return { price, priceChange, sellers, harmony, stock };
  };

  // Build 7-day trends deterministically
  const buildTrends = (markets, basePrice) => {
    const days = [1,2,3,4,5,6,7];
    return days.map(d => {
      const row = { day: `Day ${d}` };
      markets.forEach(m => {
        const offset = MARKET_OFFSETS[m] ?? 0;
        // daily wobble deterministic from day and market name
        const wobble = ((m.length % 5) - 2) * 0.002 * d; // small
        const value = Math.round(basePrice * (1 + offset + wobble));
        row[m] = value;
      });
      return row;
    });
  };

  if (!open) return null;

  const basePriceUSD = product?.averagePrice || product?.price || 1000;

  // Determine stats for currently selected markets
  const stats = {};
  marketplaces.forEach(m => { stats[m.value] = buildStats(m.value, basePriceUSD); });

  const trends = buildTrends(marketplaces.map(m => m.value), basePriceUSD);

  // Labels for legend
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl mx-2 md:mx-4 bg-dark-card rounded-2xl shadow-2xl border border-cyan-400/20 p-4 md:p-8 animate-fade-in max-h-[95vh] overflow-y-auto">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-neon-cyan transition"><X size={28} /></button>
        <h2 className="text-2xl md:text-3xl font-bold text-neon-cyan flex items-center gap-3 mb-2">
          <span className="inline-block"><svg width="28" height="28" fill="none" viewBox="0 0 24 24"><path d="M12 20v-6m0 0V4m0 10H6m6 0h6" stroke="#00FFF5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
          Compare Prices Across Sites
        </h2>
        <p className="text-gray-400 mb-6">Select two marketplaces to see real-time pricing and stock comparison for <span className="font-semibold text-white">{product?.name || product?.title || 'selected product'}</span>.</p>

        <div className="flex flex-col md:flex-row gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Marketplace 1</label>
            <select value={market1 || ''} onChange={e => setMarket1(e.target.value)} className="w-full bg-dark-surface border-2 border-neon-cyan/70 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan">
              {marketplaces.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
            </select>
          </div>
          <div className="flex-1">
            <label className="block text-gray-300 mb-1">Marketplace 2</label>
            <select value={market2 || ''} onChange={e => setMarket2(e.target.value)} className="w-full bg-dark-surface border-2 border-neon-cyan/30 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-neon-cyan">
              {marketplaces.map(m => <option key={m.value} value={m.value} disabled={m.value===market1}>{m.label}</option>)}
            </select>
          </div>
        </div>

        <div className="bg-gradient-to-r from-neon-cyan/10 to-dark-card/80 rounded-lg px-6 py-3 mb-6 text-neon-cyan font-medium shadow-inner">
          <span className="font-bold">AI Insight:</span> Prices vary by marketplace; comparing multiple sites helps detect manipulative spreads and regional shortages.
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Left marketplace card */}
          <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border border-cyan-400/10">
            <h3 className="text-xl font-bold text-neon-cyan mb-4">{(marketplaces.find(m => m.value === market1) || {}).label}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Average Price</span>
              <span className="text-2xl font-bold text-white">{convertUSDToINR(stats[market1]?.price ?? basePriceUSD)}</span>
              <span className={"ml-2 flex items-center " + ((stats[market1]?.priceChange ?? 0) > 0 ? 'text-green-400' : 'text-red-400')}>
                {(stats[market1]?.priceChange ?? 0) > 0 ? <TrendingUp size={18}/> : <TrendingDown size={18}/>} {Math.abs(stats[market1]?.priceChange ?? 0)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Active Sellers</span>
              <span className="flex items-center gap-1 text-white font-bold"><Users size={18}/> {stats[market1]?.sellers ?? '-'}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Stock Status</span>
              <span className="flex items-center gap-1 text-green-400 font-bold"><PackageCheck size={18}/> {stats[market1]?.stock ?? 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Harmony Score</span>
              <span className="text-neon-cyan font-bold text-xl">{stats[market1]?.harmony ?? '-'}</span>
            </div>
          </div>

          {/* Right marketplace card */}
          <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border border-cyan-400/10">
            <h3 className="text-xl font-bold text-neon-cyan mb-4">{(marketplaces.find(m => m.value === market2) || {}).label}</h3>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Average Price</span>
              <span className="text-2xl font-bold text-white">{convertUSDToINR(stats[market2]?.price ?? basePriceUSD)}</span>
              <span className={"ml-2 flex items-center " + ((stats[market2]?.priceChange ?? 0) > 0 ? 'text-green-400' : 'text-red-400')}>
                {(stats[market2]?.priceChange ?? 0) > 0 ? <TrendingUp size={18}/> : <TrendingDown size={18}/>} {Math.abs(stats[market2]?.priceChange ?? 0)}%
              </span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Active Sellers</span>
              <span className="flex items-center gap-1 text-white font-bold"><Users size={18}/> {stats[market2]?.sellers ?? '-'}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-300">Stock Status</span>
              <span className="flex items-center gap-1 text-green-400 font-bold"><PackageCheck size={18}/> {stats[market2]?.stock ?? 'Unknown'}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Harmony Score</span>
              <span className="text-neon-cyan font-bold text-xl">{stats[market2]?.harmony ?? '-'}</span>
            </div>
          </div>
        </div>

        <div className="bg-dark-surface rounded-2xl p-6 shadow-lg border border-cyan-400/10">
          <h3 className="text-lg font-bold text-neon-cyan mb-4">Price Trends (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={trends}>
              <XAxis dataKey="day" stroke="#00FFF5" tick={{ fill: '#00FFF5' }} />
              <YAxis stroke="#666" tick={{ fill: '#A0A0B0' }} />
              <Tooltip contentStyle={{ background: '#18181C', border: 'none', color: '#00FFF5' }} labelStyle={{ color: '#00FFF5' }} />
              {/* Draw lines for the two selected marketplaces */}
              {market1 && <Line type="monotone" dataKey={market1} stroke="#00FFF5" strokeWidth={2} dot={{ fill: '#00FFF5' }} />}
              {market2 && <Line type="monotone" dataKey={market2} stroke="#0FF0FF" strokeWidth={2} dot={{ fill: '#0FF0FF' }} />}
            </LineChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-8 mt-2 text-neon-cyan font-bold">
            <span>{(marketplaces.find(m => m.value === market1) || {}).label}</span>
            <span>{(marketplaces.find(m => m.value === market2) || {}).label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
