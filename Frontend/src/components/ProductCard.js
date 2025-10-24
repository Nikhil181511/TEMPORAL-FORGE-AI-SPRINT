import React from "react";
import { Link } from "react-router-dom";

export default function ProductCard({ item }) {
  return (
    <div className="product-card">
      <div className="product-image-wrap">
        <img src={item.image} alt={item.title} className="product-image" />
        <div className="badge">{item.alertType}</div>
        <div className="radial">{item.score}</div>
      </div>
      <div className="product-body">
        <div className="product-tag">{item.tag}</div>
        <div className="product-title">{item.title}</div>
        <div className="product-bottom">
          <div className="product-price">${item.price}</div>
          <div className="product-score">Harmony {item.score}</div>
        </div>
        <div className="product-alert">{item.alertMessage}</div>
        <div className="product-actions">
          <Link to={`/details/${item.id}`} className="btn">View Details</Link>
        </div>
      </div>
    </div>
  );
}
