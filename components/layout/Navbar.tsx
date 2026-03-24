import Link from "next/link";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <h1 className="text-xl font-bold">RetailPro</h1>

        {/* Search */}
        <div className="w-1/3 hidden md:block">
          <Input placeholder="Search..." className="bg-white text-black" />
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm font-medium">
          <Link href="/">Home</Link>
          <Link href="/features">Features</Link>
          <Link href="/pricing">Pricing</Link>
          <Link href="/blog">Blog</Link>

          <Button variant="secondary">Login</Button>
        </div>
      </div>
    </nav>
  );
}