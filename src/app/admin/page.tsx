import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getOrders, getProducts } from "../actions/products";
import { getAllQueries } from "../actions/queries";
import { getAllUsers } from "../actions/users";
import { formatInr } from "@/lib/units";
import { ResolveQueryForm } from "./ResolveQueryForm";
import { UserManagement } from "./UserManagement";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "ADMIN") {
    redirect("/login");
  }

  const products = await getProducts();
  const orders = await getOrders();
  const queries = await getAllQueries();
  const users = await getAllUsers();

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1>Admin Dashboard</h1>
      <p style={{ color: "var(--muted-foreground)" }}>Welcome, Admin. Manage inventory and orders.</p>

      <section style={{ marginTop: "2rem" }}>
        <h2>Inventory Levels</h2>
        <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
          {products.map((p) => (
            <div key={p.id} style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius)", background: "var(--card-bg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{p.name} (SKU: {p.sku})</strong>
                <span>{formatInr(p.pricePerBaseUnit as any)} / {p.dimension === 'MASS' ? 'g' : p.dimension === 'VOLUME' ? 'mL' : 'item'}</span>
              </div>
              <div style={{ marginTop: "0.5rem" }}>
                <span>Stock (Base Unit): {p.stockInBaseUnit.toString()} {p.dimension === 'MASS' ? 'g' : p.dimension === 'VOLUME' ? 'mL' : 'item'}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section style={{ marginTop: "4rem" }}>
        <h2>Manage Users (Buyers & Sellers)</h2>
        <UserManagement users={users} />
      </section>

      <section style={{ marginTop: "4rem" }}>
        <h2>Recent Orders / Quotations</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
          {orders.map((o) => (
            <div key={o.id} style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)", background: "var(--card-bg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                <div>
                  <strong>Order ID:</strong> {o.id.substring(0,8)}...<br/>
                  <small>By: {(o as any).user.email}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>Status:</strong> {o.status}<br/>
                  <strong>Total:</strong> {formatInr(o.totalAmountInr as any)}
                </div>
              </div>
              
              <table style={{ width: "100%", textAlign: "left", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    <th style={{ padding: "0.5rem 0" }}>Product</th>
                    <th style={{ padding: "0.5rem 0" }}>Requested Unit</th>
                    <th style={{ padding: "0.5rem 0" }}>Base Unit (Stored)</th>
                    <th style={{ padding: "0.5rem 0" }}>Calculated Total</th>
                  </tr>
                </thead>
                <tbody>
                  {o.items.map((i) => (
                    <tr key={i.id} style={{ borderBottom: "1px solid var(--muted)" }}>
                      <td style={{ padding: "0.5rem 0" }}>{i.product.name}</td>
                      <td style={{ padding: "0.5rem 0" }}>{i.requestedDisplayQuantity.toString()} {i.requestedDisplayUnit}</td>
                      <td style={{ padding: "0.5rem 0", color: "var(--muted-foreground)" }}>{i.baseQuantity.toString()} {i.product.dimension === 'MASS' ? 'g' : i.product.dimension === 'VOLUME' ? 'mL' : 'item'}</td>
                      <td style={{ padding: "0.5rem 0" }}>{formatInr(i.itemTotalInr as any)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
          {orders.length === 0 && <p>No orders yet.</p>}
        </div>
      </section>

      <section style={{ marginTop: "4rem" }}>
        <h2>Customer & Seller Queries</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
          {queries.map(q => (
            <div key={q.id} style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)", background: "var(--card-bg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
                <div>
                  <strong>{q.subject}</strong>
                  <br/><small>By: {(q as any).user.name} ({(q as any).user.role})</small>
                </div>
                <div>
                  <span style={{ 
                    background: q.status === 'OPEN' ? 'var(--error)' : 'var(--success)', 
                    color: 'white', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '1rem',
                    fontSize: '0.8rem',
                    fontWeight: "bold"
                  }}>{q.status}</span>
                </div>
              </div>
              <p style={{ background: "var(--muted)", padding: "1rem", borderRadius: "var(--radius)", margin: 0 }}>{q.message}</p>
              
              {q.status === 'OPEN' ? (
                <ResolveQueryForm queryId={q.id} />
              ) : (
                <div style={{ marginTop: "1rem", color: "var(--success)", fontWeight: "bold" }}>
                  Resolution: {q.response}
                </div>
              )}
            </div>
          ))}
          {queries.length === 0 && <p>No open queries.</p>}
        </div>
      </section>
    </div>
  );
}
