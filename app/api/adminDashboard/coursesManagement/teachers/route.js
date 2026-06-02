import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 401 },
      );
    }

    const teachersInfo = await prisma.Users.findMany({
      where: { role: "TEACHER" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
      },
    });

    return NextResponse.json({ teachersInfo });
  } catch (error) {
    console.error(error);
  }
}
