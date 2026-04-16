import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { title } from "node:process";
import { time } from "node:console";

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
      recentAlertAndRecommendation,
      recentAssignmentGrade,
      recentQuizGrade,
    ] = await Promise.all([
      prisma.AlertAndRecommendations.findMany({
        where: { studentId: studentId },
        orderBy: { createdAt: "desc" },
        take: 3,
      }),
      prisma.AssignmentSubmission.findMany({
        where: { finalScore: { not: null }, studentId: studentId },
        orderBy: { submittedAt: "desc" },
        take: 3,
        select: {
          finalScore: true,
          submittedAt: true,
          assignment: {
            select: {
              title: true,
            },
          },
        },
      }),
      prisma.QuizAttempt.findMany({
        where: { studentId: studentId, finishTime: { not: null } },
        orderBy: { finishTime: "desc" },
        take: 3,
        select: {
          score: true,
          finishTime: true,
          quiz: {
            select: { title: true },
          },
        },
      }),
    ]);

    const recentGrades = [
      ...recentAssignmentGrade.map((a) => ({
        assignmentTitle: a.assignment.title,
        assignmentScore: a.finalScore,
        time: a.submittedAt,
      })),
      ...recentQuizGrade.map((q) => ({
        quizTitle: q.quiz.title,
        quizScore: q.score,
        time: q.finishTime,
      })),
    ];

    const finalFeed = recentGrades
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 3);
    return NextResponse.json({
      recentAlertAndRecommendation,
      finalFeed,
    });
  } catch (error) {
    console.error("Error fetching recent feed data:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
