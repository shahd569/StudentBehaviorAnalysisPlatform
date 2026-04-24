import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { sessionId } = await req.json();

    await prisma.userSession.update({
      where: { id: parseInt(sessionId) },
      data: {
        endTime: new Date(),
        status: "ENDED",
      },
    });

    return NextResponse.json({ message: "Session closed" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to close session" },
      { status: 500 },
    );
  }
}
