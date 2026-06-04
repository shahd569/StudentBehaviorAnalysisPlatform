import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالقيام بهذا الإجراء" },
        { status: 401 },
      );
    }

    const studentsCount = await prisma.Users.count({
      where: { role: "STUDENT" },
    });

    const teachersCount = await prisma.Users.count({
      where: { role: "TEACHER" },
    });

    const coursesCount = await prisma.Course.count();

    const lessonsCount = await prisma.Lesson.count();

    return NextResponse.json({
      studentsCount,
      teachersCount,
      coursesCount,
      lessonsCount,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "حدث خطأ أثناء جلب البيانات" },
      { status: 500 },
    );
  }
}
