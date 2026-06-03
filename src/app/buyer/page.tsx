import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getMyOrders } from "../actions/orders";
import { getMyQueries } from "../actions/queries";
import { formatInr } from "@/lib/units";
import { QueryForm } from "./QueryForm";
import { CancelOrderButton } from "@/components/CancelOrderButton";

export default async function BuyerDashboard() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "BUYER") {
    redirect("/login");
  }

  const orders = await getMyOrders();
  const queries = await getMyQueries();

  return (
    <div className="container" style={{ padding: "2rem 0" }}>
      <h1 style={{ color: "var(--primary)", marginBottom: "2rem" }}>My Buyer Dashboard</h1>

      <section style={{ marginBottom: "4rem" }}>
        <h2>My Orders</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", marginTop: "1rem" }}>
          {orders.map((o) => (
            <div key={o.id} style={{ border: "1px solid var(--border)", padding: "1.5rem", borderRadius: "var(--radius)", background: "var(--card-bg)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--border)", paddingBottom: "0.5rem", marginBottom: "1rem" }}>
                <div>
                  <strong>Order ID:</strong> {o.id.substring(0,8)}...<br/>
                  <small>{new Date(o.createdAt).toLocaleDateString()}</small>
                </div>
                <div style={{ textAlign: "right" }}>
                  <strong>Status:</strong> <span style={{ color: "var(--success)" }}>{o.status}</span><br/>
                  <strong>Payment:</strong> {o.paymentMethod || "N/A"} - {o.paymentStatus || "N/A"}<br/>
                  <strong>Total:</strong> {formatInr(o.totalAmountInr as any)}
                </div>
              </div>
              
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {o.items.map((i) => (
                  <li key={i.id} style={{ padding: "0.5rem 0", display: "flex", justifyContent: "space-between", borderBottom: "1px solid var(--muted)" }}>
                    <span>{i.product.name} ({i.requestedDisplayQuantity.toString()} {i.requestedDisplayUnit})</span>
                    <span>{formatInr(i.itemTotalInr as any)}</span>
                  </li>
                ))}
              </ul>
              
              {(o.status === "QUOTE" || o.status === "CONFIRMED") && (
                <CancelOrderButton orderId={o.id} />
              )}
            </div>
          ))}
          {orders.length === 0 && <p>You have not placed any orders yet.</p>}
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
