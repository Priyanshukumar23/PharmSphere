"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartProvider";

export function Header() {
  const { data: session } = useSession();
  const { items } = useCart();
  
  const cartCount = items.length;

  return (
    <header style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--border)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", textDecoration: "none" }}>
        AssamMed
      </Link>
      
      <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link href="/products" style={{ color: "var(--foreground)", textDecoration: "none" }}>Catalog</Link>
        
        {session ? (
          <>
            {/* Dashboard Link Based on Role */}
            {(session.user as any)?.role === "BUYER" && (
              <Link href="/buyer" style={{ color: "var(--foreground)", textDecoration: "none" }}>Dashboard</Link>
            )}
            {(session.user as any)?.role === "SELLER" && (
              <Link href="/seller" style={{ color: "var(--foreground)", textDecoration: "none" }}>Dashboard</Link>
            )}
            {(session.user as any)?.role === "ADMIN" && (
              <Link href="/admin" style={{ color: "var(--foreground)", textDecoration: "none" }}>Dashboard</Link>
            )}

            {(session.user as any)?.role === "BUYER" && (
              <Link href="/cart" style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--foreground)", textDecoration: "none", fontWeight: "bold" }}>
                🛒 Cart ({cartCount})
              </Link>
            )}
            
            <Link href="/profile" style={{ color: "var(--foreground)", textDecoration: "none" }}>Profile</Link>
            
            <button onClick={() => signOut()} className="btn-outline" style={{ padding: "0.5rem 1rem" }}>
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="btn-primary" style={{ padding: "0.5rem 1rem", textDecoration: "none" }}>
            Login
          </Link>
        )}
      </nav>
    </header>
  );
}
