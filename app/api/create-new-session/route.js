// app/api/create-new-session/route.js
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "STUDENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const newSession = await prisma.UserSession.create({
    data: {
      studentId: parseInt(session.user.id),
      startTime: new Date(),
      status: "ACTIVE",
    },
  });

  return NextResponse.json({ sessionId: newSession.id });
}
