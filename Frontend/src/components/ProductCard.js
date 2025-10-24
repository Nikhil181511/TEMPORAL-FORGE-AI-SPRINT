import React from "react";
import { Link } from "react-router-dom";

function formatINR(price) {
  if (!price || isNaN(price)) return "₹—";
  return "₹" + price.toLocaleString("en-IN");
}

export default function ProductCard({ item }) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={item.image} alt={item.title} className="product-image" />
        <div className="badge">{item.alerts?.[0]?.title || ""}</div>
        <div className="radial">{item.harmonyScore}</div>
      </div>
      <div className="product-body">
        <div className="product-tag">{item.brand}</div>
        <div className="product-title">{item.title}</div>
        <div className="product-bottom">
          <div className="product-price">{formatINR(item.averagePrice)}</div>
          <div className="product-score">Harmony {item.harmonyScore}</div>
        </div>
        <div className="product-alert">{item.alerts?.[0]?.description || ""}</div>
        <div className="product-actions">
          <Link to={`/details/${item.id}`} className="btn">View Details</Link>
        </div>
      </div>
    </div>
  );
}
