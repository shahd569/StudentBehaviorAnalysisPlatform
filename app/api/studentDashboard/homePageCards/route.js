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
    const [
      activeCoursesCount,
      allStudentAssignment,
      studentAssignmentSubmissions,
      allQuizAttempt,
      userSessions,
    ] = await Promise.all([
      prisma.Enrollment.count({
        where: {
          studentId: studentId,
        },
        select: { courseId: true },
      }),
      prisma.Assignment.findMany({
        where: { lesson: { courseId: { in: courseIds } } },
        include: {
          lesson: {
            include: {
              course: true,
            },
          },
        },
      }),
      prisma.AssignmentSubmission.findMany({
        where: { studentId: studentId },
        select: { assignmentId: true, finalScore: true },
      }),
      prisma.QuizAttempt.findMany({
        where: { studentId: studentId },
        select: { score: true },
      }),
      prisma.UserSession.findMany({
        where: { studentId: studentId },
        select: { startTime: true, endTime: true, status: true },
      }),
    ]);

    // pending tasks
    const courseIds = activeCoursesCount.map((e) => e.courseId);
    const submissionsIds = studentAssignmentSubmissions.map(
      (a) => a.assignmentId,
    );

    const filteredAssignments = allStudentAssignment.filter(
      (a) => !submissionsIds.includes(a.id),
    );
    const pendingTasks = filteredAssignments.length;
    // performance avg
    const assignmentScoreSum = 0;
    const assignmentCount = 0;
    const assignment = studentAssignmentSubmissions.map((a) => {
      if (a.finalScore != null) {
        assignmentScoreSum += a.finalScore;
        assignmentCount++;
      }
    });
    const assignmentAvg = assignmentScoreSum / assignmentCount;
    const quizScoreSum = 0;
    const quizCount = 0;
    const quizzes = allQuizAttempt.map((q) => {
      if (q.score != null) {
        quizScoreSum += q.score;
        quizCount++;
      }
    });
    const quizAvg = quizScoreSum / quizCount;
    const performanceAvg = (assignmentAvg + quizAvg) / 2;

    // learning hours
    const totalLearningHours = userSessions.reduce((total, session) => {
      if (session.status === "ENDED") {
        const duration =
          (new Date(session.endTime) - new Date(session.startTime)) /
          (1000 * 60 * 60);
        return total + duration;
      }
      return total;
    }, 0);

    let learningHours;
    if (totalLearningHours < 1) {
      learningHours = `${Math.round(totalLearningHours * 60)} دقيقة`;
    } else {
      learningHours = `${Number(totalLearningHours.toFixed(1))} ساعة`;
    }

    return NextResponse.json(
      {
        activeCoursesCount: activeCoursesCount,
        pendingTasks: pendingTasks,
        performanceAvg: performanceAvg,
        learningHours: learningHours,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error fetching home page cards:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب بيانات الصفحة الرئيسية" },
      { status: 500 },
    );
  }
}
