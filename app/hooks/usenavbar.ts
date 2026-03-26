'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { Navlink, UIConfig, UIConfigResponse } from '../types/navbar';

export function useNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<UIConfig | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // FETCH UI CONFIG FROM STRAPI
  useEffect(() => {
    async function fetchConfig() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/ui-config?populate=nav_links`,
          { cache: 'no-store' }
        );

        const json: UIConfigResponse = await res.json();
        setConfig(json.data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchConfig();
  }, []);

  // Capitalize name
  const userName = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1)
    : 'User';

  const userInitial = userName.charAt(0);

  // ✅ STRAPI v5 FORMAT (NO attributes, NO data nesting)
  const navLinks: Navlink[] =
    config?.nav_links?.map((item) => ({
      name: item.name,
      href: item.href,
    })) || [];

  const logoText = config?.logoText || 'RetailPro';
  const loginText = config?.loginText || 'Login';
  const logoutText = config?.logoutText || 'Logout';

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
    logoText,
    loginText,
    logoutText,
  };
}
