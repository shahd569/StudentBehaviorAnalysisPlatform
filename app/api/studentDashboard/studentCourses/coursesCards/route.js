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
    const studentCoursesInfo = await prisma.Enrollment.findMany({
      where: { studentId: studentId },
      include: {
        course: {
          select: {
            id: true,
            courseName: true,
            coursePictureUrl: true,
            instructor: {
              select: {
                firstName: true,
                lastName: true,
                profilePictureUrl: true,
              },
            },
            _count: {
              select: {
                lessons: true,
              },
            },
          },
        },
      },
    });

    // معالجة البيانات لإضافة عدد الفيديوهات
    const courseWithCounts = await Promise.all(
      studentCoursesInfo.map(async (enrollment) => {
        const lessonsWithVideoCount = await prisma.Lesson.findMany({
          where: { courseId: enrollment.course.id },
          select: {
            id: true,
            _count: {
              select: {
                videos: true,
              },
            },
          },
        });

        const totalVideos = lessonsWithVideoCount.reduce(
          (sum, lesson) => sum + lesson._count.videos,
          0,
        );

        return {
          id: enrollment.course.id,
          courseName: enrollment.course.courseName,
          instructorName: `${enrollment.course.instructor.firstName} ${enrollment.course.instructor.lastName}`,
          instructorProfilePictureUrl:
            enrollment.course.instructor.profilePictureUrl,
          coursePictureUrl: enrollment.course.coursePictureUrl ?? null,
          videosCount: totalVideos,
          lessonsCount: enrollment.course._count.lessons,
          // lessonsDetails: lessonsWithVideoCount,
        };
      }),
    );
    return NextResponse.json(courseWithCounts);
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
