"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/components/CartProvider";
import { useRouter } from "next/navigation";
import { createCheckoutOrder } from "@/app/actions/orders";
import { formatInr } from "@/lib/units";

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const router = useRouter();
  
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "UPI">("COD");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showUpiMock, setShowUpiMock] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [mounted, setMounted] = useState(false);

  const totalCost = items.reduce((sum, item) => sum + (item.itemTotalInr || 0), 0);

  useEffect(() => {
    setMounted(true);
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (!mounted || items.length === 0) {
    return null;
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === "UPI" && !showUpiMock) {
      setShowUpiMock(true);
      return;
    }

    setIsProcessing(true);
    setError(null);
    try {
      await createCheckoutOrder(items, paymentMethod);
      clearCart();
      router.push("/buyer?success=true");
    } catch (e: any) {
      setError(e.message || "Failed to place order");
      setIsProcessing(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "4rem", paddingBottom: "4rem" }}>
      <h1 style={{ color: "var(--primary)", marginBottom: "2rem" }}>Checkout</h1>
      
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <h2 style={{ marginBottom: "1rem" }}>Order Summary</h2>
          <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            {items.map(item => (
              <div key={item.productId} style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem" }}>
                <span>{item.name} (x{item.requestedQuantity} {item.requestedUnit})</span>
                <strong>{formatInr(item.itemTotalInr || 0)}</strong>
              </div>
            ))}
            <div style={{ marginTop: "1rem", textAlign: "right", fontSize: "1.2rem" }}>
              Total: <strong style={{ color: "var(--success)" }}>{formatInr(totalCost)}</strong>
            </div>
          </div>
        </div>

        <div>
          <h2 style={{ marginBottom: "1rem" }}>Payment Method</h2>
          <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="COD" 
                  checked={paymentMethod === "COD"} 
                  onChange={() => setPaymentMethod("COD")}
                />
                Cash on Delivery (COD)
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer" }}>
                <input 
                  type="radio" 
                  name="payment" 
                  value="UPI" 
                  checked={paymentMethod === "UPI"} 
                  onChange={() => setPaymentMethod("UPI")}
                />
                UPI
              </label>
            </div>

            {error && <p style={{ color: "var(--error)", marginTop: "1rem" }}>{error}</p>}

            {showUpiMock && paymentMethod === "UPI" && (
              <div style={{ marginTop: "2rem", padding: "1rem", border: "1px dashed var(--primary)", borderRadius: "var(--radius)", textAlign: "center" }}>
                <h3>Scan QR Code to Pay</h3>
                <div style={{ width: "150px", height: "150px", background: "white", margin: "1rem auto", display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid black" }}>
                  <span style={{ color: "black", fontWeight: "bold" }}>MOCK QR</span>
                </div>
                <p>Please simulate a successful payment to continue.</p>
                <button onClick={handlePlaceOrder} disabled={isProcessing} className="btn-primary" style={{ width: "100%", marginTop: "1rem" }}>
                  {isProcessing ? "Processing..." : "Confirm Payment & Order"}
                </button>
              </div>
            )}

            {!(showUpiMock && paymentMethod === "UPI") && (
              <button 
                onClick={handlePlaceOrder} 
                disabled={isProcessing} 
                className="btn-primary" 
                style={{ width: "100%", marginTop: "2rem" }}
              >
                {isProcessing ? "Processing..." : paymentMethod === "UPI" ? "Proceed to Pay" : "Place Order"}
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
