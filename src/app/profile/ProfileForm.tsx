"use client";

import { useState } from "react";
import { updateProfile } from "../actions/profile";

export function ProfileForm({ initialData }: { initialData: { name: string, phone: string, address: string } }) {
  const [name, setName] = useState(initialData.name);
  const [phone, setPhone] = useState(initialData.phone);
  const [address, setAddress] = useState(initialData.address);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile({ name, phone, address });
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
      <div>
        <label style={{ display: "block", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Name</label>
        <input 
          type="text" 
          value={name} 
          onChange={e => setName(e.target.value)} 
          style={{ width: "100%", padding: "0.5rem" }}
          placeholder="Your full name"
        />
      </div>
      <div>
        <label style={{ display: "block", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Phone Number</label>
        <input 
          type="text" 
          value={phone} 
          onChange={e => setPhone(e.target.value)} 
          style={{ width: "100%", padding: "0.5rem" }}
          placeholder="e.g. +91 9876543210"
        />
      </div>
      <div>
        <label style={{ display: "block", color: "var(--muted-foreground)", marginBottom: "0.25rem" }}>Address</label>
        <textarea 
          value={address} 
          onChange={e => setAddress(e.target.value)} 
          rows={3}
          style={{ width: "100%", padding: "0.5rem" }}
          placeholder="Your complete address"
        />
      </div>
      <button type="submit" className="btn-primary" disabled={loading} style={{ alignSelf: "flex-start", marginTop: "0.5rem" }}>
        {loading ? "Saving..." : "Save Profile"}
      </button>
      {success && <p style={{ color: "var(--success)", margin: 0 }}>Profile updated successfully!</p>}
    </form>
  );
}
