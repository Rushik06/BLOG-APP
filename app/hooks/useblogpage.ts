'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/strapi';
import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';
import type { BlogPageConfig, BlogPageResponse } from '@/app/types/blog-page';

export function useBlogConfig() {
  const [config, setConfig] = useState<BlogPageConfig | null>(null);

  useEffect(() => {
    async function loadConfig() {
      try {
        const res = await fetchAPI<BlogPageResponse>('/blog-pages');
        setConfig(res.data?.[0] ?? null);
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown error';

        logger.error({
          msg: LOG_MESSAGES.blog.error,
          error: message,
        });
      }
    }

    loadConfig();
  }, []);

  return config;
}