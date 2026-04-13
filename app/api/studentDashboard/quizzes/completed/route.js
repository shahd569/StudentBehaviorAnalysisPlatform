import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  // const session = await getServerSession(authOptions);
  // if (!session || !session.user || session.user.role !== "TEACHER") {
  //   return NextResponse.json({ message: "غير مسموح" }, { status: 401 });
  // }
  // const studentId = parseInt(session.user.id);
  const studentId = 15;
  try {
    const quizzes = await prisma.QuizAttempt.findMany({
      where: {
        studentId: studentId,
      },
      include: {
        quiz: {
          select: {
            title: true,
            maxScore: true,
            lesson: {
              select: {
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

    const formattedQuizzes = quizzes.map((q) => {
      let duration = "غير محدد";

      if (q.startTime && q.finishTime) {
        const diffInMs = new Date(q.finishTime) - new Date(q.startTime);
        const totalMinutes = Math.round(diffInMs / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;

        if (hours > 0) {
          duration = `${hours} ساعة و${minutes} دقائق`;
        } else {
          duration = `${minutes} دقيقة`;
        }
      }

      return {
        title: q.quiz.title,
        courseName: q.quiz.lesson.course.courseName,
        date: q.startTime,
        score: `${q.score} / ${q.quiz.maxScore}`,
        duration: duration,
      };
    });
    return NextResponse.json(
      { completedQuizzes: formattedQuizzes },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching quizzes info:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب الاختبارات" },
      { status: 500 },
    );
  }
}
