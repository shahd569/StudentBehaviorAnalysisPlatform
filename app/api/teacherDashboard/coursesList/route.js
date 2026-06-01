import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { id } from "zod/v4/locales";

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
    const courses = await prisma.Course.findMany({
      where: { instructorId: teacherId },
      select: {
        id: true,
        courseName: true,
      },
      orderBy: {
        courseName: "asc",
      },
    });

    return NextResponse.json(courses);
  } catch (error) {
    return NextResponse.json({ message: "خطأ في جلب المواد" }, { status: 500 });
  }
}
