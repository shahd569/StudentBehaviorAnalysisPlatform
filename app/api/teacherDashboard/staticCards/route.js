import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../../../lib/auth";

export async function GET() {
  try {
    // const session = await getServerSession(authOptions);

    // if (!session || !session.user || session.user.role !== "TEACHER") {
    //   return NextResponse.json(
    //     { message: "غير مسموح لك بالوصول لهذه البيانات" },
    //     { status: 401 },
    //   );
    // }

    // const teacherId = parseInt(session.user.id);

    const teacherId = 17;
    const [totalStudents, students] = await Promise.all([
      prisma.Enrollment.count({
        where: {
          course: {
            instructorId: teacherId,
          },
        },
      }),

      prisma.studentPerformanceView.findMany({
        where: { teacherId: teacherId },
      }),
    ]);

    const MAX_SCORE = 220;

    const excellentStudents = students.filter((s) => {
      const total =
        s.academicScore + s.commitmentScore + Number(s.activityScore || 0);
      const percentage = (total / MAX_SCORE) * 100;
      return percentage >= 85;
    }).length;

    const weakStudents = students.filter((s) => {
      const total =
        s.academicScore + s.commitmentScore + Number(s.activityScore || 0);
      const percentage = (total / MAX_SCORE) * 100;
      return percentage <= 65;
    }).length;

    return NextResponse.json({
      totalStudents,
      excellentStudents,
      weakStudents,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "فشل جلب البيانات" }, { status: 500 });
  }
}
