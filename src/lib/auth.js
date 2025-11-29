import { PrismaAdapter } from "@next-auth/prisma-adapter";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "./prisma";
import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    // Google OAuth (only add if env vars are set)
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? (console.log("Initializing Google Provider"), [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          allowDangerousEmailAccountLinking: true,
          authorization: {
            params: {
              prompt: "select_account",
            },
          },
        }),
      ])
      : []),

    // Credentials (email + password)
    Credentials({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username or Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          },
        });

        if (!user) throw new Error("User not found");

        if (user.status === "banned") throw new Error("Your account has been banned");
        if (user.status === "inactive") throw new Error("Your account is inactive");

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) throw new Error("Invalid password");

        return user;
      },
    }),
  ],

  // Session config
  session: { strategy: "jwt" },

  // Callbacks
  callbacks: {
    async signIn({ user, account }) {
      // ตรวจสอบว่ามี user อยู่แล้วหรือยัง
      let existingUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (!existingUser) {
        // If user does not exist, deny access
        throw new Error("User not found");
      }

      if (existingUser.status === "banned") throw new Error("Your account has been banned");
      if (existingUser.status === "inactive") throw new Error("Your account is inactive");

      // upsert account
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: account.provider,
            providerAccountId: account.providerAccountId,
          },
        },
        update: {
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
        },
        create: {
          userId: existingUser.id,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          type: account.type,
          accessToken: account.access_token,
          idToken: account.id_token,
          refreshToken: account.refresh_token,
        },
      });

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.fullName || user.name;
        token.picture = user.avatarUrl || user.image;
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.email = token.email;
        session.user.name = token.name;
        session.user.image = token.picture;
        session.user.role = token.role;
      }
      return session;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
