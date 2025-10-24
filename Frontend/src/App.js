import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import HomePage from "./pages/HomePage";
import DetailPage from "./pages/DetailPage";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/overview" element={<HomePage />} />
        <Route path="/details/:id" element={<DetailPage />} />
      </Routes>
    </Router>
import './App.css';
import MarketHarmonyDashboard from './components/MarketHarmonyDashboard';

function App() {
  return (
    <div className="App">
      <MarketHarmonyDashboard />
    </div>
  );
}

export default App;
