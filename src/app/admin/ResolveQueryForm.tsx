"use client";

import { useState } from "react";
import { resolveQuery } from "../actions/queries";
import { useRouter } from "next/navigation";

export function ResolveQueryForm({ queryId }: { queryId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await resolveQuery(queryId, formData.get("response") as string);
      router.refresh();
    } catch (err) {
      alert("Failed to resolve query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
      <input type="text" name="response" placeholder="Type resolution here..." required style={{ flex: 1 }} />
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Resolving..." : "Mark Resolved"}
      </button>
    </form>
  );
}
