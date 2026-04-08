import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    await prisma.userSession.updateMany({
      where: {
        studentId: parseInt(session.user.id),
        status: "ACTIVE",
      },
      data: {
        endTime: new Date(),
        status: "ENDED",
      },
    });
  }
  return NextResponse.json({ success: true });
}
