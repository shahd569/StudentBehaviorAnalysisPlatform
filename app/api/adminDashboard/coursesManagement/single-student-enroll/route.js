import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session || session.user.role !== "ADMIN") {
    //   return NextResponse.json({ error: "غير مصرح لك." }, { status: 401 });
    // }

    const body = await req.json();
    const { courseId, universityId } = body;

    if (!courseId || !universityId) {
      return NextResponse.json(
        { message: "البيانات المرسلة غير كاملة" },
        { status: 400 },
      );
    }

    const studentInfo = await prisma.Users.findUnique({
      where: {
        universityId: universityId.toString(),
      },
      select: {
        id: true,
      },
    });

    if (!studentInfo) {
      return NextResponse.json(
        { message: "عذراً، لم يتم العثور على طالب بهذا الرقم الجامعي" },
        { status: 404 },
      );
    }

    const existingStudent = await prisma.Enrollment.findUnique({
      where: {
        studentId_courseId: {
          studentId: studentInfo.id,
          courseId: parseInt(courseId),
        },
      },
    });

    if (existingStudent) {
      return NextResponse.json(
        { message: "هذا الطالب مسجل مسبقاً في هذا المقرر بالفعل" },
        { status: 400 },
      );
    }

    await prisma.Enrollment.create({
      data: {
        courseId: parseInt(courseId),
        studentId: studentInfo.id,
      },
    });

    return NextResponse.json(
      { message: "تم تسجيل الطالب في المقرر بنجاح" },
      { status: 201 },
    );
  } catch (error) {
    console.error("ERROR:", error);
    return NextResponse.json(
      { message: "حدث خطأ في السيرفر" },
      { status: 500 },
    );
  }
}
