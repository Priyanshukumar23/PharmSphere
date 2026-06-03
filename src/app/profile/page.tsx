import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getProfile } from "../actions/profile";
import { ProfileForm } from "./ProfileForm";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    redirect("/login");
  }

  const profile = await getProfile();
  
  if (!profile) {
    redirect("/login");
  }

  return (
    <div className="container" style={{ paddingTop: '4rem', maxWidth: "600px" }}>
      <h1 style={{ color: "var(--primary)", marginBottom: '2rem' }}>My Profile</h1>
      
      <div style={{ border: "1px solid var(--border)", background: "var(--card-bg)", padding: "2rem", borderRadius: "var(--radius)" }}>
        
        <div style={{ marginBottom: "2rem", paddingBottom: "2rem", borderBottom: "1px solid var(--border)" }}>
          <h2 style={{ marginTop: 0 }}>Account Details</h2>
          <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: "1rem", marginTop: "1rem" }}>
            <strong style={{ color: "var(--muted-foreground)" }}>Username:</strong>
            <span style={{ fontSize: "1.1rem" }}>{profile.username}</span>
            
            <strong style={{ color: "var(--muted-foreground)" }}>Role:</strong>
            <span style={{ 
              display: "inline-block", 
              background: "var(--success)", 
              color: "white", 
              padding: "0.25rem 0.75rem", 
              borderRadius: "1rem", 
              fontWeight: "bold",
              width: "fit-content"
            }}>
              {profile.role}
            </span>
          </div>
        </div>

        <h2 style={{ marginBottom: "1rem" }}>Personal Information</h2>
        <ProfileForm initialData={{
          name: profile.name || "",
          phone: profile.phone || "",
          address: profile.address || ""
        }} />

      </div>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/" className="btn-outline">← Home</Link>
        <Link href="/api/auth/signout" className="btn-primary" style={{ background: "var(--error)", border: "none" }}>Logout</Link>
      </div>
    </div>
  );
}
