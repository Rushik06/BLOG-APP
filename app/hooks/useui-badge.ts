'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/strapi';
import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

import type {
  UiBadgeConfig,
  UiBadgeResponse,
} from '@/app/types/ui-badge';

export function useUiBadge() {
  const [config, setConfig] = useState<UiBadgeConfig | null>(null);

  useEffect(() => {
    async function load() {
      try {
        logger.debug({
          msg: 'Fetching UI badge config',
        });

        const res = await fetchAPI<UiBadgeResponse>('/ui-badges');

        setConfig(res.data?.[0] ?? null);

        logger.info({
          msg: 'UI badge config loaded',
        });
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Unknown error';

        logger.error({
          msg: LOG_MESSAGES.uiBadge.error,
          error: message,
        });
      }
    }

    load();
  }, []);

  return config;
}