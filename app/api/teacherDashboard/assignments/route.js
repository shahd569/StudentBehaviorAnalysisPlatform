import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || session.user.role !== "TEACHER") {
    //   return NextResponse.json({ message: "غير مسموح" }, { status: 401 });
    // }
    // const teacherId = parseInt(session.user.id);
    const teacherId = 17;

    const assignments = await prisma.Assignment.findMany({
      where: {
        lesson: {
          course: {
            instructorId: teacherId,
          },
        },
      },
      include: {
        lesson: {
          select: {
            course: {
              select: {
                courseName: true,
                _count: {
                  select: { enrollments: true },
                },
              },
            },
          },
        },

        _count: {
          select: { submissions: true },
        },
      },
    });
    const formattedAssignments = assignments.map((assignment) => {
      const totalStudents = assignment.lesson.course._count.enrollments;
      const submittedCount = assignment._count.submissions;
      const notSubmittedCount = totalStudents - submittedCount;
      return {
        id: assignment.id,
        title: assignment.title,
        courseName: assignment.lesson.course.courseName,
        totalStudents: totalStudents,
        submittedCount: submittedCount,
        notSubmittedCount: notSubmittedCount < 0 ? 0 : notSubmittedCount, // لم يتم التسليم
      };
    });
    return NextResponse.json(
      { assignments: formattedAssignments },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching assignments:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب بيانات الواجبات" },
      { status: 500 },
    );
  }
}
