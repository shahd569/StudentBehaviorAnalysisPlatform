import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { quizCorrectAnswers } = await params;
    const id = parseInt(quizCorrectAnswers);
    if (isNaN(id)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }

    const attempt = await prisma.QuizAttempt.findUnique({
      where: {
        id: id,
      },
      include: {
        quiz: {
          include: {
            questions: {
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
        },
      },
    });

    if (!attempt) {
      return NextResponse.json(
        { message: "المحاولة غير موجودة" },
        { status: 404 },
      );
    }

    //  دمج إجابات الطالب مع الأسئلة
    const questionsWithStudentAnswers = attempt.quiz.questions.map(
      (question, index) => {
        const studentAnswerIndex = attempt.submittedAnswers[index];
        const isCorrect = studentAnswerIndex === question.correctAnswerIndex;

        return {
          questionText: question.questionText,
          options: question.options,
          correctAnswer: question.correctAnswerIndex,
          studentAnswer: studentAnswerIndex,
          isCorrect: isCorrect,
          scoreValue: question.scoreValue,
        };
      },
    );
    return NextResponse.json(
      {
        courseName: attempt.quiz.lesson.course.courseName,
        score: attempt.score,
        maxScore: attempt.quiz.maxScore,
        details: questionsWithStudentAnswers,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "خطأ في جلب التفاصيل" },
      { status: 500 },
    );
  }
}
