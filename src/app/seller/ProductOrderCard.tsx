"use client";

import { useState, useEffect } from "react";
import { Dimension, DisplayUnit, getValidUnits, formatInr } from "@/lib/units";
import { calculateQuote, createOrder } from "../actions/orders";

export function ProductOrderCard({ product }: { product: any }) {
  const [quantity, setQuantity] = useState<string>("1");
  const [unit, setUnit] = useState<DisplayUnit>(getValidUnits(product.dimension as Dimension)[0]);
  const [quote, setQuote] = useState<{ totalInr: string, baseQty: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);

  useEffect(() => {
    const fetchQuote = async () => {
      const parsedQty = parseFloat(quantity);
      if (isNaN(parsedQty) || parsedQty <= 0) {
        setQuote(null);
        return;
      }
      try {
        const res = await calculateQuote(product.id, parsedQty, unit);
        setQuote(res);
      } catch (e) {
        setQuote(null);
      }
    };
    
    // Simple debounce would be ideal, but for hackathon demo direct call is fine
    fetchQuote();
  }, [quantity, unit, product.id]);

  const handleOrder = async () => {
    setLoading(true);
    setOrderStatus(null);
    try {
      const parsedQty = parseFloat(quantity);
      await createOrder(product.id, parsedQty, unit);
      setOrderStatus("Order placed successfully!");
    } catch (e: any) {
      setOrderStatus(e.message || "Failed to place order.");
    }
    setLoading(false);
  };

  return (
    <div style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)" }}>
      <h3>{product.name}</h3>
      <p style={{ color: "var(--muted-foreground)" }}>SKU: {product.sku}</p>
      
      <div style={{ marginTop: "1rem", display: "flex", gap: "0.5rem" }}>
        <input 
          type="number" 
          step="any"
          value={quantity} 
          onChange={(e) => setQuantity(e.target.value)} 
          style={{ width: "100px" }}
        />
        <select value={unit} onChange={(e) => setUnit(e.target.value as DisplayUnit)} style={{ width: "100px" }}>
          {getValidUnits(product.dimension as Dimension).map(u => (
            <option key={u} value={u}>{u}</option>
          ))}
        </select>
      </div>

      <div style={{ marginTop: "1.5rem", background: "var(--muted)", padding: "1rem", borderRadius: "var(--radius)" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Exact Total:</span>
          <strong>{quote ? formatInr(quote.totalInr) : "---"}</strong>
        </div>
        <div style={{ fontSize: "0.8rem", color: "var(--muted-foreground)", marginTop: "0.5rem" }}>
          Internal Conversion: {quote ? `${quote.baseQty} Base Units` : "..."}
        </div>
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleOrder} disabled={loading || !quote} className="btn-primary" style={{ width: "100%" }}>
          {loading ? "Processing..." : "Place Quotation / Order"}
        </button>
        {orderStatus && <p style={{ marginTop: "0.5rem", color: "var(--success)", fontSize: "0.9rem" }}>{orderStatus}</p>}
      </div>
    </div>
  );
}
