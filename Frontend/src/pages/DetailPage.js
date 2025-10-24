import React from "react";
import { useParams, Link } from "react-router-dom";
import products from "../data/products";
import Header from "../components/Header";

export default function DetailPage() {
  const { id } = useParams();
  const item = products.find((p) => p.id === id);

  if (!item) {
    return (
      <div className="mp-app">
        <Header />
        <main className="mp-main">
          <p>Product not found. <Link to="/">Back to overview</Link></p>
        </main>
      </div>
    );
  }

  return (
    <div className="mp-app">
      <Header />
      <main className="mp-main detail-page">
        <div className="detail-card">
          <img src={item.image} alt={item.title} className="detail-image" />
          <div className="detail-info">
            <div className="product-tag">{item.tag}</div>
            <h1 className="product-title">{item.title}</h1>
            <div className="product-price large">${item.price}</div>
            <div className="harmony">Harmony Score: <strong>{item.score}</strong></div>
            <p className="detail-msg">{item.alertMessage}</p>
            <div className="detail-actions">
              <Link to="/" className="btn">Back</Link>
              <button className="btn primary" type="button">Contact Sellers</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
