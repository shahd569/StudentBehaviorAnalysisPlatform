// import { prisma } from "@/lib/prisma";
// import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const body = await req.json();
//     const {
//       lessonId,
//       title,
//       description,
//       maxScore,
//       timeLimit,
//       startDate,
//       dueDate,
//       questions,
//     } = body;
//     const newQuiz = await prisma.Quiz.create({
//       data: {
//         lessonId: parseInt(lessonId),
//         title: title,
//         description: description,
//         maxScore: parseInt(maxScore),
//         timeLimit: timeLimit ? parseInt(timeLimit) : null,
//         startDate: new Date(startDate),
//         dueDate: new Date(dueDate),
//         questions: {
//           create: questions.map((q) => ({
//             questionText: q.questionText,
//             options: q.options,
//             correctAnswerIndex: parseInt(q.correctAnswerIndex),
//             scoreValue: parseInt(q.scoreValue),
//           })),
//         },
//       },
//       include: {
//         questions: true,
//       },
//     });
//     return NextResponse.json(newQuiz, { status: 201 });
//   } catch (error) {
//     console.error("Quiz Error:", error);
//     return NextResponse.json(
//       { message: "حدث خطأ أثناء إنشاء الاختبار", error: error.message },
//       { status: 500 },
//     );
//   }
// }

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "TEACHER") {
      return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    }

    const teacherName =
      `${session.user.firstName || ""} ${session.user.lastName || ""}`.trim() ||
      "المدرس";
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

    if (
      !lessonId ||
      !title ||
      !startDate ||
      !dueDate ||
      !questions ||
      questions.length === 0
    ) {
      return NextResponse.json(
        { error: "جميع الحقول الأساسية والأسئلة مطلوبة" },
        { status: 400 },
      );
    }

    // 1. إنشاء الاختبار مع الأسئلة المتداخلة
    const newQuiz = await prisma.quiz.create({
      data: {
        lessonId: parseInt(lessonId),
        title,
        description: description || null,
        maxScore: parseInt(maxScore),
        timeLimit: timeLimit ? parseInt(timeLimit) : null,
        startDate: new Date(startDate),
        dueDate: new Date(dueDate),
        questions: {
          create: questions.map((q) => ({
            questionText: q.questionText,
            options: q.options,
            correctAnswerIndex: parseInt(q.correctAnswerIndex), // يحفظ كـ 1 أو 2 أو 3 أو 4
            scoreValue: parseInt(q.scoreValue),
          })),
        },
      },
      include: {
        questions: true,
        lesson: {
          select: { courseId: true },
        },
      },
    });

    // 2. جلب الطلاب المسجلين في المادة
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { courseId: newQuiz.lesson.courseId },
      select: { studentId: true },
    });

    // 3. إنشاء إشعارات للطلاب
    if (enrolledStudents.length > 0) {
      const notificationsData = enrolledStudents.map((enrollment) => ({
        userId: enrollment.studentId,
        lessonId: parseInt(lessonId),
        alertType: "NEW_CONTENT",
        triggerReason: "NEW_CONTENT",
        title: `اختبار جديد: ${title}`,
        content: `تمت إضافة اختبار جديد بعنوان "${title}" بواسطة المدرس ${teacherName}. ينتهي في: ${new Date(dueDate).toLocaleDateString("ar-EG")}`,
      }));

      await prisma.alertAndRecommendations.createMany({
        data: notificationsData,
      });
    }

    return NextResponse.json(
      { message: "تم إنشاء الاختبار وإرسال الإشعارات بنجاح", data: newQuiz },
      { status: 201 },
    );
  } catch (error) {
    console.error("Quiz Error:", error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء إنشاء الاختبار", error: error.message },
      { status: 500 },
    );
  }
}
