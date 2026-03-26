'use client';

import Link from 'next/link';
import { Store, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { useNavbar } from '@/app/hooks/usenavbar';

export default function Navbar() {
  const {
    pathname,
    theme,
    setTheme,
    status,
    mounted,
    userName,
    userInitial,
    navLinks,
    handleLogout,
    logoText,
    loginText,
    logoutText,
  } = useNavbar();

  if (!mounted) return <div className="h-16 w-full" />;

  return (
    <nav className="sticky top-0 z-50 border-b bg-white/70 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-900/70">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        {/* LEFT */}
        <div className="flex items-center gap-10">
          {/* LOGO */}
          <Link
            href="/"
            aria-label="Go to homepage"
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 hover:opacity-80 dark:text-white"
          >
            <Store className="text-blue-600" size={20} />
            {logoText}
          </Link>

          {/* NAV LINKS */}
          <div className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  pathname === link.href
                    ? 'font-semibold text-black dark:text-white'
                    : 'text-gray-600 hover:text-black dark:text-gray-400'
                )}
              >
                {link.name}
              </Link>
            ))}

            {status === 'authenticated' && (
              <Link
                href="/dashboard"
                className="text-gray-700 hover:text-black dark:text-gray-300 dark:hover:text-white"
              >
                Dashboard
              </Link>
            )}
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          {/* THEME TOGGLE */}
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="transition hover:scale-110"
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* AUTH */}
          {status === 'loading' ? null : status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              {/* AVATAR */}
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-semibold text-white">
                  {userInitial}
                </div>

                <span className="text-sm text-gray-700 dark:text-gray-200">Hi {userName}</span>
              </div>

              {/* LOGOUT */}
              <Button
                onClick={handleLogout}
                className="bg-gray-900 text-white hover:bg-gray-700 dark:bg-gray-100 dark:text-gray-900 dark:hover:bg-gray-300"
              >
                {logoutText}
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button className="bg-blue-600 text-white hover:bg-blue-700">{loginText}</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
