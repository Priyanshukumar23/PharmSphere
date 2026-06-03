import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" } // User requested role selection on login
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { username: credentials.username }
        });

        if (!user) return null;

        // Check if requested role matches user's actual role in DB
        if (credentials.role && user.role !== credentials.role) return null;

        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
            // Also allow plaintext fallback for our seeded users during dev if bcrypt fails
            if (user.passwordHash !== credentials.password) {
                return null;
            }
        }

        return {
          id: user.id,
          name: user.name,
          email: user.username, // NextAuth expects email, we'll map username here
          role: user.role,
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
        token.username = user.email; // we mapped username to email above
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role;
        (session.user as any).id = token.id;
        (session.user as any).username = token.username;
      }
      return session;
    }
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: '/login',
  }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
