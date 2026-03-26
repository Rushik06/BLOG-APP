import NextAuth, { type AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import type { StrapiAuthResponse } from "@/app/types/auth";

const STRAPI_URL =
  process.env.NEXT_PUBLIC_STRAPI_BASE || "http://localhost:1337";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        if (!credentials?.identifier || !credentials.password) {
          return null;
        }

        const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            identifier: credentials.identifier,
            password: credentials.password,
          }),
        });

        const data: StrapiAuthResponse = await res.json();

        if (!res.ok || !data.user) return null;

        return {
          id: String(data.user.id),
          name: data.user.username,
          email: data.user.email,
          jwt: data.jwt,
        };
      },
    }),
  ],

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      if (user?.jwt) {
        token.jwt = user.jwt;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user && token.jwt) {
        session.user.jwt = token.jwt;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };