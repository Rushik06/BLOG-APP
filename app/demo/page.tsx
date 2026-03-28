import { Package, Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { fetchAPI } from '@/lib/strapi';
import DemoModal from './DemoModal';
import { Stat, InventoryItem, ActivityItem } from '@/app/types/demo';
import { demoMetadata } from '../metadata/demo';

export const metadata = demoMetadata;

export default async function DemoPage() {
  const [statsRes, inventoryRes, activityRes] = await Promise.all([
    fetchAPI<{ data: Stat[] }>('/stats', { next: { revalidate: 60 } }),
    fetchAPI<{ data: InventoryItem[] }>('/inventories', { next: { revalidate: 60 } }),
    fetchAPI<{ data: ActivityItem[] }>('/activities', { next: { revalidate: 60 } }),
  ]);

  const stats = statsRes?.data || [];
  const inventory = inventoryRes?.data || [];
  const activities = activityRes?.data || [];

  const getIcon = (title: string) => {
    switch (title) {
      case 'Products':
        return <Package className="text-blue-600 dark:text-blue-400" size={18} />;
      case 'Customers':
        return <Users className="text-green-600 dark:text-green-400" size={18} />;
      case 'Revenue':
        return <TrendingUp className="text-purple-600 dark:text-purple-400" size={18} />;
      default:
        return <Activity className="text-orange-600 dark:text-orange-400" size={18} />;
    }
  };

  return (
    <DemoModal>
      {/*  HEADER  */}
      <div className="mb-6 text-left">
        <h1 className="text-xl font-semibold text-gray-900 dark:text-white">RetailPro Demo</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">Quick preview of your dashboard</p>
      </div>

      {/*  STATS  */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.id}
            className="border border-gray-200 transition hover:shadow-lg dark:border-gray-800"
          >
            <CardContent className="flex items-center gap-3 p-4">
              {/* ICON */}
              <div className="rounded-full bg-gray-100 p-2 dark:bg-gray-800">
                {getIcon(stat.title)}
              </div>

              {/* TEXT */}
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400">{stat.title}</p>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CONTENT  */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* INVENTORY */}
        <Card className="border border-gray-200 transition hover:shadow-lg dark:border-gray-800">
          <CardContent className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">Inventory</h2>

            <div className="space-y-2 text-sm">
              {inventory.map((item) => (
                <div
                  key={item.id}
                  className="flex justify-between text-gray-700 dark:text-gray-300"
                >
                  <span>{item.name}</span>

                  <span className="flex items-center gap-2">
                    {item.stockStatus === 'low' && (
                      <AlertTriangle className="text-red-500" size={14} />
                    )}

                    <span
                      className={
                        item.stockStatus === 'low'
                          ? 'text-red-500'
                          : 'text-green-600 dark:text-green-400'
                      }
                    >
                      {item.stock}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* ACTIVITY */}
        <Card className="border border-gray-200 transition hover:shadow-lg dark:border-gray-800">
          <CardContent className="p-4">
            <h2 className="mb-3 text-sm font-semibold text-gray-900 dark:text-white">
              Recent Activity
            </h2>

            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              {activities.map((a) => (
                <div key={a.id} className="flex items-center gap-2">
                  <Activity size={14} />
                  {a.message}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DemoModal>
  );
}
