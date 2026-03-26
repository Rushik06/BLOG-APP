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
            className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white"
          >
            <Store className="text-blue-600" size={20} />
            {logoText}
          </Link>

          {/* NAV LINKS (FROM CMS)*/}
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
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          
          {/* THEME */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </Button>

          {/* AUTH */}
          {status === 'loading' ? null : status === 'authenticated' ? (
            <div className="flex items-center gap-3">
              
              {/* USER */}
              <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5 dark:bg-gray-800">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-500 text-xs text-white">
                  {userInitial}
                </div>
                <span className="text-sm">Hi {userName}</span>
              </div>

              {/* LOGOUT */}
              <Button onClick={handleLogout}>
                {logoutText}
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button>{loginText}</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}