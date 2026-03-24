import { Users, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";

interface StatsResponse {
  totalSubscribers: number;
}

// clean fetch (no unnecessary try/catch)
async function getStats(): Promise<StatsResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/stats`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return { totalSubscribers: 0 };
  }

  return res.json();
}

export default async function Dashboard() {
  const data = await getStats();

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mt-2">
          Overview of your platform performance
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        
        {/* Subscribers Card */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 flex items-center justify-between">
            
            <div>
              <p className="text-sm text-gray-500">
                Total Subscribers
              </p>

              <h2 className="text-3xl font-bold mt-2">
                {data.totalSubscribers}
              </h2>
            </div>

            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="text-blue-600" />
            </div>

          </CardContent>
        </Card>

        {/* Placeholder Analytics Card */}
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6 flex items-center justify-between">
            
            <div>
              <p className="text-sm text-gray-500">
                Analytics (Coming Soon)
              </p>

              <h2 className="text-3xl font-bold mt-2">
                —
              </h2>
            </div>

            <div className="bg-green-100 p-3 rounded-full">
              <BarChart3 className="text-green-600" />
            </div>

          </CardContent>
        </Card>

      </div>

      {/* Optional Section */}
      <div className="mt-10">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-lg">
              Recent Activity
            </h3>

            <p className="text-gray-500 text-sm mt-2">
              Subscriber activity and system updates will appear here.
            </p>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}