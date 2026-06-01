import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { message: "غير مصرح لك بالوصول" },
        { status: 401 },
      );
    }

    const body = await req.json();
    const {
      employeeId,
      firstName,
      lastName,
      teacherOverview,
      teacherSpecialization,
    } = body;

    if (!employeeId || !firstName || !lastName) {
      return NextResponse.json(
        { message: "الرقم الوظيفي والاسم حقول مطلوبة" },
        { status: 400 },
      );
    }

    const existingStaff = await prisma.AuthorizedStuff.findUnique({
      where: { employeeId },
    });

    if (existingStaff) {
      return NextResponse.json(
        { message: "هذا الرقم الوظيفي مضاف ومصرح له مسبقاً في النظام" },
        { status: 409 },
      );
    }

    const newTeacher = await prisma.AuthorizedStuff.create({
      data: {
        employeeId,
        firstName,
        lastName,
        teacherOverview: teacherOverview || null,
        teacherSpecialization: teacherSpecialization || null,
      },
    });

    return NextResponse.json(
      { message: "تم إضافة المدرس المصرح له بنجاح", teacher: newTeacher },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating single teacher authorization:", error);
    return NextResponse.json(
      { message: "حدث خطأ داخلي في السيرفر" },
      { status: 500 },
    );
  }
}
