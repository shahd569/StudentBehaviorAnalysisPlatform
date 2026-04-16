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
    const enrollments = await prisma.Enrollment.findMany({
      where: {
        studentId: studentId,
      },
      select: { courseId: true },
    });
    const courseIds = enrollments.map((e) => e.courseId);
    const [
      allStudentAssignment,
      studentAssignmentSubmissions,
      allStudentQuizzes,
      allQuizAttempt,
    ] = await Promise.all([
      prisma.Assignment.findMany({
        where: { lesson: { courseId: { in: courseIds } } },
        select: {
          id: true,
          title: true,
          deliveryDate: true,
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
        orderBy: { deliveryDate: "desc" },
      }),
      prisma.AssignmentSubmission.findMany({
        where: { studentId: studentId },
        select: { assignmentId: true },
      }),
      prisma.Quiz.findMany({
        where: { lesson: { courseId: { in: courseIds } } },
        select: {
          id: true,
          title: true,
          dueDate: true,
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
        orderBy: { dueDate: "desc" },
      }),
      prisma.QuizAttempt.findMany({
        where: { studentId: studentId },
      }),
    ]);
    const submissionsIds = studentAssignmentSubmissions.map(
      (a) => a.assignmentId,
    );

    const filteredAssignments = allStudentAssignment.filter(
      (a) =>
        !submissionsIds.includes(a.id) && new Date(a.deliveryDate) > new Date(),
    );

    const solvedQuizzesIds = allQuizAttempt.map((q) => q.quizId);

    const filteredQuizzes = allStudentQuizzes.filter(
      (a) =>
        !solvedQuizzesIds.includes(a.id) && new Date(a.dueDate) > new Date(),
    );

    const getRemainingMs = (targetDate) => new Date(targetDate) - new Date();

    const formatTimeRemaining = (targetDate) => {
      const diffMs = getRemainingMs(targetDate);
      if (diffMs <= 0) {
        return "انتهى";
      }

      const totalMinutes = Math.ceil(diffMs / (1000 * 60));
      if (totalMinutes < 60) {
        return `${totalMinutes} دقيقة`;
      }

      const totalHours = Math.floor(totalMinutes / 60);
      const minutes = totalMinutes % 60;
      if (totalHours < 24) {
        if (minutes === 0) {
          return `${totalHours} ساعة`;
        }
        return `${totalHours} ساعة و ${minutes} دقيقة`;
      }

      const days = Math.floor(totalHours / 24);
      return `${days} ${days === 1 ? "يوم" : "أيام"}`;
    };

    const finalData = [
      ...filteredAssignments.map((a) => ({
        assignmentTitle: a.title,
        courseName: a.lesson.course.courseName,
        timeRemaining: formatTimeRemaining(a.deliveryDate),
        _remainingMs: getRemainingMs(a.deliveryDate),
      })),
      ...filteredQuizzes.map((q) => ({
        quizTitle: q.title,
        courseName: q.lesson.course.courseName,
        timeRemaining: formatTimeRemaining(q.dueDate),
        _remainingMs: getRemainingMs(q.dueDate),
      })),
    ]
      .sort((a, b) => a._remainingMs - b._remainingMs)
      .map(({ _remainingMs, ...rest }) => rest);
    return NextResponse.json({ finalData });
  } catch (error) {
    console.error("Error fetching time line data:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
