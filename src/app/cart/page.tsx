"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";
import { formatInr } from "@/lib/units";

export default function CartPage() {
  const { items, removeItem } = useCart();

  const totalCost = items.reduce((sum, item) => sum + (item.itemTotalInr || 0), 0);

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ color: "var(--primary)", marginBottom: '2rem' }}>Shopping Cart</h1>
      
      {items.length === 0 ? (
        <div style={{ textAlign: "center", padding: "4rem", background: "var(--card-bg)", borderRadius: "var(--radius)" }}>
          <p style={{ marginBottom: "2rem" }}>Your cart is empty.</p>
          <Link href="/products" className="btn-primary">Browse Catalog</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {items.map(item => (
            <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "var(--card-bg)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
              <div>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>{item.name}</h3>
                <p style={{ margin: 0, color: "var(--muted-foreground)" }}>
                  Quantity: {item.requestedQuantity} {item.requestedUnit}
                </p>
              </div>
              <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  {formatInr(item.itemTotalInr || 0)}
                </div>
                <button onClick={() => removeItem(item.productId)} className="btn-outline" style={{ borderColor: "var(--error)", color: "var(--error)" }}>
                  Remove
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ marginTop: "2rem", textAlign: "right", display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "1rem" }}>
            <div style={{ fontSize: "1.5rem" }}>
              Total: <strong>{formatInr(totalCost)}</strong>
            </div>
            <Link href="/checkout" className="btn-primary" style={{ fontSize: "1.2rem", padding: "1rem 2rem" }}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
