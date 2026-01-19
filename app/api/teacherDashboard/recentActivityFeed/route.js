import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "غير مسموح لك بالوصول لهذه البيانات" },
        { status: 401 },
      );
    }

    const teacherId = parseInt(session.user.id);

    // const teacherId = 17;

    const recentAssignment = await prisma.AssignmentSubmission.findMany({
      take: 5,
      orderBy: { submittedAt: "desc" },
      where: {
        assignment: {
          lesson: {
            course: {
              instructorId: teacherId,
            },
          },
        },
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, profilePictureUrl: true },
        },
        assignment: { select: { title: true } },
      },
    });

    const recentQuizzes = await prisma.QuizAttempt.findMany({
      take: 5,
      orderBy: { finishTime: "desc" },
      where: {
        quiz: {
          lesson: {
            course: {
              instructorId: teacherId,
            },
          },
        },
        finishTime: { not: null },
      },
      include: {
        student: {
          select: { firstName: true, lastName: true, profilePictureUrl: true },
        },
        quiz: { select: { title: true } },
      },
    });

    const combinedActivity = [
      ...recentAssignment.map((item) => ({
        id: `assign-${item.id}`,
        type: "assignment",
        studentName: `${item.student.firstName} ${item.student.lastName}`,
        image: item.student.profilePictureUrl,
        action: `سلم واجب:${item.assignment.title}`,
        time: item.submittedAt,
      })),
      ...recentQuizzes.map((item) => ({
        id: `quiz-${item.id}`,
        type: "quiz",
        studentName: `${item.student.firstName} ${item.student.lastName}`,
        image: item.student.profilePictureUrl,
        action: `انهى اختبار:${item.quiz.title}`,
        time: item.finishTime,
        grade: item.score,
      })),
    ];

    const finalFeed = combinedActivity
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 5);

    return NextResponse.json({ activities: finalFeed }, { status: 200 });
  } catch (error) {
    console.error(error);
    NextResponse.json({ message: "فشل الحصول على البيانات" }, { status: 500 });
  }
}
