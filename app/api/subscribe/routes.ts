import { subscribers } from '@/lib/store';
import { Subscriber } from '@/app/types/store';

//  fetch all subscribers
export async function GET() {
  return Response.json({
    count: subscribers.length,
    subscribers,
  });
}

//  add new subscriber
export async function POST(req: Request) {
  const body: Subscriber = await req.json();

  // validation
  if (!body.email || typeof body.email !== 'string') {
    return Response.json(
      { error: 'Valid email is required' },
      { status: 400 }
    );
  }

  const email = body.email.toLowerCase().trim();

  // FIXED duplicate check
  const exists = subscribers.some((sub) => sub.email === email);

  if (exists) {
    return Response.json(
      { message: 'Already subscribed' },
      { status: 200 }
    );
  }

  //add new subscriber
  subscribers.push({
    id: subscribers.length + 1,
    email,
  });

  return Response.json(
    {
      message: 'Subscribed successfully',
      total: subscribers.length,
    },
    { status: 201 }
  );
}