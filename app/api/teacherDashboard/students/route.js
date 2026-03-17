import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // تأكدي من صحة المسارات

export async function GET() {
  try {
    // 1. التحقق من الجلسة (مُعلق للاختبار)
    // const session = await getServerSession(authOptions);
    // if (!session || !session.user || session.user.role !== "TEACHER") {
    //   return NextResponse.json({ message: "غير مسموح" }, { status: 401 });
    // }
    // const teacherId = parseInt(session.user.id);
    const teacherId = 17;

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);
    dateLimit.setHours(0, 0, 0, 0);

    const [studentsData, performances] = await Promise.all([
      prisma.users.findMany({
        where: {
          role: "STUDENT",
          enrollments: {
            some: { course: { instructorId: teacherId } },
          },
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          profilePictureUrl: true,
          universityId: true,
          major: true,
          academicYear: true,
          enrollments: {
            where: { course: { instructorId: teacherId } },
            select: { course: { select: { courseName: true } } },
          },

          sessions: {
            where: {
              startTime: { gte: dateLimit },
            },
            select: { id: true },
          },
        },
      }),

      prisma.studentPerformanceView.findMany({
        where: { teacherId: teacherId },
      }),
    ]);

    const formattedStudents = studentsData.map((student) => {
      const studentPerf = performances.find((p) => p.studentId === student.id);
      let performanceStatus = "غير محدد";
      let percentageScore = 0;

      if (studentPerf) {
        const academic = studentPerf.academicScore || 0;
        const commitment = studentPerf.commitmentScore || 0;
        const activity = Number(studentPerf.activityScore || 0);

        const rawTotalScore = academic + commitment + activity;
        const MAX_SCORE = 220;

        percentageScore = Math.round((rawTotalScore / MAX_SCORE) * 100);

        if (percentageScore >= 85) performanceStatus = "ممتاز";
        else if (percentageScore <= 65) performanceStatus = "ضعيف";
        else performanceStatus = "جيد";
      }

      const sessionsCount = student.sessions.length;
      let activityStatus = "غير نشط";

      if (sessionsCount >= 3) {
        activityStatus = "نشط";
      } else if (sessionsCount >= 1) {
        activityStatus = "منخفض";
      }

      const courses = student.enrollments
        .map((e) => e.course.courseName)
        .join("، ");

      return {
        id: student.id,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        img: student.profilePictureUrl || "/image/student.png",
        courses: courses,
        universityId: student.universityId,
        major: student.major,
        academicYear: student.academicYear,
        performance: performanceStatus,
        activity: activityStatus,
        sessionsCount: sessionsCount,
        score: percentageScore,
      };
    });

    return NextResponse.json({ students: formattedStudents }, { status: 200 });
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب بيانات الطلاب" },
      { status: 500 },
    );
  }
}
