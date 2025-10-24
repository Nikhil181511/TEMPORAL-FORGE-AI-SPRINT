import React from "react";

export default function StatCard({ title, value, change, hint, accent }) {
  return (
    <div className={`stat-card ${accent || ""}`}>
      <div className="stat-left">
        <div className="stat-title">{title}</div>
        <div className="stat-value">{value}</div>
        {change && <div className={`stat-change ${change.startsWith("-") ? "down" : "up"}`}>{change}</div>}
        {hint && <div className="stat-hint">{hint}</div>}
      </div>
      <div className="stat-right">
        <div className="spark"></div>
      </div>
    </div>
  );
}
