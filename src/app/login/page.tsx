"use client";

import { signIn } from "next-auth/react";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("BUYER");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      username,
      password,
      role,
      redirect: false,
    });

    if (res?.error) {
      setError("Invalid credentials or role mismatch");
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "4rem" }}>
      <h2 style={{ color: "var(--primary)" }}>Login to AssamMed</h2>
      {registered && <div style={{ color: "var(--success)", marginTop: "1rem", fontWeight: "bold" }}>Registration successful! Please log in.</div>}
      
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
        {error && <div style={{ color: "var(--error)", background: "#fee2e2", padding: "0.5rem", borderRadius: "var(--radius)" }}>{error}</div>}
        
        <div>
          <label>Username</label>
          <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        
        <div>
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <div>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p style={{ marginTop: "2rem", textAlign: "center" }}>
        Don't have an account? <Link href="/signup" style={{ color: "var(--primary)", fontWeight: "bold" }}>Sign up here</Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}
