import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "STUDENT") {
      return NextResponse.json(
        { message: "غير مسموح لك بالوصول لهذه البيانات" },
        { status: 401 },
      );
    }
    const studentId = parseInt(session.user.id);
    // const studentId = 15;
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
      allQuizAttempt,
      userSessions,
    ] = await Promise.all([
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
    const submissionsIds = studentAssignmentSubmissions.map(
      (a) => a.assignmentId,
    );

    const filteredAssignments = allStudentAssignment.filter(
      (a) =>
        !submissionsIds.includes(a.id) && new Date(a.deliveryDate) > new Date(),
    );
    const pendingTasks = filteredAssignments.length;
    // performance avg
    let assignmentScoreSum = 0;
    let assignmentCount = 0;
    const assignment = studentAssignmentSubmissions.map((a) => {
      if (a.finalScore != null) {
        assignmentScoreSum += a.finalScore;
        assignmentCount++;
      }
    });
    const assignmentAvg = assignmentScoreSum / assignmentCount;
    let quizScoreSum = 0;
    let quizCount = 0;
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
    const hours = Math.floor(totalLearningHours);
    const minutes = Math.round((totalLearningHours - hours) * 60);
    if (hours > 0) {
      learningHours = `${hours}h`;
    } else {
      learningHours = `${minutes}m`;
    }

    return NextResponse.json(
      {
        activeCoursesCount: courseIds.length,
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
