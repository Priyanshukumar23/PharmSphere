"use client";

import { useState } from "react";
import { toggleUserRestriction } from "../actions/users";

export function UserManagement({ users }: { users: any[] }) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleToggle = async (userId: string, currentRestricted: boolean) => {
    setLoadingId(userId);
    try {
      await toggleUserRestriction(userId, !currentRestricted);
    } catch (err) {
      alert("Failed to update user restriction status.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
      {users.map(user => (
        <div key={user.id} style={{ border: "1px solid var(--border)", padding: "1rem", borderRadius: "var(--radius)", background: "var(--card-bg)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <strong>{user.name || "N/A"}</strong> ({user.username})<br/>
            <span style={{ 
              display: "inline-block",
              background: "var(--primary)",
              color: "white",
              padding: "0.2rem 0.5rem",
              borderRadius: "1rem",
              fontSize: "0.8rem",
              fontWeight: "bold",
              marginTop: "0.5rem"
            }}>{user.role}</span>
          </div>
          <div>
            <button 
              onClick={() => handleToggle(user.id, user.isRestricted)}
              disabled={loadingId === user.id}
              className={user.isRestricted ? "btn-primary" : "btn-outline"}
              style={{ padding: "0.5rem 1rem", ...(user.isRestricted ? { background: "var(--success)", borderColor: "var(--success)" } : { color: "var(--error)", borderColor: "var(--error)" }) }}
            >
              {loadingId === user.id ? "Updating..." : (user.isRestricted ? "Unrestrict" : "Restrict User")}
            </button>
          </div>
        </div>
      ))}
      {users.length === 0 && <p>No users found.</p>}
    </div>
  );
}
