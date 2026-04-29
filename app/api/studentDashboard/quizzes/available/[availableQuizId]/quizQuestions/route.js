import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { availableQuizId } = await params;
    const attemptId = parseInt(availableQuizId);

    if (isNaN(attemptId)) {
      return NextResponse.json(
        { message: "معرف المحاولة غير صالح" },
        { status: 400 },
      );
    }

    // 1. البحث عن المحاولة أولاً، ومنها نجلب الاختبار والأسئلة المرتبطة به
    const attempt = await prisma.QuizAttempt.findUnique({
      where: { id: attemptId },
      include: {
        quiz: {
          include: {
            questions: {
              select: {
                id: true,
                questionText: true,
                options: true,
                scoreValue: true,
              },
              orderBy: { id: "asc" },
            },
            lesson: {
              include: {
                course: {
                  select: { courseName: true },
                },
              },
            },
          },
        },
      },
    });

    if (!attempt || !attempt.quiz) {
      return NextResponse.json(
        { message: "المحاولة أو الاختبار غير موجود" },
        { status: 404 },
      );
    }

    // 2. تجهيز البيانات القادمة من الاختبار المرتبط بالمحاولة
    const quiz = attempt.quiz;
    const formattedQuestions = quiz.questions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      options: question.options,
      scoreValue: question.scoreValue,
    }));

    const quizInfo = {
      id: quiz.id,
      attemptId: attempt.id, // نرسل رقم المحاولة أيضاً للفرونت إند
      courseName: quiz.lesson.course.courseName,
      duration: quiz.timeLimit ?? "غير محدد",
      dueDate: quiz.dueDate,
      maxScore: quiz.maxScore,
    };

    return NextResponse.json(
      { questions: formattedQuestions, quizInfo: quizInfo },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر أثناء جلب الأسئلة" },
      { status: 500 },
    );
  }
}
