"use client";

import { useState } from "react";
import { formatInr, Dimension } from "@/lib/units";
import { updateProduct, deleteProduct } from "../actions/products";

export function ProductCard({ product }: { product: any }) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [dimension, setDimension] = useState<Dimension>(product.dimension);
  const [symptoms, setSymptoms] = useState(product.symptoms || "");
  const [price, setPrice] = useState(product.pricePerBaseUnit.toString());
  const [stock, setStock] = useState(product.stockInBaseUnit.toString());
  const [imageUrl, setImageUrl] = useState(product.imageUrl || "");
  const [loading, setLoading] = useState(false);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProduct(product.id, {
        name,
        sku,
        dimension,
        symptoms,
        pricePerBaseUnit: parseFloat(price),
        stockInBaseUnit: parseFloat(stock),
        imageUrl
      });
      setIsEditing(false);
    } catch (err: any) {
      alert(err.message || "Failed to update product");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    setLoading(true);
    try {
      await deleteProduct(product.id);
    } catch (err: any) {
      alert(err.message || "Failed to delete product");
      setLoading(false);
    }
  };

  if (isEditing) {
    return (
      <div style={{ border: "1px solid var(--border)", padding: "1.5rem", background: "var(--card-bg)", borderRadius: "var(--radius)" }}>
        <form onSubmit={handleUpdate} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <input required type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Product Name" style={{ width: "100%", padding: "0.5rem" }} />
          <input required type="text" value={sku} onChange={e => setSku(e.target.value)} placeholder="SKU" style={{ width: "100%", padding: "0.5rem" }} />
          
          <select value={dimension} onChange={e => setDimension(e.target.value as Dimension)} style={{ width: "100%", padding: "0.5rem" }}>
            <option value="MASS">Mass (g)</option>
            <option value="VOLUME">Volume (mL)</option>
            <option value="COUNT">Count (item)</option>
          </select>
          
          <input type="text" value={symptoms} onChange={e => setSymptoms(e.target.value)} placeholder="Symptoms (comma separated)" style={{ width: "100%", padding: "0.5rem" }} />
          
          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Price per base unit (INR)</label>
            <input required type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" style={{ width: "100%", padding: "0.5rem" }} />
          </div>
          
          <div>
            <label style={{ fontSize: "0.8rem", color: "var(--muted-foreground)" }}>Stock (base units)</label>
            <input required type="number" step="0.01" value={stock} onChange={e => setStock(e.target.value)} placeholder="Stock" style={{ width: "100%", padding: "0.5rem" }} />
          </div>

          <input type="text" value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="Image URL (optional)" style={{ width: "100%", padding: "0.5rem" }} />
          
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "1rem" }}>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>{loading ? "Saving..." : "Save"}</button>
            <button type="button" disabled={loading} onClick={() => setIsEditing(false)} className="btn-outline" style={{ flex: 1 }}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div style={{ border: "1px solid var(--border)", padding: "1.5rem", background: "var(--card-bg)", borderRadius: "var(--radius)", display: "flex", flexDirection: "column" }}>
      {product.imageUrl && (
        <div style={{ marginBottom: "1rem", borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "4/3", background: "var(--muted)" }}>
          <img src={product.imageUrl} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </div>
      )}
      <h3 style={{ marginTop: 0 }}>{product.name}</h3>
      <p style={{ color: "var(--muted-foreground)", margin: "0.2rem 0" }}>SKU: {product.sku}</p>
      <p style={{ margin: "0.5rem 0" }}><strong>Symptoms:</strong> {product.symptoms || "N/A"}</p>
      <p style={{ margin: "0.5rem 0" }}><strong>Stock:</strong> {product.stockInBaseUnit.toString()} {product.dimension === 'MASS' ? 'g' : product.dimension === 'VOLUME' ? 'mL' : 'item'}</p>
      <p style={{ margin: "0.5rem 0", color: "var(--primary)", fontWeight: "bold" }}>{formatInr(product.pricePerBaseUnit as any)} / base unit</p>
      
      <div style={{ display: "flex", gap: "0.5rem", marginTop: "auto", paddingTop: "1.5rem" }}>
        <button onClick={() => setIsEditing(true)} disabled={loading} className="btn-outline" style={{ flex: 1 }}>Edit</button>
        <button onClick={handleDelete} disabled={loading} className="btn-primary" style={{ flex: 1, background: "var(--error)", borderColor: "var(--error)", color: "white" }}>Delete</button>
      </div>
    </div>
  );
}
