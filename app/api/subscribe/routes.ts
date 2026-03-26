export async function GET() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;

  const res = await fetch(`${base}/api/subscribers`);
  const json = await res.json();

  return Response.json(json);
}

// ADD subscriber
export async function POST(req: Request) {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;
  const body = await req.json();

  if (!body.email) {
    return Response.json({ error: 'Email required' }, { status: 400 });
  }

  const res = await fetch(`${base}/api/subscribers`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: {
        email: body.email,
      },
    }),
  });

  const json = await res.json();

  return Response.json(json);
}
