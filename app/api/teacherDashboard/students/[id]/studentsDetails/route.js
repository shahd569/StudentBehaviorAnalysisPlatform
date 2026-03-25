import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req, { params }) {
  try {
    const { id } = await params;
    const studentId = parseInt(id);

    if (isNaN(studentId)) {
      return NextResponse.json({ message: "ID غير صالح" }, { status: 400 });
    }

    const studentInfo = await prisma.Users.findMany({
      where: {
        id: studentId,
      },
      select: {
        firstName: true,
        lastName: true,
        universityId: true,
        college: true,
        major: true,
        academicYear: true,
      },
    });
    return NextResponse.json({ studentInfo }, { status: 200 });
  } catch (error) {
    console.error("Error fetching student info:", error);
    return NextResponse.json(
      { message: "حدث خطأ في جلب تفاصيل الطالب" },
      { status: 500 },
    );
  }
}
