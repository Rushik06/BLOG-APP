'use client';

import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

import { fetchAPI } from '@/lib/strapi';
import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

import type { Navlink } from '@/app/types/navbar';

interface NavLinkItem {
  name: string;
  href: string;
}

interface UiConfig {
  logoText?: string;
  loginText?: string;
  logoutText?: string;
  nav_links?: NavLinkItem[];
}

export function useNavbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { data: session, status } = useSession();

  const [mounted, setMounted] = useState(false);
  const [config, setConfig] = useState<UiConfig | null>(null);

  useEffect(() => {
    const id = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    async function fetchConfig() {
      try {
        logger.debug({ msg: 'Fetching navbar config' });

        const json = await fetchAPI<{ data: UiConfig }>('/ui-config?populate=nav_links');

        setConfig(json.data);

        logger.info({ msg: 'Navbar config loaded' });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error';

        logger.error({
          msg: LOG_MESSAGES.navbar.error,
          error: message,
        });
      }
    }

    fetchConfig();
  }, []);

  const userName = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase() + session.user.name.slice(1)
    : 'User';

  const userInitial = userName.charAt(0);

  const navLinks: Navlink[] =
    config?.nav_links
      ?.filter((link) => {
        if (link.href === '/dashboard') {
          return status === 'authenticated';
        }
        return true;
      })
      .map((item) => ({
        name: item.name,
        href: item.href,
      })) || [];

  const logoText = config?.logoText || 'RetailPro';
  const loginText = config?.loginText || 'Login';
  const logoutText = config?.logoutText || 'Logout';

  const handleLogout = async () => {
    try {
      logger.info({
        msg: 'User logout initiated',
        user: session?.user?.email,
      });

      toast.success('Logged out successfully');

      setTimeout(() => {
        signOut({ callbackUrl: '/' });
      }, 800);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';

      logger.error({
        msg: LOG_MESSAGES.navbar.error,
        error: message,
      });
    }
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
