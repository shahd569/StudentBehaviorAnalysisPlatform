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
        where: {
          studentId: studentId,
          startTime: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
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
    studentAssignmentSubmissions.forEach((a) => {
      if (a.finalScore != null) {
        assignmentScoreSum += a.finalScore;
        assignmentCount++;
      }
    });
    const assignmentAvg = assignmentScoreSum / assignmentCount;
    let quizScoreSum = 0;
    let quizCount = 0;
    allQuizAttempt.forEach((q) => {
      if (q.score != null) {
        quizScoreSum += q.score;
        quizCount++;
      }
    });
    const quizAvg = quizScoreSum / quizCount;
    const performanceAvg = (assignmentAvg + quizAvg) / 2;

    // learning hours
    const validSessions = userSessions
      .filter((session) => session.status === "ENDED")
      .map((session) => ({
        start: new Date(session.startTime).getTime(),
        end: new Date(session.endTime).getTime(),
      }))
      .filter(
        (interval) =>
          !Number.isNaN(interval.start) &&
          !Number.isNaN(interval.end) &&
          interval.end > interval.start,
      )
      .sort((a, b) => a.start - b.start);

    const mergedIntervals = [];
    for (const interval of validSessions) {
      const last = mergedIntervals[mergedIntervals.length - 1];
      if (!last || interval.start > last.end) {
        mergedIntervals.push({ ...interval });
      } else {
        last.end = Math.max(last.end, interval.end);
      }
    }

    const totalLearningHours = mergedIntervals.reduce(
      (total, interval) =>
        total + (interval.end - interval.start) / (1000 * 60 * 60),
      0,
    );

    const cappedTotalHours = Math.min(totalLearningHours, 168);

    let learningHours;
    const hours = Math.floor(cappedTotalHours);
    const minutes = Math.round((cappedTotalHours - hours) * 60);
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
