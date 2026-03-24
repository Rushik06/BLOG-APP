import { Package, Users, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/Card';
import { fetchAPI } from '@/lib/strapi';
import DemoModal from './DemoModal';

import { Stat, InventoryItem, ActivityItem } from '@/app/types/demo';

export default async function DemoPage() {
  const statsRes = await fetchAPI<{ data: Stat[] }>('/stats');
  const inventoryRes = await fetchAPI<{ data: InventoryItem[] }>('/inventories');
  const activityRes = await fetchAPI<{ data: ActivityItem[] }>('/activities');

  const stats = statsRes?.data || [];
  const inventory = inventoryRes?.data || [];
  const activities = activityRes?.data || [];

  const getIcon = (title: string) => {
    switch (title) {
      case 'Products':
        return <Package className="text-blue-600" size={18} />;
      case 'Customers':
        return <Users className="text-green-600" size={18} />;
      case 'Revenue':
        return <TrendingUp className="text-purple-600" size={18} />;
      default:
        return <Activity className="text-orange-600" size={18} />;
    }
  };

  return (
    <DemoModal>
      {/* HEADER */}
      <div className="mb-6 text-left">
        <h1 className="text-xl font-semibold">RetailPro Demo</h1>
        <p className="text-sm text-gray-500">Quick preview of your dashboard</p>
      </div>

      {/* STATS */}
      <div className="mb-6 grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.id}>
            <CardContent className="flex items-center gap-3 p-4">
              {getIcon(stat.title)}
              <div>
                <p className="text-xs text-gray-500">{stat.title}</p>
                <p className="text-sm font-semibold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* CONTENT */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* INVENTORY */}
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Inventory</h2>

            <div className="space-y-2 text-sm">
              {inventory.map((item) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.name}</span>

                  <span className="flex items-center gap-2">
                    {item.stockStatus === 'low' && (
                      <AlertTriangle className="text-red-500" size={14} />
                    )}

                    <span
                      className={item.stockStatus === 'low' ? 'text-red-500' : 'text-green-600'}
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
        <Card>
          <CardContent className="p-4">
            <h2 className="mb-3 text-sm font-semibold">Recent Activity</h2>

            <div className="space-y-2 text-sm text-gray-600">
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
