import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getMyProducts, getMySales } from "../actions/products";
import Link from "next/link";
import { formatInr } from "@/lib/units";
import { AddProductForm } from "./AddProductForm";
import { getMyQueries } from "../actions/queries";
import { QueryForm } from "../buyer/QueryForm";
import { ProductCard } from "./ProductCard";

export default async function SellerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "SELLER") {
    redirect("/login");
  }

  const myProducts = await getMyProducts();
  const sales = await getMySales();
  const queries = await getMyQueries();

  const totalItems = myProducts.length;
  const nonCancelledSales = sales.filter(s => s.order.status !== "CANCELLED");
  const cancelledOrdersCount = sales.filter(s => s.order.status === "CANCELLED").length;
  const totalSalesInr = nonCancelledSales.reduce((acc, sale) => acc + Number(sale.itemTotalInr), 0);

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ color: "var(--primary)" }}>Seller Dashboard</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "3rem" }}>
        <div style={{ padding: "1.5rem", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h3>Total Items</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0" }}>{totalItems}</p>
        </div>
        <div style={{ padding: "1.5rem", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h3>Total Sales</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0", color: "var(--success)" }}>{formatInr(totalSalesInr)}</p>
        </div>
        <div style={{ padding: "1.5rem", background: "var(--card-bg)", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
          <h3>Cancelled Orders</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", margin: "0.5rem 0 0 0", color: "var(--error)" }}>{cancelledOrdersCount}</p>
        </div>
      </div>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Add New Product</h2>
        <div style={{ background: "var(--card-bg)", border: "1px solid var(--border)", padding: "2rem", borderRadius: "var(--radius)" }}>
          <AddProductForm />
        </div>
      </section>

      <section>
        <h2>My Inventory</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem", marginTop: "1rem" }}>
          {myProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
          {myProducts.length === 0 && <p>You have not added any products yet.</p>}
        </div>
      </section>

      <section style={{ marginBottom: "4rem", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
        <div>
          <h2>Submit a Query or Complaint</h2>
          <div style={{ background: "var(--card-bg)", padding: "2rem", border: "1px solid var(--border)", borderRadius: "var(--radius)" }}>
            <QueryForm />
          </div>
        </div>

        <div>
          <h2>My Queries</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {queries.map(q => (
              <div key={q.id} style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius)", background: "var(--card-bg)" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <strong>{q.subject}</strong>
                  <span style={{ 
                    background: q.status === 'OPEN' ? 'var(--error)' : 'var(--success)', 
                    color: 'white', 
                    padding: '0.1rem 0.5rem', 
                    borderRadius: '1rem',
                    fontSize: '0.8rem'
                  }}>{q.status}</span>
                </div>
                <p style={{ margin: "0.5rem 0" }}>{q.message}</p>
                {q.response && (
                  <div style={{ background: "var(--muted)", padding: "1rem", borderRadius: "var(--radius)", marginTop: "1rem" }}>
                    <strong>Admin Reply:</strong>
                    <p style={{ margin: "0.5rem 0 0 0" }}>{q.response}</p>
                  </div>
                )}
              </div>
            ))}
            {queries.length === 0 && <p>No queries submitted.</p>}
          </div>
        </div>
      </section>
    </div>
  );
}
