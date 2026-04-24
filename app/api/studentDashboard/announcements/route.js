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
    const enrollments = await prisma.Enrollment.findMany({
      where: {
        studentId: studentId,
      },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);

    const announcements = await prisma.Announcement.findMany({
      where: {
        OR: [{ courseId: { in: courseIds } }, { courseId: null }],
      },
      select: {
        content: true,
        createdAt: true,
        attachmentURL: true,
        title: true,
        course: {
          select: {
            instructor: {
              select: {
                firstName: true,
                lastName: true,
              },
            },
          },
        },
      },
    });
    const announcementInfo = announcements.map((a) => {
      return {
        title: a.title,
        content: a.content,
        createdAt: a.createdAt,
        attachmentURL: a.attachmentURL,
        teacherName: a.course
          ? `${a.course.instructor.firstName} ${a.course.instructor.lastName}`
          : null,
      };
    });
    return NextResponse.json({ announcementInfo });
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}
