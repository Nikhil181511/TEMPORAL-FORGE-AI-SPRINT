import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

export default function LandingPage() {
  const [category, setCategory] = useState("phone");
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const timerRef = useRef(null);
  const progressRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (progressRef.current) clearInterval(progressRef.current);
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return; // prevent double
    setIsLoading(true);

    // Progress bar update every 150ms (100 steps for 15s)
    let elapsed = 0;
    progressRef.current = setInterval(() => {
      elapsed += 150;
      setProgress(Math.min(100, Math.round((elapsed / 15000) * 100)));
    }, 150);

    timerRef.current = setTimeout(() => {
      setIsLoading(false);
      setProgress(0);
      if (progressRef.current) clearInterval(progressRef.current);
      navigate("/overview", { state: { category } });
    }, 15000);
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

        {isLoading ? (
          <div className="loading-wrap">
            <div className="loading-message">Fetching real-time market intelligence...</div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="countdown">{Math.max(0, 15 - Math.floor((progress / 100) * 15))}s remaining</div>
          </div>
        ) : (
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
        )}
      </main>
    </div>
  );
}
