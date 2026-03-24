import { Copyright } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-6 text-center text-sm text-gray-500">
      <div className="flex items-center justify-center gap-2">
        <Copyright size={16} />
        <span>2026 RetailPro. All rights reserved.</span>
      </div>
    </footer>
  );
}