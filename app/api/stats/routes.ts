import { subscribers, users, orders, revenue } from '@/lib/store';

export async function GET() {
  return Response.json({
    totalSubscribers: subscribers.length,
    totalUsers: users.length,
    totalOrders: orders.length,
    totalRevenue: revenue,
  });
}
