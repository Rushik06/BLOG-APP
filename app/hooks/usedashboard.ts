import { StatsResponse, Activity } from '@/app/types/dashboard';
import { fetchAPI } from '@/lib/strapi';
import { logger } from '@/lib/logger';
import { LOG_MESSAGES } from '@/lib/logger-messages';

/* FETCH SUBSCRIBER COUNT*/
export async function getStats(): Promise<StatsResponse> {
  try {
    const json = await fetchAPI<{
      meta?: { pagination?: { total?: number } };
    }>('/subscribers?pagination[pageSize]=1', { next: { revalidate: 0 } });

    return {
      totalSubscribers: json.meta?.pagination?.total || 0,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    logger.error({
      msg: LOG_MESSAGES.stats.error,
      error: message,
    });

    return { totalSubscribers: 0 };
  }
}

/* FETCH ACTIVITIES */
export async function getActivities(): Promise<Activity[]> {
  try {
    const json = await fetchAPI<{
      data?: Activity[];
    }>('/recent-activities', { next: { revalidate: 0 } });

    return json.data || [];
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    logger.error({
      msg: LOG_MESSAGES.activities.error,
      error: message,
    });

    return [];
  }
}

/* FETCH DASHBOARD TITLE */
export async function getDashboardTitle(): Promise<string> {
  try {
    const json = await fetchAPI<{
      data?: {
        attributes?: {
          activityTitle?: string;
        };
      };
    }>('/dashboard', { next: { revalidate: 0 } });

    return json.data?.attributes?.activityTitle || 'Recent Activity';
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';

    logger.error({
      msg: LOG_MESSAGES.dashboard.error,
      error: message,
    });

    return 'Recent Activity';
  }
}
