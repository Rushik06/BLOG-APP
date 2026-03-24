import { subscribers } from '@/lib/store';

export async function GET() {
  try {
    return Response.json({
      totalSubscribers: subscribers.length,
    });
  } catch (error) {
    console.error('Stats API error:', error);

    return Response.json({ totalSubscribers: 0 }, { status: 500 });
  }
}
