"use client";

import { useState } from "react";
import { cancelOrder } from "@/app/actions/orders";

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this order?")) return;
    setIsProcessing(true);
    try {
      await cancelOrder(orderId);
      alert("Order cancelled successfully!");
      if (typeof window !== "undefined") {
        window.location.reload();
      }
    } catch (e: any) {
      alert(e.message || "Failed to cancel order");
      setIsProcessing(false);
    }
  };

  return (
    <button 
      onClick={handleCancel} 
      disabled={isProcessing} 
      className="btn-outline" 
      style={{ borderColor: "var(--error)", color: "var(--error)", marginTop: "1rem", width: "100%" }}
    >
      {isProcessing ? "Cancelling..." : "Cancel Order"}
    </button>
  );
}
