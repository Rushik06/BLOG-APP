import { StatsResponse, Activity } from '@/app/types/dashboard';

/* FETCH SUBSCRIBER COUNT*/
export async function getStats(): Promise<StatsResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/subscribers?pagination[pageSize]=1`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      console.error('Stats fetch failed:', res.status);
      return { totalSubscribers: 0 };
    }

    const json = await res.json();

    return {
      totalSubscribers: json.meta?.pagination?.total || 0,
    };
  } catch (err) {
    console.error('Stats error:', err);
    return { totalSubscribers: 0 };
  }
}

/* FETCH ACTIVITIES */
export async function getActivities(): Promise<Activity[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/recent-activities`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      console.error('Activities fetch failed:', res.status);
      return [];
    }

    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error('Activities error:', err);
    return [];
  }
}

/*FETCH DASHBOARD TITLE */
export async function getDashboardTitle(): Promise<string> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_STRAPI_URL}/dashboard`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      console.error('Dashboard title fetch failed:', res.status);
      return 'Recent Activity';
    }

    const json = await res.json();

    return json.data?.attributes?.activityTitle || 'Recent Activity';
  } catch (err) {
    console.error('Dashboard title error:', err);
    return 'Recent Activity';
  }
}