import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  const { quizId } = await req.json();

  if (!session)
    return NextResponse.json({ message: "غير مصرح" }, { status: 401 });

  try {
    // إنشاء سجل محاولة جديد بوقت البدء الحالي
    const attempt = await prisma.quizAttempt.create({
      data: {
        quizId: parseInt(quizId),
        studentId: parseInt(session.user.id),
        // studentId: 15,
        startTime: new Date(),
        submittedAnswers: [],
      },
    });

    return NextResponse.json({ attemptId: attempt.id }, { status: 201 });
  } catch (error) {
    const existingAttempt = await prisma.quizAttempt.findUnique({
      where: {
        studentId_quizId: {
          studentId: parseInt(session.user.id),
          //   studentId: 15,
          quizId: parseInt(quizId),
        },
      },
    });
    return NextResponse.json(
      { attemptId: existingAttempt.id },
      { status: 200 },
    );
  }
}
