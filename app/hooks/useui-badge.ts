'use client';

import { useEffect, useState } from 'react';
import { fetchAPI } from '@/lib/strapi';
import type { UiBadgeConfig, UiBadgeResponse } from '@/app/types/ui-badge';

export function useUiBadge() {
  const [config, setConfig] = useState<UiBadgeConfig | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetchAPI<UiBadgeResponse>('/ui-badges');
        setConfig(res.data?.[0]??null);
      } catch (err) {
        console.error('UI badge error:', err);
      }
    }

    load();
  }, []);

  return config;
}
