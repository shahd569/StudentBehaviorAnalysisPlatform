import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json(
    //     { message: "غير مصرح لك بالقيام بهذا الإجراء" },
    //     { status: 401 },
    //   );
    // }

    const coursesInfo = await prisma.Course.findMany({
      select: {
        id: true,
        courseName: true,
        description: true,
        academicYear: true,
        semester: true,
        coursePictureUrl: true,
        instructor: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        _count: {
          select: { enrollments: true, lessons: true },
        },
      },
    });

    const courses = coursesInfo.map((course) => ({
      id: course.id,
      courseName: course.courseName,
      description: course.description,
      academicYear: course.academicYear,
      semester: course.semester,
      coursePictureUrl: course.coursePictureUrl,
      instructorName: `${course.instructor.firstName} ${course.instructor.lastName}`,
      enrollments: course._count.enrollments,
      lessons: course._count.lessons,
    }));

    return NextResponse.json({ courses });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
