import { getProducts } from "../actions/products";
import Link from "next/link";
import { formatInr } from "@/lib/units";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { AddToCartButton } from "@/components/AddToCartButton";

export default async function ProductsPage({ searchParams }: { searchParams: { q?: string, min?: string, max?: string } }) {
  const searchQuery = searchParams.q || "";
  const minPrice = searchParams.min ? parseFloat(searchParams.min) : undefined;
  const maxPrice = searchParams.max ? parseFloat(searchParams.max) : undefined;
  const products = await getProducts(searchQuery, minPrice, maxPrice);
  const session = await getServerSession(authOptions);

  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ color: "var(--primary)", marginBottom: '1rem' }}>Our Catalog</h1>
      
      <form style={{ marginBottom: "3rem", display: "flex", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <input 
          type="text" 
          name="q" 
          defaultValue={searchQuery} 
          placeholder="Search name, SKU, or symptoms..." 
          style={{ flex: "1 1 250px" }}
        />
        <input 
          type="number" 
          name="min" 
          defaultValue={searchParams.min} 
          placeholder="Min Price (₹)" 
          style={{ width: "120px" }}
        />
        <input 
          type="number" 
          name="max" 
          defaultValue={searchParams.max} 
          placeholder="Max Price (₹)" 
          style={{ width: "120px" }}
        />
        <button type="submit" className="btn-primary">Search & Filter</button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "2rem" }}>
        {products.map(p => (
          <div key={p.id} style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "1.5rem", borderRadius: "var(--radius)", display: "flex", flexDirection: "column" }}>
            {p.imageUrl && (
              <div style={{ marginBottom: "1rem", borderRadius: "var(--radius)", overflow: "hidden", aspectRatio: "4/3", background: "var(--muted)" }}>
                <img src={p.imageUrl} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
            <h3 style={{ margin: "0 0 0.5rem 0", color: "var(--foreground)" }}>{p.name}</h3>
            <p style={{ color: "var(--muted-foreground)", fontSize: "0.9rem", margin: "0 0 0.5rem 0" }}>SKU: {p.sku}</p>
            {p.symptoms && (
              <p style={{ fontSize: "0.85rem", color: "var(--muted-foreground)", margin: "0 0 1rem 0" }}>
                <strong>Treats:</strong> {p.symptoms}
              </p>
            )}
            
            <div style={{ fontWeight: "bold", color: "var(--success)", flex: 1 }}>
              {formatInr(p.pricePerBaseUnit as any)} / {p.dimension === 'MASS' ? 'g' : p.dimension === 'VOLUME' ? 'mL' : 'item'}
            </div>
            
            <div style={{ marginTop: "1.5rem" }}>
              {session ? (
                <AddToCartButton product={p} />
              ) : (
                <Link href="/login" className="btn-outline" style={{ display: "block", textAlign: "center" }}>
                  Login to Order
                </Link>
              )}
            </div>
          </div>
        ))}
        {products.length === 0 && (
          <div style={{ gridColumn: "1/-1", padding: "2rem", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)", textAlign: "center" }}>
            No products found matching your filters.
          </div>
        )}
      </div>

      <div style={{ marginTop: "3rem" }}>
        <Link href="/" className="btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
