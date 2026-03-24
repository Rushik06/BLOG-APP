'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, Store } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <Store className="text-blue-600" size={20} />
            RetailPro
          </Link>

          {/* Links */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'transition',
                  pathname === link.href
                    ? 'font-semibold text-black'
                    : 'text-gray-500 hover:text-black'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" className="hidden md:inline-flex">
            Login
          </Button>

          <Menu className="cursor-pointer text-gray-700 md:hidden" />
        </div>
      </div>
    </nav>
  );
}
