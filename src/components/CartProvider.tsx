"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { DisplayUnit } from "@/lib/units";

export interface CartItem {
  productId: string;
  name: string;
  requestedQuantity: number;
  requestedUnit: DisplayUnit;
  pricePerBaseUnit: number;
  dimension: string;
  itemTotalInr?: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("cart");
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (e) {}
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, mounted]);

  const addItem = (item: CartItem) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      if (existing) {
        return prev.map((i) =>
          i.productId === item.productId
            ? { 
                ...i, 
                requestedQuantity: i.requestedQuantity + item.requestedQuantity,
                itemTotalInr: (i.itemTotalInr || 0) + (item.itemTotalInr || 0)
              }
            : i
        );
      }
      return [...prev, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
