import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // 1. التحقق من هوية المستخدم المسجل
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { message: "غير مصرح بالدخول" },
        { status: 401 },
      );
    }

    const userId = parseInt(session.user.id);
    // const userId = 17;

    const userData = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        firstName: true,
        lastName: true,
        profilePictureUrl: true,
        role: true,
        _count: {
          select: {
            alerts: {
              where: {
                isRead: false,
                OR: [
                  { alertType: "DUE_DATE_REMINDER" },
                  {
                    AND: [
                      { alertType: "NEW_CONTENT" },
                      { triggerReason: "NEW_CONTENT" },
                    ],
                  },
                ],
              },
            },
          },
        },
      },
    });

    if (!userData) {
      return NextResponse.json(
        { message: "المستخدم غير موجود" },
        { status: 404 },
      );
    }

    const announcementsCount = await prisma.AlertAndRecommendations.count({
      where: {
        userId: userId,
        isRead: false,
        alertType: "ANNOUNCEMENT",
      },
    });

    return NextResponse.json({
      fullName: `${userData.firstName} ${userData.lastName}`,
      avatar: userData.profilePictureUrl || "/default-avatar.png",
      role: userData.role,
      notifications: {
        announcementsCount: announcementsCount,
        alertsCount: userData._count.alerts,
      },
    });
  } catch (error) {
    console.error("Navbar API Error:", error);
    return NextResponse.json({ message: "خطأ في الخادم" }, { status: 500 });
  }
}
