import NextAuth, { type DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";
import { z } from "zod";

// TypeScript Augmentation for session / token properties
declare module "next-auth" {
  interface User {
    id?: string;
    panCard?: string;
    role?: string;
  }
  interface Session {
    user: {
      id: string;
      panCard: string;
      role: string;
    } & DefaultSession["user"];
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id?: string;
    panCard?: string;
    role?: string;
  }
}

const loginSchema = z.object({
  panCard: z.string().min(1),
  password: z.string().min(1),
});

export const { auth, signIn, signOut, handlers } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = loginSchema.safeParse(credentials);

        if (parsedCredentials.success) {
          const { panCard, password } = parsedCredentials.data;
          
          // Capitalize and trim PAN card
          const formattedPan = panCard.trim().toUpperCase();

          const user = await db.user.findUnique({
            where: { panCard: formattedPan },
          });

          if (!user) return null;

          const passwordsMatch = await bcrypt.compare(password, user.password);

          if (passwordsMatch) {
            return {
              id: user.id,
              panCard: user.panCard,
              role: user.role,
            };
          }
        }

        return null;
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.panCard = user.panCard;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.panCard = token.panCard as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  session: { strategy: "jwt" },
});
