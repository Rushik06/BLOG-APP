import { LoginResponse } from '@/app/types/auth';

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

export async function loginUser(
  identifier: string,
  password: string
): Promise<LoginResponse> {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      identifier,
      password,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data?.error?.message || "Login failed");
  }

  return data as LoginResponse;
}