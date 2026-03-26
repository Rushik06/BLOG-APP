export async function GET() {
  const base = process.env.NEXT_PUBLIC_STRAPI_URL;

  const res = await fetch(`${base}/subscribers?pagination[pageSize]=1`);

  const json = await res.json();

  return Response.json({
    totalSubscribers: json.meta.pagination.total,
  });
}
