import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    }
    const body = await req.json();
    const {
      courseName,
      description,
      academicYear,
      semester,
      coursePictureUrl,
      status,
      instructorId,
    } = body;

    if (
      !courseName ||
      !semester ||
      !status ||
      academicYear == undefined ||
      instructorId === undefined
    ) {
      return NextResponse.json(
        { error: "الحقول الأساسية مطلوبة." },
        { status: 400 },
      );
    }
    const newCourse = await prisma.Course.create({
      data: {
        courseName,
        description,
        academicYear,
        semester,
        coursePictureUrl,
        status,
        instructorId,
      },
    });
    return NextResponse.json(
      { message: " تم إنشاءالمقرر بنجاح." },
      { status: 201 },
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "حدث خطأ أثناء إنشاء المقرر." },
      { status: 500 },
    );
  }
}
