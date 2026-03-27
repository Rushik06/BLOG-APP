'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/strapi';
import type { BlogPageConfig, BlogPageResponse } from '@/app/types/blog-page';

export function useBlogConfig() {
  const [config, setConfig] = useState<BlogPageConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetchAPI<BlogPageResponse>('/blog-pages');
        setConfig(res.data?.[0] ?? null);
      } catch (err) {
        console.error('Blog config error:', err);
      }
    }

    loadConfig();
  }, []);

  return config;
}
