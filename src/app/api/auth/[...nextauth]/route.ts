import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

import { Session } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: string | null; // Đảm bảo role có trong session
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
    role?: string | null;
    password?: string | null;
  }
}

declare module "next-auth/adapters" {
  interface AdapterUser {
    role?: string | null;
  }
}

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user = await prisma.user.findUnique({
          where: { email: credentials!.email },
        });

        if (!user || !user.password) return null;

        const valid = await bcrypt.compare(credentials!.password, user.password);
        if (!valid) return null;

        // Trả về đầy đủ thông tin người dùng, bao gồm role
        return { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          image: user.image,
          role: user.role, // Thêm role vào đối tượng trả về
        };
      },
    }),
  ],
  pages: {
    signIn: "/auth", // Custom auth page
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role; // Thêm role vào token
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = String(token.id);
        session.user.role = typeof token.role === "string" ? token.role : token.role ? String(token.role) : null; // Thêm role vào session
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
