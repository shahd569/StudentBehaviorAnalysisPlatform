import { NextResponse } from "next/server";

export async function PATCH(req) {
  const { attemptId, answers } = await req.json();

  try {
    //جلب بيانات المحاولة مع الأسئلة لحساب النتيجة
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: { include: { questions: true } } },
    });

    //  منطق حساب الدرجة (Server-side)
    let totalScore = 0;
    attempt.quiz.questions.forEach((q, index) => {
      if (answers[index] === q.correctAnswerIndex) {
        totalScore += q.scoreValue;
      }
    });

    // تحديث السجل بوقت الانتهاء والدرجة
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        finishTime: new Date(),
        score: totalScore,
        submittedAnswers: answers,
      },
    });

    return NextResponse.json({ success: true, score: totalScore });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "خطأ في الإرسال" }, { status: 500 });
  }
}
