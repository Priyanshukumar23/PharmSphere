"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useCart } from "./CartProvider";
import { useState, useEffect } from "react";

export function Header() {
  const { data: session } = useSession();
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme) {
      setTheme(savedTheme as "light" | "dark");
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else if (prefersDark) {
      setTheme("dark");
      document.documentElement.setAttribute("data-theme", "dark");
    } else {
      setTheme("light");
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("theme", nextTheme);
  };
  const { items } = useCart();
  
  const cartCount = items.length;

  return (
    <header style={{ background: "var(--card-bg)", borderBottom: "1px solid var(--border)", padding: "1rem 2rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <Link href="/" style={{ fontSize: "1.5rem", fontWeight: "bold", color: "var(--primary)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <img src="/images/logo.png" alt="PharmSphere Logo" style={{ width: "36px", height: "36px", borderRadius: "8px", objectFit: "cover" }} />
        PharmSphere
      </Link>
      
      <nav style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
        <Link href="/products" style={{ color: "var(--foreground)", textDecoration: "none" }}>Catalog</Link>

        {mounted && (
          <button 
            onClick={toggleTheme} 
            className="btn-outline" 
            style={{ 
              padding: "0.5rem", 
              borderRadius: "50%", 
              width: "40px", 
              height: "40px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              fontSize: "1.2rem",
              background: "var(--card-bg)"
            }} 
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? "☀️" : "🌙"}
          </button>
        )}
        
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
