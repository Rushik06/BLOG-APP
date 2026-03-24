const API_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337/api";

export async function fetchAPI<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(process.env.STRAPI_API_TOKEN && {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      }),
    },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    console.error(
      "API Error:",
      res.status,
      res.statusText,
      `${API_URL}${path}`
    );
    throw new Error(`Failed to fetch: ${res.status}`);
  }

  return res.json() as Promise<T>;
}