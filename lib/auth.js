import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import { prisma } from "./prisma";
import { compare } from "bcrypt";

/** @type {import("next-auth").AuthOptions} */
export const authOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   login: "",
  // },
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
        if (!existingUser || !existingUser.hashedPassword) {
          return null;
        }
        const passwordMatch = await compare(
          credentials.password,
          existingUser.hashedPassword,
        );
        if (!passwordMatch) {
          return null;
        }
        return {
          id: existingUser.id,
          role: existingUser.role,
          email: existingUser.email,
          name: `${existingUser.firstName || ""} ${existingUser.lastName || ""}`.trim(),
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
        token.name =
          user.name || `${user.firstName || ""} ${user.lastName || ""}`.trim();
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        //token إذا كان المستخدم طالباً، نبحث عن آخر جلسة نشطة له ونضعها في الـ
        if (user.role === "STUDENT") {
          const activeSession = await prisma.UserSession.findFirst({
            where: { studentId: parseInt(user.id), status: "ACTIVE" },
            orderBy: { startTime: "desc" },
          });
          token.sessionId = activeSession?.id;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.role = token.role;
        session.user.id = token.id;
        session.user.sessionId = token.sessionId;
        session.user.name = token.name;
        session.user.firstName = token.firstName;
        session.user.lastName = token.lastName;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  events: {
    async signIn({ user }) {
      if (user.role === "STUDENT") {
        try {
          await prisma.userSession.create({
            data: {
              studentId: parseInt(user.id),
              startTime: new Date(),
              status: "ACTIVE",
            },
          });
          console.log(`تم بدء جلسة جديدة للطالب: ${user.id}`);
        } catch (error) {
          console.error("خطأ في إنشاء الجلسة:", error);
        }
      }
    },
  },
};
