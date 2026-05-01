import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req) {
  const { attemptId, answers } = await req.json();
  const attemptIdInt = parseInt(attemptId);

  try {
    //جلب بيانات المحاولة مع الأسئلة لحساب النتيجة
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptIdInt },
      include: {
        quiz: {
          include: {
            questions: {
              orderBy: { id: "asc" }, // ✅ الحل هنا
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

    //  منطق حساب الدرجة (Server-side)
    let totalScore = 0;
    attempt.quiz.questions.forEach((q) => {
      if (answers[String(q.id)] === q.correctAnswerIndex) {
        totalScore += q.scoreValue;
      }
    });

    const answersArray = attempt.quiz.questions.map((q) => {
      return answers[String(q.id)] ?? 0;
    });

    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptIdInt },
      data: {
        finishTime: new Date(),
        score: totalScore,
        submittedAnswers: answersArray,
      },
    });
    console.log("answers raw:", answers);
    console.log(
      "question ids:",
      attempt.quiz.questions.map((q) => q.id),
    );
    return NextResponse.json({ success: true, score: totalScore });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطأ في الإرسال" }, { status: 500 });
  }
}
