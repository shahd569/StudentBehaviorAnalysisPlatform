import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";

export async function PUT(req) {
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
    const { announcementId } = await req.json();

    await prisma.AlertAndRecommendations.updateMany({
      where: {
        userId: studentId,
        alertType: "ANNOUNCEMENT",
        announcementId: announcementId,
      },
      data: {
        isRead: true,
      },
    });

    return NextResponse.json({ message: "updated" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "error" }, { status: 500 });
  }
}
