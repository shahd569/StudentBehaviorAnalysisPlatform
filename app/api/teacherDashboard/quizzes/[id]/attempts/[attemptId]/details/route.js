import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { attemptId } = await params;
    const aId = parseInt(attemptId);
    if (isNaN(quizId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }

    const attempt = await prisma.QuizAttempt.findUnique({
      where: {
        id: aId,
      },
      include: {
        student: {
          select: {
            firstName: true,
            lastName: true,
          },
        },
        quiz: {
          include: {
            questions: true,
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
        studentName: `${attempt.student.firstName} ${attempt.student.lastName}`,
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
