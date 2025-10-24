import React from "react";

export default function Header() {
  return (
    <header className="mp-header">
      <div className="mp-brand">
        <span className="mp-brand-primary">Market</span>
        <span className="mp-brand-accent">Pulse.AI</span>
      </div>
      <div className="mp-sub">AI-Powered Market Intelligence</div>
      <div className="mp-updated">Last updated: <strong>Just now</strong></div>
    </header>
  );
}
