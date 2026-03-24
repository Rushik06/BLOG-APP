import { subscribers } from "@/lib/store";

interface SubscribeBody {
  email: string;
}

// GET 
export async function GET() {
  return Response.json({
    count: subscribers.length,
    subscribers,
  });
}

// POST 
export async function POST(req: Request) {
  const body: SubscribeBody = await req.json();

  // validation
  if (!body.email || typeof body.email !== "string") {
    return Response.json(
      { error: "Valid email is required" },
      { status: 400 }
    );
  }

  const email = body.email.toLowerCase().trim();

  if (subscribers.includes(email)) {
    return Response.json(
      { message: "Already subscribed" },
      { status: 200 }
    );
  }

  subscribers.push(email);

  return Response.json(
    {
      message: "Subscribed successfully",
      total: subscribers.length,
    },
    { status: 201 }
  );
}