import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    const session = getServerSession(authOptions);
    if (!session || !session.user || session.user.role !== "TEACHER") {
      return NextResponse.json(
        { message: "غير مسموح لك بالوصول لهذه البيانات" },
        { status: 401 }
      );
    }
    const teacherId = parseInt(session.user.id);
    // const teacherId = 17;
    const studentsData = await prisma.StudentPerformanceView.findMany({
      where: {
        teacherId: teacherId,
      },
    });
    let excellent = 0;
    let average = 0;
    let weake = 0;

    studentsData.forEach((student) => {
      const totalScore =
        student.academicScore + student.commitmentScore + student.activityScore;
      if (totalScore >= 85) {
        excellent++;
      } else if (totalScore <= 65) {
        weake++;
      } else {
        average++;
      }
    });

    const pieChartData = [
      { name: "متفوق", value: excellent, fill: "#10B981" },
      { name: "متوسط", value: average, fill: "#F59E0B" },
      { name: "يحتاج متابعة", value: weake, fill: "#EF4444" },
    ];

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const studentIds = studentsData.map((s) => s.studentId);

    const sessions = await prisma.userSession.findMany({
      where: {
        studentId: { in: studentIds },
        startTime: { gte: sevenDaysAgo },
      },
      select: {
        startTime: true,
        studentId: true,
      },
    });

    const barChartData = [];

    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() - i);

      const dayName = d.toLocaleDateString("en-US", { weekday: "short" });

      const activeStudentsInThisDay = sessions.filter((session) => {
        const sessionDate = new Date(session.startTime);
        return (
          sessionDate.getDate() === d.getDate() &&
          sessionDate.getMonth() === d.getMonth()
        );
      });

      const uniqueStudentsCount = new Set(
        activeStudentsInThisDay.map((s) => s.studentId)
      ).size;

      barChartData.unshift({
        name: dayName,
        students: uniqueStudentsCount,
      });
    }

    return NextResponse.json(
      {
        pieChartData,
        barChartData,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل جلب المخططات" }, { status: 500 });
  }
}
