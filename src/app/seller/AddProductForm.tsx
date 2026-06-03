"use client";

import { useState } from "react";
import { createProduct } from "../actions/products";
import { useRouter } from "next/navigation";
import { Dimension } from "@prisma/client";

export function AddProductForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await createProduct(
        formData.get("name") as string,
        formData.get("sku") as string,
        formData.get("dimension") as Dimension,
        formData.get("symptoms") as string,
        parseFloat(formData.get("price") as string),
        parseFloat(formData.get("stock") as string),
        (formData.get("imageUrl") as string) || undefined
      );
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert("Failed to add product.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label>Product Name</label>
          <input type="text" name="name" required />
        </div>
        <div>
          <label>SKU</label>
          <input type="text" name="sku" required />
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label>Dimension (Base Unit)</label>
          <select name="dimension" required>
            <option value="COUNT">Count (item)</option>
            <option value="MASS">Mass (g)</option>
            <option value="VOLUME">Volume (mL)</option>
          </select>
        </div>
        <div>
          <label>Image URL (optional)</label>
          <input type="url" name="imageUrl" placeholder="https://example.com/image.jpg" />
        </div>
      </div>
      <div>
        <label>Symptoms (comma separated)</label>
        <input type="text" name="symptoms" placeholder="e.g., fever, headache" />
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div>
          <label>Price per Base Unit (INR)</label>
          <input type="number" step="0.0001" name="price" required />
        </div>
        <div>
          <label>Initial Stock (in Base Unit)</label>
          <input type="number" step="0.0001" name="stock" required />
        </div>
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", marginTop: "1rem" }}>
        {loading ? "Adding..." : "Add Product"}
      </button>
    </form>
  );
}
