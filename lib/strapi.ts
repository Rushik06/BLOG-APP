const API_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337/api';

export async function fetchAPI(path: string) {
  const res = await fetch(`${API_URL}${path}`, {
    cache: 'no-store',
  });

  if (!res.ok) throw new Error('Failed to fetch');

  return res.json();
}
