export interface StatsResponse {
  totalSubscribers: number;
}

export interface Activity {
  id: number;
  text: string;
  icon: 'check' | 'chart' | 'light';
}

export interface DashboardResponse {
  activityTitle: string;
}
