import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";
import { getServerSession } from "next-auth";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "STUDENT") {
      return NextResponse.json({ message: "غير مسموح" }, { status: 401 });
    }
    const studentId = parseInt(session.user.id);

    // استخدام groupBy لتجميع الواجبات حسب اسم المادة وحساب المتوسط
    const performanceData = await prisma.assignmentSubmission.groupBy({
      by: ["assignmentId"],
      where: {
        studentId: studentId,
        finalScore: { not: null },
      },
      _avg: {
        finalScore: true,
      },
    });

    const submissions = await prisma.assignmentSubmission.findMany({
      where: { studentId: studentId, finalScore: { not: null } },
      include: {
        assignment: {
          include: {
            lesson: { include: { course: true } },
          },
        },
      },
    });

    // تجميع البيانات للحصول على المتوسط لكل مادة
    const courseGrades = {};
    submissions.forEach((s) => {
      const name = s.assignment.lesson.course.courseName;
      if (!courseGrades[name]) {
        courseGrades[name] = { total: 0, count: 0 };
      }
      courseGrades[name].total += s.finalScore;
      courseGrades[name].count += 1;
    });

    const studentPerformanceInfo = Object.keys(courseGrades).map((name) => ({
      courseName: name,
      averageScore: courseGrades[name].total / courseGrades[name].count,
    }));

    return NextResponse.json({ studentPerformanceInfo });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ message: "خطأ داخلي" }, { status: 500 });
  }
}
