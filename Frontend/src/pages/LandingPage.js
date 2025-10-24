import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const [category, setCategory] = useState("phone");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/overview", { state: { category } });
  };

  return (
    <div className="landing-bg">
      <header className="landing-header">
        <div className="landing-logo">
          <span className="logo-icon">📈</span>
          <span className="logo-text">MarketPulse.AI</span>
        </div>
      </header>
      <main className="landing-main">
        <h1>
          AI-Powered Market <span className="accent">Intelligence</span>
        </h1>
        <p className="landing-sub">
          Detect price manipulation, seller scarcity, and market imbalances in real-time. Start by selecting a category to analyze.
        </p>
        <form className="landing-form" onSubmit={handleSubmit}>
          <div className="input-wrap">
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="landing-select"
            >
              <option value="phone">Phone</option>
              <option value="laptop">Laptop</option>
              <option value="housing">Housing</option>
            </select>
          </div>
          <button type="submit" className="landing-btn">
            Analyze Market Harmony <span className="bolt">⚡</span>
          </button>
        </form>
      </main>
    </div>
  );
}
