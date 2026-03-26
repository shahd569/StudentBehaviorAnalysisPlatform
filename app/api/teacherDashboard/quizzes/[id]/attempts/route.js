import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const quizId = parseInt(id);
    if (isNaN(quizId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }
    const attempts = await prisma.QuizAttempt.findMany({
      where: {
        quizId: quizId,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
            attempt: true,
          },
        },
        quiz: {
          select: {
            maxScore: true,
          },
        },
      },
      orderBy: {
        startTime: "desc",
      },
    });
    const formattedAttempts = attempts.map((attempt) => {
      let duration = "غير محدد";
      if (attempt.startTime && attempt.finishTime) {
        const diffInMs =
          new Date(attempt.finishTime) - new Date(attempt.startTime);
        duration = Math.floor(diffInMs / (1000 * 60)) + " دقيقة";
      }
      return {
        id: attempt.id,
        studentName: `${attempt.student.firstName} ${attempt.student.lastName}`,
        startTime: attempt.startTime,
        finishTime: attempt.finishTime,
        score:
          attempt.score !== null
            ? `${attempt.score} / ${attempt.quiz.maxScore}`
            : "لم يقدم بعد",
        status: attempt
          ? attempt.finishTime
            ? "مكتمل"
            : "قيد التقديم"
          : "لم يبدأ",
        duration: duration,
      };
    });
    return NextResponse.json({ attempts: formattedAttempts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب محاولات الطلاب" },
      { status: 500 },
    );
  }
}
