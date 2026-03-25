'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Store, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  //  prevent layout shift
  if (!mounted) {
    return <div className="h-16 w-full" />;
  }

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/80 backdrop-blur-md dark:border-gray-800 dark:bg-gray-900/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* Logo */}
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
          >
            <Store className="text-blue-600" size={20} aria-hidden="true" />
            RetailPro
          </Link>

          {/* Links */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={pathname === link.href ? 'page' : undefined}
                className={cn(
                  'transition',
                  pathname === link.href
                    ? 'font-semibold text-black dark:text-white'
                    : 'text-gray-500 hover:text-black dark:text-gray-400 dark:hover:text-white'
                )}
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* DARK MODE */}
          <Button
            variant="ghost"
            size="icon"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="rounded-full transition-transform hover:scale-105"
          >
            {theme === 'dark' ? (
              <Sun size={18} aria-hidden="true" />
            ) : (
              <Moon size={18} aria-hidden="true" />
            )}
          </Button>

          {/* LOGIN */}
          <Button variant="ghost" size="sm" aria-label="Login to your account">
            Login
          </Button>
        </div>
      </div>
    </nav>
  );
}
