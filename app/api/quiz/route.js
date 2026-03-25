import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      lessonId,
      title,
      description,
      maxScore,
      timeLimit,
      startDate,
      dueDate,
      questions,
    } = body;
    const newQuiz = await prisma.Quiz.create({
      data: {
        lessonId: parseInt(lessonId),
        title: title,
        description: description,
        maxScore: parseInt(maxScore),
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswerIndex: parseInt(q.correctAnswerIndex),
            scoreValue: parseInt(q.scoreValue),
          })),
        },
      },
      include: {
        questions: true,
      },
    });
    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Quiz Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الاختبار", error: error.message },
      { status: 500 },
    );
  }
}
