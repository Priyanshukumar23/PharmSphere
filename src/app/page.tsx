import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>


      <main className="container" style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: 'center', padding: "4rem 1rem" }}>
        <h2 style={{ fontSize: '3rem', color: "var(--foreground)", marginBottom: '1rem' }}>Welcome to AssamMed</h2>
        <p style={{ color: 'var(--muted-foreground)', fontSize: "1.25rem", maxWidth: "600px", marginBottom: '2rem' }}>
          Your high-precision medical inventory and order management system. Providing accurate, reliable supply chains for the modern world.
        </p>
        
        {!session && (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link href="/signup" className="btn-primary" style={{ fontSize: "1.1rem", padding: "0.75rem 1.5rem" }}>
              Get Started Now
            </Link>
            <Link href="/products" className="btn-outline" style={{ fontSize: "1.1rem", padding: "0.75rem 1.5rem" }}>
              View Catalog
            </Link>
          </div>
        )}
      </main>
      
      <footer style={{ background: "var(--muted)", padding: "2rem 0", textAlign: "center", borderTop: "1px solid var(--border)" }}>
        <p style={{ margin: 0, color: "var(--muted-foreground)" }}>&copy; {new Date().getFullYear()} AssamMed. All rights reserved.</p>
      </footer>
    </div>
  );
}
