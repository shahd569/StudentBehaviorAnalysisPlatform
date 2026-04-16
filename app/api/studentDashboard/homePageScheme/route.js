import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

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

    const assignmentSubmissions = await prisma.AssignmentSubmission.findMany({
      where: { studentId: studentId, finalScore: { not: null } },
      select: {
        assignmentId: true,
        finalScore: true,
        assignment: {
          select: {
            lesson: {
              select: {
                course: {
                  select: {
                    courseName: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const studentPerformanceInfo = assignmentSubmissions.map((a) => {
      return {
        courseName: a.assignment.lesson.course.courseName,
        finalScore: a.finalScore,
      };
    });

    return NextResponse.json({ studentPerformanceInfo });
  } catch (error) {
    console.error("Error fetching student performance info:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
