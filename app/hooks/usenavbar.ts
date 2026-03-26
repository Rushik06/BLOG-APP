'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export function useNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // Capitalize name
  const userName =
    session?.user?.name
      ? session.user.name.charAt(0).toUpperCase() +
        session.user.name.slice(1)
      : 'User';

  const userInitial = userName.charAt(0);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Blog', href: '/blog' },
  ];

  // LOGOUT
  const handleLogout = async () => {
    toast.success('Logged out successfully');

    setTimeout(() => {
      signOut({ callbackUrl: '/' });
    }, 800);
  };

  return {
    pathname,
    theme,
    setTheme,
    session,
    status,
    mounted,
    userName,
    userInitial,
    navLinks,
    handleLogout, 
  };
}