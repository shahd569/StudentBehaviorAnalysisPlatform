import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = getServerSession(authOptions);
    // if (!session || !session.user || session.user.role !== "STUDENT") {
    //   return NextResponse.json(
    //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
    //     { status: 401 },
    //   );
    // }
    // const studentId = parseInt(session.user.id);
    const studentId = 15;

    const notifications = await prisma.AlertAndRecommendations.findMany({
      where: {
        userId: studentId,
        OR: [
          {
            alertType: "NEW_CONTENT",
            triggerReason: "NEW_CONTENT",
          },
          {
            alertType: "DUE_DATE_REMINDER",
            triggerReason: "LATE_SUBMISSION",
          },
        ],
      },
      select: {
        id: true,
        content: true,
        createdAt: true,
        isRead: true,
        title: true,
        alertType: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json({ notifications });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}
