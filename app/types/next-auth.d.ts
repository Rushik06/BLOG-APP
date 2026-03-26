import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      jwt?: string;
    };
  }

  interface User {
    jwt?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    jwt?: string;
  }
}