import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { signIn } from "next-auth/react";
import { prisma } from "./prisma";
import { compare } from "bcrypt";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  //   pages:{
  //     signIn:""
  //   },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "sam@gmail.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        const existingUser = await prisma.Users.findUnique({
          where: { email: credentials?.email },
        });
        if (!existingUser || !existingUser.password) {
          return null;
        }
        const passwordMatch = await compare(
          credentials.password,
          existingUser.password
        );
        if (!passwordMatch) {
          return null;
        }
        return {
          id: existingUser.id,
          role: existingUser.role,
          email: existingUser.email,
          firstName: existingUser.firstName,
          lastName: existingUser.lastName,
          profilePictureUrl: existingUser.profilePictureUrl,
          universityId: existingUser.universityId,
          college: existingUser.college,
          major: existingUser.major,
          academicYear: existingUser.academicYear,
          employeeId: existingUser.employeeId,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
