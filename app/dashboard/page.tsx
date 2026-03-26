import {
  Users,
  TrendingUp,
  Rocket,
  CheckCircle,
  BarChart3,
  Lightbulb,
} from 'lucide-react';

import {
  Card,
  CardContent,
} from '@/components/ui/Card';

import { dashboardMetadata } from '@/app/metadata/dashboard';
import Chart from '@/components/dashboard/Charts';

export const metadata = dashboardMetadata;
import { StatsResponse } from '../types/dashboard';

// SERVER DATA FETCH
async function getStats(): Promise<StatsResponse> {
  return {
    totalSubscribers: 1243,
  };
}

export default async function Dashboard() {
  const data = await getStats();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard
        </h1>

        <p className="mt-2 flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Rocket size={16} className="text-blue-500" />
          Welcome back — here’s what’s happening
        </p>
      </div>

      {/* STATS */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">

        <Card className="border-none bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-xl">
          <CardContent className="flex items-center justify-between p-6">

            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Subscribers
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                {data.totalSubscribers}
              </h2>

              <p className="mt-1 flex items-center gap-1 text-sm text-green-500">
                <TrendingUp size={14} />
                +12% this week
              </p>
            </div>

            <div className="rounded-full bg-blue-500/20 p-3">
              <Users className="text-blue-600 dark:text-blue-400" />
            </div>

          </CardContent>
        </Card>

      </div>

      {/* CLIENT CHART */}
      <div className="mt-10">
        <Chart />
      </div>

      {/* ACTIVITY */}
      <div className="mt-10">
        <Card className="border-none bg-white/70 backdrop-blur-xl dark:bg-gray-900/70">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>

            <ul className="mt-4 space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <li className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                New user registered
              </li>

              <li className="flex items-center gap-2">
                <BarChart3 size={16} className="text-blue-500" />
                Analytics updated
              </li>

              <li className="flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-500" />
                New feature deployed
              </li>
            </ul>

          </CardContent>
        </Card>
      </div>

    </div>
  );
}