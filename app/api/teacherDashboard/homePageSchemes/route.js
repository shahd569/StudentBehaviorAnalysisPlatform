import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function GET() {
  try {
    // const session = getServerSession(authOptions);
    // if (!session || !session.user || session.user.role !== "TEACHER") {
    //   return NextResponse.json(
    //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
    //     { status: 401 }
    //   );
    // }
    // const teacherId = parseInt(session.user.id);
    const teacherId = 17;
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

    const studentIds = studentsData.map((s) => s.studentId);

    const dateLimit = new Date();
    dateLimit.setDate(dateLimit.getDate() - 7);
    dateLimit.setHours(0, 0, 0, 0);

    const sessions = await prisma.userSession.findMany({
      where: {
        studentId: { in: studentIds },
        startTime: { gte: dateLimit },
      },
      select: {
        startTime: true,
        studentId: true,
      },
    });

    const barChartData = [];
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() - i);

      const tYear = targetDate.getFullYear();
      const tMonth = targetDate.getMonth();
      const tDay = targetDate.getDate();

      const studentsInThisDay = sessions.filter((session) => {
        const sDate = new Date(session.startTime);
        return (
          sDate.getFullYear() === tYear &&
          sDate.getMonth() === tMonth &&
          sDate.getDate() === tDay
        );
      });

      const uniqueCount = new Set(studentsInThisDay.map((s) => s.studentId))
        .size;

      barChartData.push({
        name: days[targetDate.getDay()],
        students: uniqueCount,
      });
    }
    return NextResponse.json({ pieChartData, barChartData }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل جلب المخططات" }, { status: 500 });
  }
}
