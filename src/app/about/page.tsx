import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="container" style={{ paddingTop: '4rem', paddingBottom: '4rem' }}>
      <h1 style={{ color: "var(--primary)", fontSize: '2.5rem', marginBottom: '2rem' }}>About PharmSphere</h1>
      
      <div style={{ display: "grid", gap: "2rem", lineHeight: 1.8, fontSize: "1.1rem", color: "var(--foreground)" }}>
        <section>
          <h2>Our Mission</h2>
          <p>
            At PharmSphere, our mission is to deliver high-precision medical inventory management solutions. We understand that in the chemical and medical industries, exact measurements—down to the micro-gram—are not just a matter of efficiency, but of safety.
          </p>
        </section>
        
        <section>
          <h2>The Base Unit Standard</h2>
          <p>
            We have engineered a flawless Base Unit tracking system. Whether our customers buy in liters, milliliters, kilograms, or grams, our internal ledger maintains strict accuracy by converting and storing all inventory in precise base metrics. 
          </p>
        </section>
      </div>

      <div style={{ marginTop: "3rem" }}>
        <Link href="/" className="btn-outline">← Back to Home</Link>
      </div>
    </div>
  );
}
