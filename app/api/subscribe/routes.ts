import { subscribers } from "@/lib/store";

export async function POST(req: Request) {
  const { email } = await req.json();

  if (!email) {
    return Response.json({ error: "Email required" }, { status: 400 });
  }

  subscribers.push(email);

  return Response.json({ message: "Subscribed" });
}