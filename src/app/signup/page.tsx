"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signupUser } from "../actions/auth";
import Link from "next/link";

export default function SignupPage() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    try {
      await signupUser(formData);
      router.push("/login?registered=true");
    } catch (err: any) {
      setError(err.message || "Failed to sign up");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "4rem" }}>
      <h2 style={{ color: "var(--primary)" }}>Sign Up for AssamMed</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
        {error && <div style={{ color: "var(--error)", background: "#fee2e2", padding: "0.5rem", borderRadius: "var(--radius)" }}>{error}</div>}
        
        <div>
          <label>Full Name</label>
          <input type="text" name="name" required />
        </div>
        
        <div>
          <label>Username</label>
          <input type="text" name="username" required />
        </div>
        
        <div>
          <label>Password</label>
          <input type="password" name="password" required minLength={6} />
        </div>

        <div>
          <label>Role</label>
          <select name="role" required>
            <option value="BUYER">Buyer</option>
            <option value="SELLER">Seller</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ marginTop: "1rem" }}>
          {loading ? "Registering..." : "Sign Up"}
        </button>
      </form>
      
      <p style={{ marginTop: "2rem", textAlign: "center" }}>
        Already have an account? <Link href="/login" style={{ color: "var(--primary)", fontWeight: "bold" }}>Login here</Link>
      </p>
    </div>
  );
}
