import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';

export async function fetchAPI<T>(path: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.STRAPI_API_TOKEN && {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        }),
      },
      cache: 'no-store',
      ...options,
    });

    if (!res.ok) {
      logger.error({
        msg: LOG_MESSAGES.api.fetchError,
        status: res.status,
        statusText: res.statusText,
        url: `${API_URL}${path}`,
      });

      throw new Error(`Failed to fetch: ${res.status}`);
    }

    return res.json() as Promise<T>;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unexpected API error';

    logger.error({
      msg: LOG_MESSAGES.api.globalError,
      error: message,
      url: `${API_URL}${path}`,
    });

    throw new Error(message);
  }
}
