import { Users, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';

interface StatsResponse {
  totalSubscribers: number;
}

// clean fetch (no unnecessary try/catch)
async function getStats(): Promise<StatsResponse> {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  const res = await fetch(`${baseUrl}/api/stats`, {
    cache: 'no-store',
  });

  if (!res.ok) {
    return { totalSubscribers: 0 };
  }

  return res.json();
}

export default async function Dashboard() {
  const data = await getStats();

  return (
    <div className="mx-auto max-w-7xl px-6 py-10">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="mt-2 text-gray-500">Overview of your platform performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Subscribers Card */}
        <Card className="transition hover:shadow-lg">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Total Subscribers</p>

              <h2 className="mt-2 text-3xl font-bold">{data.totalSubscribers}</h2>
            </div>

            <div className="rounded-full bg-blue-100 p-3">
              <Users className="text-blue-600" />
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Analytics Card */}
        <Card className="transition hover:shadow-lg">
          <CardContent className="flex items-center justify-between p-6">
            <div>
              <p className="text-sm text-gray-500">Analytics (Coming Soon)</p>

              <h2 className="mt-2 text-3xl font-bold">—</h2>
            </div>

            <div className="rounded-full bg-green-100 p-3">
              <BarChart3 className="text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optional Section */}
      <div className="mt-10">
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold">Recent Activity</h3>

            <p className="mt-2 text-sm text-gray-500">
              Subscriber activity and system updates will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
