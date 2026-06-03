"use client";

import { useState } from "react";
import { submitQuery } from "@/app/actions/query";

export function QueryForm() {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject || !message) return;
    
    setLoading(true);
    try {
      await submitQuery(subject, message);
      setSuccess(true);
      setSubject("");
      setMessage("");
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert("Failed to send query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--card-bg)", padding: "1.5rem", borderRadius: "var(--radius)", border: "1px solid var(--border)" }}>
      <h3 style={{ margin: "0 0 1rem 0", color: "var(--foreground)" }}>Submit a Query</h3>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", color: "var(--muted-foreground)" }}>Subject</label>
          <input 
            type="text" 
            value={subject} 
            onChange={e => setSubject(e.target.value)} 
            required 
            style={{ width: "100%", padding: "0.5rem" }}
            placeholder="What is your query about?"
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "0.25rem", color: "var(--muted-foreground)" }}>Message</label>
          <textarea 
            value={message} 
            onChange={e => setMessage(e.target.value)} 
            required 
            rows={4}
            style={{ width: "100%", padding: "0.5rem" }}
            placeholder="Describe your issue or question..."
          />
        </div>
        <button type="submit" disabled={loading} className="btn-primary" style={{ padding: "0.75rem", alignSelf: "flex-start" }}>
          {loading ? "Sending..." : "Send Query"}
        </button>
        {success && <p style={{ color: "green", margin: 0 }}>Query sent successfully!</p>}
      </form>
    </div>
  );
}
