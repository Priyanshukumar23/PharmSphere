"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useCart } from "./CartProvider";
import { DisplayUnit, getValidUnits, toBaseQuantity, calculateTotal, formatInr } from "@/lib/units";
import { Decimal } from "decimal.js";

export function AddToCartButton({ product }: { product: any }) {
  const { data: session } = useSession();
  const { addItem } = useCart();
  const validUnits = getValidUnits(product.dimension as any);
  
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState<DisplayUnit>(validUnits[0]);
  
  let dynamicPrice = "₹0.00";
  let itemTotalInrNum = 0;
  try {
    const baseQty = toBaseQuantity(quantity || 0, unit);
    const totalDec = calculateTotal(baseQty, new Decimal(product.pricePerBaseUnit));
    dynamicPrice = formatInr(totalDec);
    itemTotalInrNum = totalDec.toNumber();
  } catch (e) {
    // ignore
  }

  const handleAdd = () => {
    if (quantity <= 0) return;
    addItem({
      productId: product.id,
      name: product.name,
      requestedQuantity: quantity,
      requestedUnit: unit,
      pricePerBaseUnit: parseFloat(product.pricePerBaseUnit),
      dimension: product.dimension,
      itemTotalInr: itemTotalInrNum
    });
    alert("Added to cart!");
  };

  const isBuyer = (session?.user as any)?.role === "BUYER";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--primary)", textAlign: "center", marginBottom: "0.5rem" }}>
        {dynamicPrice}
      </div>
      {isBuyer && (
        <>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input 
              type="number" 
              value={quantity} 
              onChange={(e) => setQuantity(parseFloat(e.target.value))} 
              min={0.1}
              step={0.1}
              style={{ width: "80px", padding: "0.5rem" }}
            />
            <select 
              value={unit} 
              onChange={(e) => setUnit(e.target.value as DisplayUnit)}
              style={{ padding: "0.5rem", flex: 1 }}
            >
              {validUnits.map(u => (
                <option key={u} value={u}>{u}</option>
              ))}
            </select>
          </div>
          <button onClick={handleAdd} className="btn-primary" style={{ width: "100%", padding: "0.5rem" }}>
            Add to Cart
          </button>
        </>
      )}
    </div>
  );
}
