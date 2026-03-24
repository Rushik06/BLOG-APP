import { subscribers } from "@/lib/store";

export async function GET() {
  return Response.json({
    totalSubscribers: subscribers.length,
  });
}