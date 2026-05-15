import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
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

    // const studentId = parseInt(session?.user.id);
    const studentId = 15;

    // جلب جميع الدورات المسجل فيها الطالب
    const enrollments = await prisma.Enrollment.findMany({
      where: { studentId: studentId },
      select: { courseId: true },
    });

    const courseIds = enrollments.map((e) => e.courseId);

    // جلب جميع الاختبارات في الدورات المسجل فيها الطالب
    const allQuizzes = await prisma.Quiz.findMany({
      where: {
        lesson: {
          courseId: { in: courseIds },
        },
      },
      include: {
        lesson: {
          include: {
            course: true,
          },
        },
        questions: true,
      },
    });

    // جلب الاختبارات التي قدمها الطالب بالفعل
    const attemptedQuizIds = await prisma.QuizAttempt.findMany({
      where: { studentId: studentId },
      select: { quizId: true },
    });

    const attemptedIds = attemptedQuizIds.map((a) => a.quizId);

    // تصفية الاختبارات التي لم يقدمها الطالب
    const unattemptedQuizzes = allQuizzes.filter(
      (quiz) => !attemptedIds.includes(quiz.id),
    );

    const formattedQuizzes = unattemptedQuizzes.map((q) => {
      const currentDate = new Date();
      const isAvailable = currentDate <= q.dueDate;
      const status = isAvailable ? "متاح" : "غير متاح";

      return {
        id: q.id,
        courseId: q.lesson.course.id,
        lessonId: q.lessonId,
        title: q.title,
        courseName: q.lesson.course.courseName,
        maxScore: q.maxScore,
        duration: q.timeLimit ? q.timeLimit : "غير محدد",
        startDate: q.startDate
          ? q.startDate.toISOString().split("T")[0]
          : "غير محدد",
        endDate: q.dueDate ? q.dueDate.toISOString().split("T")[0] : "غير محدد",
        status: status,
      };
    });

    return NextResponse.json({ quizzes: formattedQuizzes });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return NextResponse.json(
      { message: "خطأ في جلب الاختبارات" },
      { status: 500 },
    );
  }
}
