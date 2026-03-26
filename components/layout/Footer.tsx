'use client';

import { useEffect, useState } from 'react';
import { UIConfig } from '@/app/types/footer';

export default function Footer() {
  const [footerText, setFooterText] = useState<string>('');

  useEffect(() => {
    async function fetchFooter() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_STRAPI_URL}/ui-config`
        );

        const json: { data?: UIConfig } = await res.json();

        setFooterText(
          json.data?.footerText ||
          '© 2026 RetailPro. Built for modern inventory management.'
        );
      } catch (err) {
        console.error(err);
      }
    }

    fetchFooter();
  }, []);

  return (
    <footer className="mt-16 border-t border-gray-200 dark:border-gray-800">
      <div className="mx-auto max-w-7xl px-6 py-6 text-center text-sm text-gray-600 dark:text-gray-400">
        {footerText}
      </div>
    </footer>
  );
}