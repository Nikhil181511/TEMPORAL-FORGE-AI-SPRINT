import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import MarketHarmonyDashboard from './components/MarketHarmonyDashboard';

import "./App.css";

function App() {
  return (
    
      
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/overview" element={<HomePage />} />
        <Route path="/details/:id" element={<MarketHarmonyDashboard />} />
      </Routes>
    </Router>
  );
}
export default App;
