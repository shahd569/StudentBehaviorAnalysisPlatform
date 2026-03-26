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

    const quizzes = await prisma.Quiz.findMany({
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
                  select: {
                    enrollments: true,
                  },
                },
              },
            },
          },
        },
        _count: {
          select: { attempts: true },
        },
        attempts: {
          select: {
            score: true,
          },
        },
      },
      orderBy: {
        startDate: "desc",
      },
    });
    const formattedQuizzes = quizzes.map((quiz) => {
      const now = new Date();
      const totalStudents = quiz.lesson.course._count.enrollments;
      const completedCount = quiz._count.attempts;

      // حساب متوسط العلامات
      const scores = quiz.attempts
        .filter((a) => a.score !== null)
        .map((a) => a.score);
      const averageScore =
        scores.length > 0
          ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(2)
          : 0;

      // تحديد حالة الاختبار
      let status = "نشط";
      if (now < new Date(quiz.startDate)) status = "لم يبدأ بعد";
      if (now > new Date(quiz.dueDate)) status = "منتهي";

      return {
        id: quiz.id,
        title: quiz.title,
        courseName: quiz.lesson.course.courseName,
        duration: quiz.timeLimit ? `${quiz.timeLimit} دقيقة` : "مفتوح",
        totalStudents: totalStudents,
        completedCount: completedCount,
        notCompletedCount: totalStudents - completedCount,
        averageScore: averageScore,
        startDate: quiz.startDate,
        dueDate: quiz.dueDate,
        status: status,
      };
    });
    return NextResponse.json({ quizzes: formattedQuizzes }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب بيانات الاختبارات" },
      { status: 500 },
    );
  }
}
