import { NextResponse } from "next/server";

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

    const announcements = teacherAnnouncements.map((a) => {
      return {
        title: a.title,
        content: a.content,
        createdAt: a.createdAt.toISOString().split("T")[0],
        attachmentURL: a.attachmentURL,
        courseName: a.course.courseName,
      };
    });
    return NextResponse.json({ announcements }, { status: 201 });
  } catch (error) {
    console.error("Error fetching announcements:", error);
    return NextResponse.json(
      { message: "خطأ في جلب الإعلانات" },
      { status: 500 },
    );
  }
}
