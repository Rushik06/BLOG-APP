import Link from "next/link";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "16px",
        borderBottom: "1px solid #eee",
      }}
    >
      <h2>MyProduct</h2>

      <div style={{ display: "flex", gap: "20px" }}>
        <Link href="/">Home</Link>
        <Link href="/features">Features</Link>
        <Link href="/pricing">Pricing</Link>
        <Link href="/blog">Blog</Link>
        <Link href="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}