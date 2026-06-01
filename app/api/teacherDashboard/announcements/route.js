import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user || session.user.role !== "STUDENT") {
    //   return NextResponse.json(
    //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
    //     { status: 401 },
    //   );
    // }

    // const teacherId = parseInt(session?.user.id);
    const teacherId = 17;

    const adminAlerts = await prisma.AlertAndRecommendations.findMany({
      where: {
        userId: teacherId,
        alertType: "ANNOUNCEMENT", // الفئة الخاصة بالإعلانات
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        isRead: true,
        announcement: {
          select: {
            id: true,
            title: true,
            content: true,
            createdAt: true,
            attachmentURL: true,
            creator: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });

    const adminAnnouncements = adminAlerts
      .filter((alert) => alert.announcement !== null)
      .map((alert) => ({
        id: alert.announcement.id,
        title: alert.announcement.title,
        content: alert.announcement.content,
        createdAt: alert.announcement.createdAt,
        attachmentURL: alert.announcement.attachmentURL,
        senderName: alert.announcement.creator
          ? `المشرف: ${alert.announcement.creator.firstName} ${alert.announcement.creator.lastName}`
          : "إدارة المنصة",
        isRead: alert.isRead,
      }));

    const teacherAnnouncements = await prisma.Announcement.findMany({
      where: {
        course: {
          instructorId: teacherId,
        },
      },
      include: {
        course: {
          select: {
            courseName: true,
          },
        },
      },
    });

    const myAnnouncements = teacherAnnouncements.map((a) => {
      return {
        title: a.title,
        content: a.content,
        createdAt: a.createdAt.toISOString().split("T")[0],
        attachmentURL: a.attachmentURL,
        courseName: a.course.courseName,
      };
    });
    return NextResponse.json(
      { adminAnnouncements, myAnnouncements },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { message: "خطأ في جلب الإعلانات" },
      { status: 500 },
    );
  }
}
