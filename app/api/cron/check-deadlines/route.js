import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req) {
  // أمان: التأكد من أن الطلب قادم من السيرفر فقط وليس من أي مستخدم
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("غير مصرح", { status: 401 });
  }

  try {
    const twentyFourHoursFromNow = new Date(Date.now() + 24 * 60 * 60 * 1000);

    // 1. جلب الواجبات التي ستنتهي خلال 24 ساعة
    const upcomingAssignments = await prisma.Assignment.findMany({
      where: {
        deliveryDate: {
          lte: twentyFourHoursFromNow,
          gt: new Date(), // لم تنتهِ بعد
        },
      },
      include: {
        lesson: { include: { course: { include: { enrollments: true } } } },
      },
    });

    // 1. جلب الاختبارات التي ستنتهي خلال 24 ساعة
    const upcomingQuizzes = await prisma.Quiz.findMany({
      where: {
        dueDate: {
          lte: twentyFourHoursFromNow,
          gt: new Date(), // لم تنتهِ بعد
        },
      },
      include: {
        lesson: { include: { course: { include: { enrollments: true } } } },
      },
    });

    // 2. لكل واجب، نجد الطلاب الذين لم يسلموا
    for (const assignment of upcomingAssignments) {
      const enrolledStudents = assignment.lesson.course.enrollments.map(
        (e) => e.studentId,
      );

      const submittedStudents = await prisma.AssignmentSubmission.findMany({
        where: { assignmentId: assignment.id },
        select: { studentId: true },
      });
      const submittedIds = submittedStudents.map((s) => s.studentId);

      const lateStudents = enrolledStudents.filter(
        (id) => !submittedIds.includes(id),
      );

      // 3. إنشاء تنبيه لكل طالب متأخر
      await prisma.AlertAndRecommendations.createMany({
        data: lateStudents.map((studentId) => ({
          userId: studentId,
          alertType: "DUE_DATE_REMINDER",
          triggerReason: "LATE_SUBMISSION",
          title: "تنبيه موعد تسليم",
          content: `بقي أقل من 24 ساعة لتسليم واجب: ${assignment.title}`,
          lessonId: assignment.lessonId,
        })),
      });
    }

    // 2. لكل اختبار نجد الطلاب الذين لم يقدموا
    for (const quiz of upcomingQuizzes) {
      const enrolledStudents = quiz.lesson.course.enrollments.map(
        (e) => e.studentId,
      );

      const submittedStudents = await prisma.QuizAttempt.findMany({
        where: { quizId: quiz.id },
        select: { studentId: true },
      });
      const submittedIds = submittedStudents.map((s) => s.studentId);

      const lateStudents = enrolledStudents.filter(
        (id) => !submittedIds.includes(id),
      );

      // 3. إنشاء تنبيه لكل طالب متأخر
      await prisma.AlertAndRecommendations.createMany({
        data: lateStudents.map((studentId) => ({
          userId: studentId,
          alertType: "DUE_DATE_REMINDER",
          triggerReason: "LATE_SUBMISSION",
          title: "تنبيه موعد تقديم اختبار",
          content: `بقي أقل من 24 ساعة لنهاية الوقت المسموح به للتقدم لاختبار: ${quiz.title}`,
          lessonId: quiz.lessonId,
        })),
      });
    }

    return NextResponse.json({ success: true, message: "تم إرسال التنبيهات" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
