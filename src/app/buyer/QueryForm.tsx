"use client";

import { useState } from "react";
import { createQuery } from "../actions/queries";
import { useRouter } from "next/navigation";

export function QueryForm() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    
    try {
      await createQuery(
        formData.get("subject") as string,
        formData.get("message") as string
      );
      router.refresh();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      alert("Failed to submit query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label>Subject</label>
        <input type="text" name="subject" required />
      </div>
      <div>
        <label>Message</label>
        <textarea name="message" required rows={4} />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start" }}>
        {loading ? "Submitting..." : "Submit Query / Complaint"}
      </button>
    </form>
  );
}
