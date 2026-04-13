import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { availableQuizId } = await params;
    const quizId = parseInt(availableQuizId);
    if (isNaN(quizId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }
    // جلب أسئلة الاختبار المحدد
    const quiz = await prisma.Quiz.findUnique({
      where: {
        id: quizId,
      },
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
              select: {
                courseName: true,
              },
            },
          },
        },
      },
    });
    if (!quiz) {
      return NextResponse.json(
        { message: "الاختبار غير موجود" },
        { status: 404 },
      );
    }
    const formattedQuestions = quiz.questions.map((question) => ({
      id: question.id,
      questionText: question.questionText,
      options: question.options,
      scoreValue: question.scoreValue,
    }));

    const quizInfo = {
      courseName: quiz.lesson.course.courseName,
      duration: quiz.timeLimit ?? "غير محدد",
      dueDate: quiz.dueDate,
      maxScore: quiz.maxScore,
    };

    return NextResponse.json(
      { questions: formattedQuestions, quizInfo },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching quiz questions:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب أسئلة الاختبار" },
      { status: 500 },
    );
  }
}
